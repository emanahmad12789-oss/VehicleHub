const express = require("express");
const mongoose = require("mongoose");
const { requireAuth, requireOwner } = require("../middleware/auth");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Message = require("../models/message");

const router = express.Router();
router.use(requireAuth, requireOwner);

router.get("/overview", async (req, res) => {
  try {
    const [users, vehicles, messages, cars, bikes] = await Promise.all([
      User.countDocuments(),
      Vehicle.countDocuments(),
      Message.countDocuments(),
      Vehicle.countDocuments({ type: "Car" }),
      Vehicle.countDocuments({ type: "Bike" })
    ]);
    res.json({ success: true, stats: { users, vehicles, messages, cars, bikes } });
  } catch (error) {
    console.error("OWNER OVERVIEW ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load owner dashboard." });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email phone city createdAt updatedAt")
      .sort({ createdAt: -1 }).limit(1000).lean();
    res.json({ success: true, users });
  } catch (error) {
    console.error("OWNER USERS ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load users." });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID." });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (String(user.email).toLowerCase() === String(req.user.email).toLowerCase()) {
      return res.status(400).json({ success: false, message: "The owner account cannot be deleted here." });
    }
    const email = String(user.email).toLowerCase();
    await Promise.all([
      user.deleteOne(),
      Vehicle.deleteMany({ $or: [{ sellerEmail: email }, { email }] }),
      Message.deleteMany({ $or: [{ fromEmail: email }, { toEmail: email }] })
    ]);
    res.json({ success: true, message: "User and their listings/messages were deleted." });
  } catch (error) {
    console.error("OWNER DELETE USER ERROR:", error);
    res.status(500).json({ success: false, message: "Could not delete this user." });
  }
});

router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find({}).sort({ createdAt: -1 }).limit(1000).lean();
    res.json({ success: true, vehicles });
  } catch (error) {
    console.error("OWNER VEHICLES ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load vehicle listings." });
  }
});

router.delete("/vehicles/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: "Invalid vehicle ID." });
    }
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." });
    res.json({ success: true, message: "Vehicle listing deleted." });
  } catch (error) {
    console.error("OWNER DELETE VEHICLE ERROR:", error);
    res.status(500).json({ success: false, message: "Could not delete this listing." });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find({})
      .sort({ createdAt: -1 }).limit(500)
      .select("fromName fromEmail toName toEmail vehicleTitle text createdAt readAt")
      .lean();
    res.json({ success: true, messages });
  } catch (error) {
    console.error("OWNER MESSAGES ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load messages." });
  }
});

module.exports = router;
