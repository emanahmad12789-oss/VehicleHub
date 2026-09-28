const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");

const app = express();

// ============================
// MIDDLEWARE
// ============================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================
// MONGODB CONNECTION
// ============================

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is missing");
} else {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("✅ MongoDB Connected Successfully");
    })
    .catch((error) => {
      console.error("❌ MongoDB Connection Failed");
      console.error(error.message);
    });
}

// ============================
// API ROUTES
// ============================

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// ============================
// HOME / TEST ROUTE
// ============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VehicleHub Backend is running 🚗",
  });
});

// ============================
// 404 ROUTE
// ============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ============================
// ERROR HANDLER
// ============================

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});

// ============================
// VERCEL EXPORT
// ============================

module.exports = app;