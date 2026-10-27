const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({ success: false, message: "Please log in to continue." });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(503).json({ success: false, message: "Authentication is not configured on the server." });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "Your session is no longer valid. Please log in again." });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Your session has expired. Please log in again." });
    }

    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not verify your account." });
  }
}

function canManageVehicle(user, vehicle) {
  const email = String(user?.email || "").trim().toLowerCase();
  const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const sellerEmail = String(vehicle?.sellerEmail || vehicle?.email || "").trim().toLowerCase();
  return Boolean(email && (email === sellerEmail || (adminEmail && email === adminEmail)));
}

module.exports = { requireAuth, canManageVehicle };
