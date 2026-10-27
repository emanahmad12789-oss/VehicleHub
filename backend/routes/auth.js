const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

function signToken(user) {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
}

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, city, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone || "",
      city: city || "Pakistan",
      password: hashedPassword,
    });

    const token = signToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed.",
      error: error.message,
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = signToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Login failed.",
      error: error.message,
    });
  }
});

// ================= GET PROFILE =================

router.get("/profile/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile.",
      error: error.message,
    });
  }
});

// ================= UPDATE PROFILE =================

router.put("/profile/:id", async (req, res) => {
  try {
    const { name, email, phone, city } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        name,
        email: email?.trim().toLowerCase(),
        phone,
        city,
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile.",
      error: error.message,
    });
  }
});

module.exports = router;
