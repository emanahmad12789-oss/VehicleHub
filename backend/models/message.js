const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    fromEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    fromName: { type: String, required: true, trim: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    toEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    toName: { type: String, required: true, trim: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle", default: null },
    vehicleTitle: { type: String, default: "", trim: true },
    text: { type: String, required: true, trim: true, maxlength: 4000 },
    readAt: { type: Date, default: null }
  },
  { timestamps: true }
);

messageSchema.index({ fromEmail: 1, toEmail: 1, createdAt: 1 });

module.exports = mongoose.models.Message || mongoose.model("Message", messageSchema);
