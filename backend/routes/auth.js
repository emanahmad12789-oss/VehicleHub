const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");
const { requireAuth } = require("../middleware/auth");

function signToken(user) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured");
  return jwt.sign({ id: user._id, email: user.email }, secret, { expiresIn: "7d" });
}

// ================= REGISTER =================

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, city, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Name, email and password are required." });
    }
    const cleanEmail = String(email).trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);
    const user = await User.create({
      name: String(name).trim(),
      email: cleanEmail,
      phone: phone || "",
      city: city || "Pakistan",
      password: hashedPassword
    });
    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city }
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({ success: false, message: "Registration failed." });
  }
});

// ================= LOGIN =================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) return res.status(401).json({ success: false, message: "Invalid email or password." });

    let passwordMatch = await bcrypt.compare(String(password), user.password);
    // Migrate old manually-created plain-text passwords after successful login.
    if (!passwordMatch && typeof user.password === "string" && user.password === password) {
      user.password = await bcrypt.hash(String(password), 10);
      await user.save();
      passwordMatch = true;
    }
    if (!passwordMatch) return res.status(401).json({ success: false, message: "Invalid email or password." });

    const token = signToken(user);
    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: { id: user._id, _id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city }
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
});

// ================= GET OWN PROFILE =================

router.get("/profile/:id", requireAuth, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) {
      return res.status(403).json({ success: false, message: "You can only view your own profile." });
    }
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    return res.json({ success: true, user });
  } catch (error) {
    console.error("PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to get profile." });
  }
});

// ================= UPDATE OWN PROFILE =================

router.put("/profile/:id", requireAuth, async (req, res) => {
  try {
    if (String(req.user._id) !== String(req.params.id)) {
      return res.status(403).json({ success: false, message: "You can only update your own profile." });
    }
    const { name, email, phone, city } = req.body || {};
    const cleanEmail = email == null ? req.user.email : String(email).trim().toLowerCase();
    const ownerEmail = String(process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || "").trim().toLowerCase();

    // Keep the configured owner identity stable so a profile edit cannot lock the owner out.
    if (ownerEmail && String(req.user.email).trim().toLowerCase() === ownerEmail && cleanEmail !== ownerEmail) {
      return res.status(400).json({ success: false, message: "The configured owner email cannot be changed here. Update ADMIN_EMAIL in the backend settings first." });
    }
    const duplicate = await User.findOne({ email: cleanEmail, _id: { $ne: req.user._id } });
    if (duplicate) return res.status(409).json({ success: false, message: "That email is already used by another account." });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name: name == null ? req.user.name : String(name).trim(), email: cleanEmail, phone: phone == null ? req.user.phone : String(phone).trim(), city: city == null ? req.user.city : String(city).trim() },
      { new: true, runValidators: true }
    ).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    return res.json({ success: true, message: "Profile updated successfully.", user });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to update profile." });
  }
});

module.exports = router;
