const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ success: false, message: "Please log in to continue." });
  if (!process.env.JWT_SECRET) return res.status(503).json({ success: false, message: "Authentication is not configured on the server." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (!user) return res.status(401).json({ success: false, message: "Your session is no longer valid. Please log in again." });
    if (user.status === "suspended") return res.status(403).json({ success: false, message: "This account has been suspended." });
    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") return res.status(401).json({ success: false, code: "TOKEN_EXPIRED", message: "Your login token has expired. Please log in again." });
    if (error.name === "JsonWebTokenError" || error.name === "NotBeforeError") {
      return res.status(401).json({ success: false, code: "TOKEN_INVALID", message: "Your login token is invalid for this backend. Please log out, log in again, and retry." });
    }
    console.error("AUTH MIDDLEWARE ERROR:", error);
    return res.status(500).json({ success: false, message: "Could not verify your account." });
  }
}

function requireOwner(req, res, next) {
  const configuredEmail = String(process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || "").trim().toLowerCase();
  const accountEmail = String(req.user?.email || "").trim().toLowerCase();
  if (!configuredEmail) {
    return res.status(503).json({ success: false, message: "Owner access is not configured. Set ADMIN_EMAIL in backend environment variables." });
  }
  if (!accountEmail || accountEmail !== configuredEmail) {
    return res.status(403).json({ success: false, message: "Owner access required." });
  }
  return next();
}

function canManageVehicle(user, vehicle) {
  const email = String(user?.email || "").trim().toLowerCase();
  const adminEmail = String(process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || "").trim().toLowerCase();
  const sellerEmail = String(vehicle?.sellerEmail || vehicle?.email || "").trim().toLowerCase();
  return Boolean(email && (email === sellerEmail || (adminEmail && email === adminEmail)));
}

module.exports = { requireAuth, requireOwner, canManageVehicle };
