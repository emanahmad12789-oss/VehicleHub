
const express = require("express");
const router = express.Router();

const Vehicle = require("../models/vehicle");

// ======================================
// GET MY LISTINGS
// IMPORTANT: Keep this route ABOVE /:id
// ======================================

router.get("/my-listings", async (req, res) => {
  try {
    const email = String(req.query.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required to fetch your listings.",
      });
    }

    // Match existing listings stored with either email field.
    const vehicles = await Vehicle.find({
      $or: [
        { sellerEmail: { $regex: `^${escapeRegex(email)}$`, $options: "i" } },
        { email: { $regex: `^${escapeRegex(email)}$`, $options: "i" } },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error("MY LISTINGS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your listings.",
    });
  }
});

// Escape special characters before using an email in a regex.
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// ======================================
// GET ALL VEHICLES
// ======================================

router.get("/", async (req, res) => {
  try {
    const vehicles = await Vehicle.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(vehicles);
  } catch (error) {
    console.error("GET VEHICLES ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles.",
    });
  }
});

// ======================================
// GET SINGLE VEHICLE
// ======================================

router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    return res.status(200).json(vehicle);
  } catch (error) {
    console.error("GET SINGLE VEHICLE ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Invalid vehicle ID or failed to fetch vehicle.",
    });
  }
});

// ======================================
// ADD VEHICLE
// ======================================

router.post("/", async (req, res) => {
  try {
    const body = { ...req.body };

    // Normalize seller email supplied by the frontend.
    const sellerEmail = String(
      body.sellerEmail || body.email || body.userEmail || ""
    )
      .trim()
      .toLowerCase();

    if (sellerEmail) {
      body.sellerEmail = sellerEmail;
      body.email = sellerEmail;
    }

    const vehicle = new Vehicle(body);
    const savedVehicle = await vehicle.save();

    return res.status(201).json({
      success: true,
      message: "Vehicle added successfully.",
      vehicle: savedVehicle,
    });
  } catch (error) {
    console.error("ADD VEHICLE ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to add vehicle.",
    });
  }
});

// ======================================
// EDIT VEHICLE
// ======================================

router.put("/:id", async (req, res) => {
  try {
    const updates = { ...req.body };

    // Keep email fields consistent when supplied.
    const sellerEmail = String(
      updates.sellerEmail || updates.email || updates.userEmail || ""
    )
      .trim()
      .toLowerCase();

    if (sellerEmail) {
      updates.sellerEmail = sellerEmail;
      updates.email = sellerEmail;
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle updated successfully.",
      vehicle,
    });
  } catch (error) {
    console.error("UPDATE VEHICLE ERROR:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Failed to update vehicle.",
    });
  }
});

// ======================================
// DELETE VEHICLE
// ======================================

router.delete("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Vehicle deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE VEHICLE ERROR:", error);

    return res.status(400).json({
      success: false,
      message: "Failed to delete vehicle.",
    });
  }
});

module.exports = router;
