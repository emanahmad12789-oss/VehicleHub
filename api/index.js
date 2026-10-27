const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("../backend/routes/auth");
const vehicleRoutes = require("../backend/routes/vehicles");
const messageRoutes = require("../backend/routes/messages");

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

let cachedConnection = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is missing in Vercel Environment Variables");

  if (!cachedConnection) {
    cachedConnection = mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });
  }

  try {
    await cachedConnection;
    return mongoose.connection;
  } catch (error) {
    cachedConnection = null;
    throw error;
  }
}

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.json({ success: true, message: "VehicleHub Backend is running." });
});
app.get("/health", (req, res) => {
  res.json({
    success: true,
    server: "running",
    database: mongoose.connection.readyState === 1 ? "connected" : "not_checked"
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use((error, req, res, next) => {
  console.error("SERVER ERROR:", error);
  res.status(500).json({ success: false, message: "Internal server error." });
});

module.exports = async (req, res) => {
  const origin = req.headers.origin;
  res.setHeader("Access-Control-Allow-Origin", origin || "*");
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(204).end();

  const pathname = String(req.url || "/").split("?")[0];
  if (pathname === "/api/health" || pathname === "/api/health/" || pathname === "/health") {
    const mongoUriConfigured = Boolean(String(process.env.MONGO_URI || "").trim());
    const jwtSecretConfigured = Boolean(String(process.env.JWT_SECRET || "").trim());

    if (!mongoUriConfigured) {
      return res.status(503).json({
        success: false,
        server: "running",
        database: "not_configured",
        mongoUriConfigured: false,
        jwtSecretConfigured,
        message: "MONGO_URI is missing or empty in the environment for this deployment."
      });
    }

    try {
      await connectDB();
      return res.status(200).json({
        success: true,
        server: "running",
        database: "connected",
        mongoUriConfigured: true,
        jwtSecretConfigured
      });
    } catch (error) {
      console.error("HEALTH CHECK DATABASE ERROR:", error);
      return res.status(503).json({
        success: false,
        server: "running",
        database: "connection_failed",
        mongoUriConfigured: true,
        jwtSecretConfigured,
        errorType: error.name || "DatabaseError",
        message: "MONGO_URI exists, but MongoDB connection failed. Check the Atlas password, URL encoding, cluster status, and Network Access."
      });
    }
  }

  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("DATABASE/SERVER ERROR:", error);
    return res.status(503).json({
      success: false,
      message: "VehicleHub database is unavailable. Open /api/health for the configuration status."
    });
  }
};
