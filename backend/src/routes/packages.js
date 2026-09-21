const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { body, validationResult } = require("express-validator");
const Package = require("../models/Package");
const upload = require("../utils/upload");
const { attachImageUrl } = require("../utils/imageUrl");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const fileToDataUri = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

// ------------------------------------------------------------
// Validation helpers
// ------------------------------------------------------------

const validateObjectId = (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid package id" });
  }

  next();
};

const normalizeMultipart = require("../utils/normalizeMultipart");

const validatePackage = [
  body("sender.name")
    .notEmpty()
    .trim()
    .isLength({ max: 120 })
    .withMessage("Sender name is required and must be <= 120 characters"),

  body("sender.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid sender email is required"),

  body("sender.phone")
    .notEmpty()
    .isLength({ max: 40 })
    .withMessage("Sender phone is required"),

  body("sender.address")
    .notEmpty()
    .isLength({ max: 500 })
    .withMessage("Sender address is required"),

  body("receiver.name")
    .notEmpty()
    .trim()
    .isLength({ max: 120 })
    .withMessage("Receiver name is required"),

  body("receiver.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid receiver email is required"),

  body("receiver.phone")
    .optional({ checkFalsy: true })
    .isLength({ max: 40 }),

  body("receiver.address")
    .notEmpty()
    .isLength({ max: 500 })
    .withMessage("Receiver address is required"),

  body("weight")
    .isFloat({ min: 0.1, max: 100000 })
    .withMessage("Valid weight is required"),

  body("dimensions.length")
    .isFloat({ min: 0.1, max: 100000 })
    .withMessage("Valid length is required"),

  body("dimensions.width")
    .isFloat({ min: 0.1, max: 100000 })
    .withMessage("Valid width is required"),

  body("dimensions.height")
    .isFloat({ min: 0.1, max: 100000 })
    .withMessage("Valid height is required"),

  body("serviceType")
    .isIn(["Standard", "Express", "International"])
    .withMessage("Valid service type is required"),

  body("transportMode")
    .isIn(["Air", "Ground", "Sea", "Rail"])
    .withMessage("Valid transport mode is required"),

  body("expectedDelivery")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Expected delivery must be a valid date"),

  body("quantity")
    .optional()
    .isInt({ min: 1, max: 100000 })
    .withMessage("Quantity must be between 1 and 100000"),

  body("content")
    .optional()
    .isLength({ max: 1000 }),

  body("description")
    .optional()
    .isLength({ max: 5000 }),
];

// ------------------------------------------------------------
// PUBLIC TRACKING PROJECTION
// ------------------------------------------------------------
// Public tracking may return sender/receiver names and addresses
// needed by the tracking page, but never exposes customer email
// addresses or phone numbers.
// ------------------------------------------------------------

function publicPackageView(pkg) {
  const obj = pkg.toObject ? pkg.toObject() : { ...pkg };

  return {
    id: obj._id,
    trackingNumber: obj.trackingNumber,

    // Public shipment route.
    // Prefer dedicated origin/destination fields.
    // Fall back to the historical sender/receiver addresses
    // used by older packages.
    origin: obj.origin || obj.sender?.address || "",
    destination: obj.destination || obj.receiver?.address || "",

    // Never expose private contact/address information publicly.
    sender: {
      name: obj.sender?.name || "",
      email: "",
      phone: "",
      address: "",
    },

    receiver: {
      name: obj.receiver?.name || "",
      email: "",
      phone: "",
      address: "",
    },

    weight: obj.weight,
    dimensions: obj.dimensions,
    serviceType: obj.serviceType,
    transportMode: obj.transportMode,
    expectedDelivery: obj.expectedDelivery,
    content: obj.content || "",
    quantity: obj.quantity || 1,
    description: obj.description || "",
    status: obj.status,

    events: Array.isArray(obj.events)
      ? obj.events.map((event) => ({
          status: event.status,
          location: event.location,
          timestamp: event.timestamp,
          notes: event.notes || "",
        }))
      : [],

    packageImage: obj.packageImage || "",
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
}

// ------------------------------------------------------------
// GET ALL PACKAGES — ADMIN ONLY
// ------------------------------------------------------------

router.get("/", async (req, res, next) => {
  // Public requests may ONLY use trackingNumber.
  // Admin requests may list all packages.

  if (!req.query.trackingNumber) {
    return requireAuth(req, res, () =>
      requireAdmin(req, res, async () => {
        try {
          const pkgs = await Package.find({})
            .sort({ createdAt: -1 })
            .lean();

          res.json(pkgs.map((pkg) => attachImageUrl(req, pkg)));
        } catch (err) {
          console.error("Error fetching packages:", err);
          res.status(500).json({
            message: "Unable to retrieve packages.",
          });
        }
      })
    );
  }

  // ----------------------------------------------------------
  // PUBLIC TRACKING LOOKUP
  // ----------------------------------------------------------

  try {
    const trackingNumber = String(req.query.trackingNumber)
      .trim()
      .slice(0, 100);

    if (!trackingNumber) {
      return res.status(400).json({
        message: "Tracking number is required.",
      });
    }

    const pkg = await Package.findOne({ trackingNumber }).lean();

    if (!pkg) {
      return res.json([]);
    }

    res.json([publicPackageView(pkg)]);
  } catch (err) {
    console.error("Error fetching tracking package:", err);

    res.status(500).json({
      message: "Unable to retrieve tracking information.",
    });
  }
});

// ------------------------------------------------------------
// GET SINGLE PACKAGE — ADMIN ONLY
// ------------------------------------------------------------

router.get(
  "/:id",
  requireAuth,
  requireAdmin,
  validateObjectId,
  async (req, res) => {
    try {
      const pkg = await Package.findById(req.params.id);

      if (!pkg) {
        return res.status(404).json({
          message: "Package not found",
        });
      }

      res.json(attachImageUrl(req, pkg));
    } catch (err) {
      console.error("Error fetching package:", err);

      res.status(500).json({
        message: "Unable to retrieve package.",
      });
    }
  }
);

// ------------------------------------------------------------
// CREATE PACKAGE — ADMIN ONLY
// ------------------------------------------------------------

router.post(
  "/",
  requireAuth,
  requireAdmin,
  upload.single("packageImage"),
  normalizeMultipart,
  validatePackage,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const packageData = {
        ...req.body,
      };

      if (req.file) {
        packageData.packageImage = fileToDataUri(req.file);
      }

      const pkg = await Package.create(packageData);

      res.status(201).json(attachImageUrl(req, pkg));
    } catch (err) {
      console.error("Error creating package:", err);

      if (err.code === 11000) {
        return res.status(409).json({
          message: "Tracking number already exists.",
        });
      }

      res.status(500).json({
        message: "Unable to create package.",
      });
    }
  }
);

// ------------------------------------------------------------
// UPDATE PACKAGE — ADMIN ONLY
// ------------------------------------------------------------

router.put(
  "/:id",
  requireAuth,
  requireAdmin,
  validateObjectId,
  upload.single("packageImage"),
  normalizeMultipart,
  async (req, res) => {
    try {
      // PUT is the live admin update endpoint.
      // It performs a partial update: omitted fields remain unchanged.
      const allowedFields = [
        "origin",
        "destination",
        "sender",
        "receiver",
        "weight",
        "dimensions",
        "serviceType",
        "transportMode",
        "expectedDelivery",
        "content",
        "quantity",
        "description",
        "status",
      ];

      const updateData = {};

      for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body, field)) {
          updateData[field] = req.body[field];
        }
      }

      // Only replace the image when an actual file was uploaded.
      // If packageImage is omitted, the existing image remains unchanged.
      if (req.file) {
        updateData.packageImage = fileToDataUri(req.file);
      }

      updateData.updatedAt = new Date();

      const pkg = await Package.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!pkg) {
        return res.status(404).json({
          message: "Package not found",
        });
      }

      res.json(attachImageUrl(req, pkg));
    } catch (err) {
      console.error("Error updating package:", err);

      if (err.code === 11000) {
        return res.status(409).json({
          message: "Tracking number already exists.",
        });
      }

      res.status(500).json({
        message: "Unable to update package.",
      });
    }
  }
);

// ------------------------------------------------------------
// DELETE PACKAGE — ADMIN ONLY
// ------------------------------------------------------------

router.delete(
  "/:id",
  requireAuth,
  requireAdmin,
  validateObjectId,
  async (req, res) => {
    try {
      const pkg = await Package.findByIdAndDelete(req.params.id);

      if (!pkg) {
        return res.status(404).json({
          message: "Package not found",
        });
      }

      res.json({
        message: "Package deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting package:", err);

      res.status(500).json({
        message: "Unable to delete package.",
      });
    }
  }
);

// ------------------------------------------------------------
// ADD PACKAGE EVENT — ADMIN ONLY
// ------------------------------------------------------------

router.post(
  "/:id/events",
  requireAuth,
  requireAdmin,
  validateObjectId,
  [
    body("status")
      .notEmpty()
      .trim()
      .isLength({ max: 120 })
      .withMessage("Event status is required"),

    body("location")
      .notEmpty()
      .trim()
      .isLength({ max: 500 })
      .withMessage("Event location is required"),

    body("notes")
      .optional()
      .isLength({ max: 2000 })
      .withMessage("Event notes must be <= 2000 characters"),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    try {
      const event = {
        status: req.body.status,
        location: req.body.location,
        notes: req.body.notes || "",
        timestamp: req.body.timestamp
          ? new Date(req.body.timestamp)
          : new Date(),
      };

      const pkg = await Package.findByIdAndUpdate(
        req.params.id,
        {
          $push: {
            events: event,
          },
          $set: {
            status: event.status,
            updatedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!pkg) {
        return res.status(404).json({
          message: "Package not found",
        });
      }

      res.json(attachImageUrl(req, pkg));
    } catch (err) {
      console.error("Error adding package event:", err);

      res.status(500).json({
        message: "Unable to add package event.",
      });
    }
  }
);

module.exports = router;
