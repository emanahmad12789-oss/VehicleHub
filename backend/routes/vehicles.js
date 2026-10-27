const express = require("express");
const Vehicle = require("../models/vehicle");
const { requireAuth, canManageVehicle } = require("../middleware/auth");

const router = express.Router();

// PUBLIC: browse listings
router.get("/", async (req, res) => {
  try {
    const filter = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.city && req.query.city !== "All Cities") filter.city = req.query.city;
    if (req.query.condition && req.query.condition !== "All") filter.condition = req.query.condition;

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 }).limit(500);
    return res.json(vehicles);
  } catch (error) {
    console.error("GET VEHICLES ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch vehicles." });
  }
});

// PRIVATE: only the signed-in user's own listings
router.get("/my-listings", requireAuth, async (req, res) => {
  try {
    const email = req.user.email.toLowerCase();
    const vehicles = await Vehicle.find({
      $or: [{ sellerEmail: email }, { email }]
    }).sort({ createdAt: -1 });
    return res.json(vehicles);
  } catch (error) {
    console.error("MY LISTINGS ERROR:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch listings." });
  }
});

// PUBLIC: single listing details
router.get("/:id", async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." });
    return res.json(vehicle);
  } catch (error) {
    console.error("GET VEHICLE ERROR:", error);
    return res.status(400).json({ success: false, message: "Invalid vehicle ID." });
  }
});

// PRIVATE: add a listing; seller identity comes from the verified token
router.post("/", requireAuth, async (req, res) => {
  try {
    const body = req.body || {};
    const title = String(body.title || `${body.brand || ""} ${body.model || ""}`).trim();
    const price = Number(body.price);

    if (!title || !Number.isFinite(price) || price <= 0) {
      return res.status(400).json({ success: false, message: "A vehicle title and a valid price are required." });
    }

    const vehicle = new Vehicle({
      ...body,
      title,
      price,
      year: body.year === "" || body.year == null ? undefined : Number(body.year),
      sellerName: req.user.name,
      sellerEmail: req.user.email.toLowerCase(),
      email: req.user.email.toLowerCase(),
      sellerPhone: req.user.phone || "",
      phone: req.user.phone || ""
    });

    const savedVehicle = await vehicle.save();
    return res.status(201).json({ success: true, message: "Vehicle added successfully.", vehicle: savedVehicle });
  } catch (error) {
    console.error("ADD VEHICLE ERROR:", error);
    return res.status(400).json({ success: false, message: "Failed to add vehicle. Check the required vehicle details." });
  }
});

// PRIVATE: only the listing owner (or configured ADMIN_EMAIL) may edit
router.put("/:id", requireAuth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." });
    if (!canManageVehicle(req.user, vehicle)) {
      return res.status(403).json({ success: false, message: "You can only edit your own listings." });
    }

    const allowedFields = [
      "title", "name", "type", "make", "brand", "model", "year", "price",
      "mileage", "fuel", "transmission", "condition", "color", "category",
      "location", "city", "description", "image", "imageUrl", "images"
    ];
    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body || {}, key)) {
        vehicle[key] = req.body[key];
      }
    }

    if (vehicle.year !== undefined && vehicle.year !== "") vehicle.year = Number(vehicle.year);
    if (vehicle.price !== undefined) vehicle.price = Number(vehicle.price);
    await vehicle.save();

    return res.json({ success: true, message: "Vehicle updated successfully.", vehicle });
  } catch (error) {
    console.error("UPDATE VEHICLE ERROR:", error);
    return res.status(400).json({ success: false, message: "Failed to update vehicle. Check the submitted details." });
  }
});

// PRIVATE: only the listing owner (or configured ADMIN_EMAIL) may delete
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ success: false, message: "Vehicle not found." });
    if (!canManageVehicle(req.user, vehicle)) {
      return res.status(403).json({ success: false, message: "You can only delete your own listings." });
    }

    await vehicle.deleteOne();
    return res.json({ success: true, message: "Vehicle deleted successfully." });
  } catch (error) {
    console.error("DELETE VEHICLE ERROR:", error);
    return res.status(400).json({ success: false, message: "Failed to delete vehicle." });
  }
});

module.exports = router;
