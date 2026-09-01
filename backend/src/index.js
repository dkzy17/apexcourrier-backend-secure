require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

const NODE_ENV = process.env.NODE_ENV || "development";
const PORT = Number(process.env.PORT || 4000);

const FRONTEND_URL = process.env.FRONTEND_URL;
const ADMIN_URL = process.env.ADMIN_URL;
const MONGODB_URI = process.env.MONGODB_URI;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// ------------------------------------------------------------
// Required production configuration
// ------------------------------------------------------------

const requiredProductionEnv = [
  ["MONGODB_URI", MONGODB_URI],
  ["JWT_SECRET", JWT_SECRET],
  ["RESEND_API_KEY", RESEND_API_KEY],
  ["FRONTEND_URL", FRONTEND_URL],
  ["ADMIN_URL", ADMIN_URL],
];

if (NODE_ENV === "production") {
  const missing = requiredProductionEnv
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(
      `Missing required production environment variables: ${missing.join(", ")}`
    );
  }
}

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not configured");
}

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

// ------------------------------------------------------------
// Reverse proxy
// ------------------------------------------------------------

app.set("trust proxy", 1);

// ------------------------------------------------------------
// Request parsing
// ------------------------------------------------------------

app.use(
  express.json({
    limit: "15mb",
  })
);

app.use(
  express.urlencoded({
    extended: false,
    limit: "1mb",
  })
);

// ------------------------------------------------------------
// CORS
// ------------------------------------------------------------

const allowedOrigins = [
  FRONTEND_URL,
  ADMIN_URL,
  ...(NODE_ENV !== "production"
    ? [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
      ]
    : []),
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow server-to-server / curl requests that have no Origin.
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ------------------------------------------------------------
// Security headers
// ------------------------------------------------------------

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);

// ------------------------------------------------------------
// Logging
// ------------------------------------------------------------

if (NODE_ENV !== "test") {
  app.use(
    morgan(NODE_ENV === "production" ? "combined" : "dev")
  );
}

// ------------------------------------------------------------
// Database
// ------------------------------------------------------------

mongoose.set("strictQuery", true);

mongoose
  .connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    maxPoolSize: 10,
    minPoolSize: 1,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
    process.exit(1);
  });

// ------------------------------------------------------------
// Routes
// ------------------------------------------------------------

app.use("/api/packages", require("./routes/packages"));
app.use("/api/email", require("./routes/email"));
app.use("/api/auth", require("./routes/auth"));

// ------------------------------------------------------------
// Health check
// ------------------------------------------------------------

app.get("/", (req, res) => {
  res.status(200).json({
    message: "health check",
    timestamp: new Date().toISOString(),
  });
});

// ------------------------------------------------------------
// 404
// ------------------------------------------------------------

app.use((req, res) => {
  res.status(404).json({
    message: "Not found",
  });
});

// ------------------------------------------------------------
// Multer / upload errors
// ------------------------------------------------------------

const multer = require("multer");

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "Uploaded image exceeds the 5 MB limit.",
      });
    }

    if (
      err.code === "LIMIT_FILE_COUNT" ||
      err.code === "LIMIT_UNEXPECTED_FILE"
    ) {
      return res.status(400).json({
        message: "Invalid file upload.",
      });
    }

    return res.status(400).json({
      message: "Invalid file upload.",
    });
  }

  if (
    err &&
    typeof err.message === "string" &&
    (
      err.message.includes("Only JPG, PNG, and WebP") ||
      err.message.includes("Invalid image filename")
    )
  ) {
    return res.status(400).json({
      message: err.message,
    });
  }

  next(err);
});

// ------------------------------------------------------------
// CORS errors
// ------------------------------------------------------------

app.use((err, req, res, next) => {
  if (err && err.message === "Origin not allowed by CORS") {
    return res.status(403).json({
      message: "Origin not allowed.",
    });
  }

  next(err);
});

// ------------------------------------------------------------
// Final error handler
// ------------------------------------------------------------

app.use((err, req, res, next) => {
  console.error("Unhandled application error:", err);

  res.status(500).json({
    message: "Something went wrong.",
  });
});

// ------------------------------------------------------------
// Start server
// ------------------------------------------------------------

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(
    `Server running on port ${PORT} (${NODE_ENV})`
  );
});

function shutdown(signal) {
  console.log(`${signal} received. Shutting down...`);

  server.close(() => {
    mongoose.connection
      .close(false)
      .finally(() => process.exit(0));
  });

  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

