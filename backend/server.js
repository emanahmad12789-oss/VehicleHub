const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const vehicleRoutes = require("./routes/vehicles");
const messageRoutes = require("./routes/messages");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 204
}));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Cache the in-flight MongoDB connection between serverless invocations.
let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  const uri = String(process.env.MONGO_URI || "").trim();
  if (!uri) {
    const error = new Error("MONGO_URI is missing in the backend Production environment variables.");
    error.statusCode = 503;
    throw error;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10
    });
  }

  try {
    await connectionPromise;
    return mongoose.connection;
  } catch (error) {
    connectionPromise = null;
    throw error;
  }
}

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "VehicleHub Backend is running." });
});

// Health route intentionally reports environment configuration without revealing secrets.
app.get("/health", async (req, res) => {
  const mongoUriConfigured = Boolean(String(process.env.MONGO_URI || "").trim());
  const jwtSecretConfigured = Boolean(String(process.env.JWT_SECRET || "").trim());

  if (!mongoUriConfigured) {
    return res.status(503).json({
      success: false,
      server: "running",
      database: "not_configured",
      mongoUriConfigured,
      jwtSecretConfigured
    });
  }

  try {
    await connectDB();
    return res.status(200).json({
      success: true,
      server: "running",
      database: "connected",
      mongoUriConfigured,
      jwtSecretConfigured
    });
  } catch (error) {
    console.error("HEALTH CHECK DATABASE ERROR:", error.name, error.code || "", error.message);
    return res.status(503).json({
      success: false,
      server: "running",
      database: "connection_failed",
      mongoUriConfigured,
      jwtSecretConfigured,
      errorType: error.name || "DatabaseError",
      errorCode: error.code || error.codeName || null,
      message: "MongoDB connection failed. Check the backend MONGO_URI value and MongoDB Atlas Network Access."
    });
  }
});

// Do not run protected API routes against an unconnected database.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DATABASE CONNECTION ERROR:", error.name, error.code || "", error.message);
    res.status(503).json({
      success: false,
      message: "VehicleHub database is unavailable. Open /health to check backend configuration."
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/messages", messageRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error("SERVER ERROR:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

// Vercel invokes the exported Express app as a serverless function.
// Local development still starts a normal HTTP server.
if (process.env.VERCEL !== "1") {
  connectDB()
    .then(() => {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`VehicleHub backend listening on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error.message);
      process.exit(1);
    });
}

module.exports = app;
