const express = require("express");
const User = require("../models/user");
const Vehicle = require("../models/vehicle");
const Message = require("../models/message");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth, requireAdmin);

router.get("/overview", async (req, res) => {
  try {
    const [users, vehicles, messages, recentVehicles] = await Promise.all([
      User.countDocuments(),
      Vehicle.countDocuments(),
      Message.countDocuments(),
      Vehicle.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);
    return res.json({ success: true, stats: { users, vehicles, messages }, recentVehicles });
  } catch (error) {
    console.error("ADMIN OVERVIEW ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not load owner dashboard." });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 }).limit(1000).lean();
    return res.json({ success: true, users });
  } catch (error) {
    console.error("ADMIN USERS ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not load users." });
  }
});

router.get("/vehicles", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 }).limit(1000).lean();
    return res.json({ success: true, vehicles });
  } catch (error) {
    console.error("ADMIN VEHICLES ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not load vehicles." });
  }
});

router.delete("/vehicles/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." });
    return res.json({ success: true, message: "Vehicle deleted." });
  } catch (error) {
    console.error("ADMIN DELETE VEHICLE ERROR:", error);
    return res.status(400).json({ success: false, message: "Could not delete vehicle." });
  }
});

router.get("/messages", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).limit(1000).lean();
    return res.json({ success: true, messages });
  } catch (error) {
    console.error("ADMIN MESSAGES ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not load messages." });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    return res.json({ success: true, message: "Message deleted." });
  } catch (error) {
    console.error("ADMIN DELETE MESSAGE ERROR:", error);
    return res.status(400).json({ success: false, message: "Could not delete message." });
  }
});

module.exports = router;
