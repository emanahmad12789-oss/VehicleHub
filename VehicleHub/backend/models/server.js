
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://vehicle-hub-nu.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check: database connection status
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    server: "running",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// API routes — paths only, NOT full URLs
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "VehicleHub Backend is running",
  });
});

// 404 handler
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
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");

    app.listen(PORT, () => {
      console.log(`VehicleHub running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error.message);
    process.exit(1);
  }
}

startServer();

module.exports = app;
