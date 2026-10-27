const express = require("express");
const router = express.Router();

const Vehicle = require("../models/vehicle");

// ======================================
// GET ALL VEHICLES
// ======================================

router.get("/", async (req, res) => {
  try {
    const filter = {};

    // Optional filters: ?type=Car  ?city=Karachi  ?condition=Used
    if (req.query.type) filter.type = req.query.type;
    if (req.query.city && req.query.city !== "All Cities")
      filter.city = req.query.city;
    if (req.query.condition && req.query.condition !== "All")
      filter.condition = req.query.condition;

    const vehicles = await Vehicle.find(filter).sort({
      createdAt: -1,
    });

    res.json(vehicles);
  } catch (error) {
    console.error("GET VEHICLES ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicles",
    });
  }
});

// ======================================
// MY LISTINGS
// ======================================

router.get("/my-listings", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const vehicles = await Vehicle.find({
      $or: [
        { sellerEmail: email },
        { email: email },
      ],
    }).sort({
      createdAt: -1,
    });

    res.json(vehicles);
  } catch (error) {
    console.error("MY LISTINGS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch listings",
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
        message: "Vehicle not found",
      });
    }

    res.json(vehicle);
  } catch (error) {
    console.error("GET VEHICLE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle",
    });
  }
});

// ======================================
// ADD VEHICLE
// ======================================

router.post("/", async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);

    const savedVehicle = await vehicle.save();

    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      vehicle: savedVehicle,
    });
  } catch (error) {
    console.error("ADD VEHICLE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add vehicle",
      error: error.message,
    });
  }
});

// ======================================
// EDIT VEHICLE
// ======================================

router.put("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle updated successfully",
      vehicle,
    });
  } catch (error) {
    console.error("UPDATE VEHICLE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update vehicle",
    });
  }
});

// ======================================
// DELETE VEHICLE
// ======================================

router.delete("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(
      req.params.id
    );

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "Vehicle not found",
      });
    }

    res.json({
      success: true,
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    console.error("DELETE VEHICLE ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete vehicle",
    });
  }
});

module.exports = router;