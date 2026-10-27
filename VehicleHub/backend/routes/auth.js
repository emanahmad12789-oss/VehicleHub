
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body || {};

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: cleanEmail });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: typeof phone === "string" ? phone.trim() : "",
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered. Please log in.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter your email and password.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    // Log diagnostic information without revealing passwords or hashes.
    console.log("LOGIN EMAIL:", cleanEmail);
    console.log("USER FOUND:", Boolean(user));
    console.log(
      "PASSWORD HASH FORMAT:",
      Boolean(user && /^\$2[aby]\$/.test(user.password))
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Registration hashes passwords with bcrypt.
    // Existing accounts with plaintext passwords need a separate safe migration.
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from environment variables.");

      return res.status(500).json({
        success: false,
        message: "Authentication is not configured on the server.",
      });
    }

    const token = jwt.sign(
      { userId: user._id.toString() },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
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

    return res.json({ success: true, user });
  } catch (error) {
    console.error("PROFILE ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to get profile.",
    });
  }
});

// ================= UPDATE PROFILE =================

router.put("/profile/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body || {};

    const updates = {};

    if (typeof name === "string") updates.name = name.trim();
    if (typeof email === "string") {
      updates.email = email.trim().toLowerCase();
    }
    if (typeof phone === "string") updates.phone = phone.trim();

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "That email is already in use.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update profile.",
    });
  }
});

module.exports = router;
