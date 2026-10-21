const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");

const app = express();

// Frontend URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://vehicle-hub-nu.vercel.app",
  "https://vehicle-j4kungghv-vehicle-hub.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked CORS origin:", origin);
      return callback(new Error("Origin not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Handle preflight requests
app.options(/.*/, cors());

// Request body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// MongoDB connection
let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in environment variables");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGO_URI)
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
}

// Backend status
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "VehicleHub Backend is running!",
  });
});

// Database health check
app.get("/health", async (req, res) => {
  try {
    await connectDB();

    res.status(200).json({
      success: true,
      server: "running",
      database: "connected",
    });
  } catch (error) {
    console.error("Health check error:", error.message);

    res.status(503).json({
      success: false,
      server: "running",
      database: "disconnected",
      message: error.message,
    });
  }
});

// Connect MongoDB before API requests
app.use("/api", async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    res.status(503).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// API routes — paths only, never full URLs
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

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});
module.exports = app;
