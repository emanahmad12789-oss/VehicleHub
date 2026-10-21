
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");

const app = express();

// Allowed frontend origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://vehicle-hub-nu.vercel.app",
  "https://vehicle-j4kungghv-vehicle-hub.vercel.app",
];

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const isVercelPreview =
      origin &&
      /^https:\/\/vehicle-[a-z0-9-]+-vehicle-hub\.vercel\.app$/.test(
        origin
      );

    if (!origin || allowedOrigins.includes(origin) || isVercelPreview) {
      return callback(null, true);
    }

    console.error("Blocked CORS origin:", origin);
    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: [
    "GET",
    "HEAD",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 204,
};

// Apply CORS before routes and database connection
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

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
      message: "Database connection failed",
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Final error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack || err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

// Vercel serverless export
module.exports = app;
