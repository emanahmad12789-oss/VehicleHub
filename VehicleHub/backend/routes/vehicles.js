
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Vehicle = require("../models/vehicle");

function normalizeEmail(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// GET ALL VEHICLES
router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({ createdAt: -1 });
    return res.status(200).json(vehicles);
  } catch (error) {
    console.error("GET VEHICLES ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
});

// MY LISTINGS
router.get("/my-listings", async (req, res) => {
  try {
    const email = normalizeEmail(req.query.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const emailPattern = new RegExp(`^${escapeRegex(email)}$`, "i");

    const vehicles = await Vehicle.find({
      $or: [
        { sellerEmail: emailPattern },
        { email: emailPattern },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error("MY LISTINGS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
    });
  }
});

// GET ONE VEHICLE
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json(vehicle);
  } catch (error) {
    console.error("GET VEHICLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
    });
  }
});

// ADD VEHICLE
router.post("/", async (req, res) => {
  try {
    const body = req.body || {};

    const email = normalizeEmail(body.sellerEmail || body.email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Seller email is required to save a listing",
      });
    }

    const title =
      String(body.title || body.name || "").trim();

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Vehicle title is required",
      });
    }

    const vehicleData = {
      ...body,
      title,
      email,
      sellerEmail: email,
    };

    const vehicle = new Vehicle(vehicleData);
    const savedVehicle = await vehicle.save();

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle: savedVehicle,
    });
  } catch (error) {
    console.error("ADD VEHICLE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add vehicle",
      error: error.message,
    });
  }
});

// EDIT VEHICLE
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const updates = { ...req.body };

    if (updates.email) {
      updates.email = normalizeEmail(updates.email);
    }

    if (updates.sellerEmail) {
      updates.sellerEmail = normalizeEmail(updates.sellerEmail);
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("UPDATE VEHICLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
      error: error.message,
    });
  }
});

// DELETE VEHICLE
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid vehicle ID",
      });
    }

    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("DELETE VEHICLE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
});

module.exports = router;
