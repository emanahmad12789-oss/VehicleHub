const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("../backend/routes/auth");
const vehicleRoutes = require("../backend/routes/vehicles");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is missing");
  }

  cachedConnection = await mongoose.connect(process.env.MONGO_URI);

  console.log("MongoDB Connected Successfully");

  return cachedConnection;
}

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VehicleHub Backend is running 🚗",
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
});

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("DATABASE/SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Backend connection failed",
      error: error.message,
    });
  }
};