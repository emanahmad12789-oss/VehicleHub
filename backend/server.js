const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");

const app = express();

const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Backend status
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VehicleHub Backend is running!",
  });
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    server: "running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// API routes (FIXED — relative paths)
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// MongoDB connection and server startup
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 30000,
      });
      console.log("MongoDB connected successfully");
    }

    if (process.env.VERCEL !== "1") {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`VehicleHub server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Server startup failed:", error.message);
    if (process.env.VERCEL !== "1") process.exit(1);
  }
}

startServer();

module.exports = app;
