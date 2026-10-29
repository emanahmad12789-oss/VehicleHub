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
      User.countDocuments(), Vehicle.countDocuments(), Message.countDocuments(),
      Vehicle.countDocuments({ type: "Car" }), Vehicle.countDocuments({ type: "Bike" })
    ]);
    res.json({ success: true, stats: { users, vehicles, messages, cars, bikes } });
  } catch (error) {
    console.error("OWNER OVERVIEW ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load owner dashboard." });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email phone city status createdAt updatedAt").sort({ createdAt: -1 }).limit(1000).lean();
    res.json({ success: true, users });
  } catch (error) {
    console.error("OWNER USERS ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load users." });
  }
});

router.delete("/users/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid user ID." });
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

router.patch("/users/:id/status", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid user ID." });
    const status = String(req.body?.status || "").trim().toLowerCase();
    if (!["active", "suspended"].includes(status)) return res.status(400).json({ success: false, message: "Status must be active or suspended." });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (String(user.email).trim().toLowerCase() === String(req.user.email).trim().toLowerCase()) {
      return res.status(400).json({ success: false, message: "You cannot change your own owner account status." });
    }
    user.status = status;
    await user.save();
    return res.json({ success: true, message: status === "suspended" ? "User suspended." : "User reactivated.", user: { _id: user._id, status: user.status } });
  } catch (error) {
    console.error("OWNER UPDATE USER STATUS ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not update this user's status." });
  }
});

router.patch("/users/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid user ID." });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });
    if (String(user.email).trim().toLowerCase() === String(req.user.email).trim().toLowerCase()) {
      return res.status(400).json({ success: false, message: "Edit your owner account through account settings, not user management." });
    }
    for (const field of ["name", "phone", "city"]) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) user[field] = String(req.body[field] || "").trim();
    }
    if (!user.name) return res.status(400).json({ success: false, message: "Name cannot be empty." });
    await user.save();
    res.json({ success: true, message: "User details updated.", user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, city: user.city, status: user.status, createdAt: user.createdAt } });
  } catch (error) {
    console.error("OWNER EDIT USER ERROR:", error);
    res.status(400).json({ success: false, message: "Could not update user details." });
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

router.patch("/vehicles/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid vehicle ID." });
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." });
    const fields = ["title", "name", "type", "make", "brand", "model", "year", "price", "mileage", "fuel", "transmission", "condition", "color", "category", "location", "city", "description", "image", "imageUrl", "sellerName", "sellerEmail", "sellerPhone", "email", "phone"];
    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) vehicle[field] = req.body[field];
    }
    if (req.body?.price !== undefined && (!Number.isFinite(Number(req.body.price)) || Number(req.body.price) <= 0)) {
      return res.status(400).json({ success: false, message: "Price must be greater than zero." });
    }
    if (req.body?.year !== undefined && req.body.year !== "") vehicle.year = Number(req.body.year);
    if (req.body?.price !== undefined) vehicle.price = Number(req.body.price);
    if (!String(vehicle.title || "").trim()) return res.status(400).json({ success: false, message: "Vehicle title is required." });
    await vehicle.save();
    res.json({ success: true, message: "Vehicle listing updated.", vehicle });
  } catch (error) {
    console.error("OWNER EDIT VEHICLE ERROR:", error);
    res.status(400).json({ success: false, message: "Could not update this listing. Check the values." });
  }
});

router.delete("/vehicles/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid vehicle ID." });
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
    const messages = await Message.find({}).sort({ createdAt: -1 }).limit(500)
      .select("fromName fromEmail toName toEmail vehicleTitle text createdAt readAt").lean();
    res.json({ success: true, messages });
  } catch (error) {
    console.error("OWNER MESSAGES ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load messages." });
  }
});

router.delete("/messages/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: "Invalid message ID." });
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, message: "Message deleted." });
  } catch (error) {
    console.error("OWNER DELETE MESSAGE ERROR:", error);
    res.status(500).json({ success: false, message: "Could not delete this message." });
  }
});

module.exports = router;
