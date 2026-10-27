const express = require("express");
const mongoose = require("mongoose");
const Message = require("../models/message");
const User = require("../models/user");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

router.get("/conversations", async (req, res) => {
  try {
    const email = req.user.email.toLowerCase();
    const messages = await Message.find({
      $or: [{ fromEmail: email }, { toEmail: email }]
    }).sort({ createdAt: -1 }).limit(1000);

    const conversations = new Map();
    for (const message of messages) {
      const isSender = message.fromEmail === email;
      const otherEmail = isSender ? message.toEmail : message.fromEmail;
      if (!conversations.has(otherEmail)) {
        conversations.set(otherEmail, {
          email: otherEmail,
          name: isSender ? message.toName : message.fromName,
          vehicleId: message.vehicleId ? String(message.vehicleId) : "",
          vehicleTitle: message.vehicleTitle || "",
          lastMessage: message.text,
          updatedAt: message.createdAt
        });
      }
    }

    res.json({ success: true, conversations: Array.from(conversations.values()) });
  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load conversations." });
  }
});

router.get("/with/:email", async (req, res) => {
  try {
    const currentEmail = req.user.email.toLowerCase();
    const otherEmail = String(req.params.email || "").trim().toLowerCase();

    if (!otherEmail || otherEmail === currentEmail) {
      return res.status(400).json({ success: false, message: "Choose another valid account." });
    }

    const messages = await Message.find({
      $or: [
        { fromEmail: currentEmail, toEmail: otherEmail },
        { fromEmail: otherEmail, toEmail: currentEmail }
      ]
    }).sort({ createdAt: 1 }).limit(1000);

    await Message.updateMany(
      { fromEmail: otherEmail, toEmail: currentEmail, readAt: null },
      { $set: { readAt: new Date() } }
    );

    const otherUser = await User.findOne({ email: otherEmail }).select("name email");
    res.json({
      success: true,
      otherUser: otherUser ? { name: otherUser.name, email: otherUser.email } : { name: otherEmail, email: otherEmail },
      messages
    });
  } catch (error) {
    console.error("GET MESSAGE THREAD ERROR:", error);
    res.status(500).json({ success: false, message: "Could not load this conversation." });
  }
});

router.post("/with/:email", async (req, res) => {
  try {
    const currentEmail = req.user.email.toLowerCase();
    const otherEmail = String(req.params.email || "").trim().toLowerCase();
    const text = String(req.body?.text || "").trim();

    if (!text) {
      return res.status(400).json({ success: false, message: "Write a message first." });
    }
    if (text.length > 4000) {
      return res.status(400).json({ success: false, message: "Messages cannot exceed 4000 characters." });
    }
    if (!otherEmail || otherEmail === currentEmail) {
      return res.status(400).json({ success: false, message: "Choose another valid account." });
    }

    const recipient = await User.findOne({ email: otherEmail }).select("name email");
    if (!recipient) {
      return res.status(404).json({ success: false, message: "That user does not have a VehicleHub account yet." });
    }

    let vehicleId = null;
    if (req.body.vehicleId && mongoose.isValidObjectId(req.body.vehicleId)) {
      vehicleId = req.body.vehicleId;
    }

    const message = await Message.create({
      fromUser: req.user._id,
      fromEmail: currentEmail,
      fromName: req.user.name,
      toUser: recipient._id,
      toEmail: recipient.email.toLowerCase(),
      toName: recipient.name,
      vehicleId,
      vehicleTitle: String(req.body.vehicleTitle || "").trim().slice(0, 200),
      text
    });

    res.status(201).json({ success: true, message });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);
    res.status(500).json({ success: false, message: "Could not send this message." });
  }
});

module.exports = router;
