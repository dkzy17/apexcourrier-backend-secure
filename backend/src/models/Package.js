const mongoose = require("mongoose");

const pkgSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  sender: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  receiver: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: true },
  },
  weight: {
    type: Number,
    required: true,
  },
  dimensions: {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
  },
  serviceType: {
    type: String,
    required: true,
    enum: ["Standard", "Express", "International"],
  },
  transportMode: {
    type: String,
    required: true,
    enum: ["Air", "Ground", "Sea", "Rail"],
  },
  // Calendar date the admin promises delivery by; stored at UTC midnight so
  // the date entered is the date rendered, regardless of viewer timezone.
  expectedDelivery: {
    type: Date,
    default: null,
  },
  content: {
    type: String,
    default: "",
  },
  quantity: {
    type: Number,
    default: 1,
  },
  description: {
    type: String,
    default: "",
  },
  // Stored as a self-contained base64 data URI (not a filename/path), so the
  // image persists in MongoDB and survives backend redeploys/restarts on
  // hosts with ephemeral disks (e.g. Render). See utils/upload.js.
  packageImage: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    required: true,
    default: "Pending",
  },
  type: {
    type: String,
    enum: ["normal"],
    default: "normal",
  },
  events: [
    {
      status: { type: String, required: true },
      location: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
      notes: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt timestamp before saving
pkgSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Generate tracking number before validation if not provided
// (must run pre-validate, not pre-save, since trackingNumber is required
// and Mongoose runs schema validation before pre-save hooks)
pkgSchema.pre("validate", function (next) {
  if (!this.trackingNumber) {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    this.trackingNumber = `APX${timestamp}${random}`;
  }
  next();
});

module.exports = mongoose.model("Package", pkgSchema);
