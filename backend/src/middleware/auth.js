const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

async function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  const token = header.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "Invalid authentication token",
      });
    }

    req.user = user;
    req.auth = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired authentication token",
    });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Administrator access required",
    });
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
};
