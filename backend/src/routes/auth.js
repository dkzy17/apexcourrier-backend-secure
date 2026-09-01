const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { loginLimiter, verifyLimiter } = require("../middleware/rateLimit");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not configured");
}

// POST /api/auth/login
router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Both email and password are required.",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(500).json({
      message: "Server error during authentication",
    });
  }
});

// POST /api/auth/verify
router.post("/verify", verifyLimiter, async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      valid: false,
      message: "No token provided",
    });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return res.status(401).json({
      valid: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded.userId) {
      return res.status(401).json({
        valid: false,
        message: "Invalid token",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        valid: false,
        message: "User no longer exists",
      });
    }

    return res.status(200).json({
      valid: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(401).json({
      valid: false,
      message: "Invalid or expired token",
    });
  }
});

module.exports = router;
