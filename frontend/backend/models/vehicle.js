const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    name: {
      type: String,
      default: "",
    },

    make: {
      type: String,
      default: "",
    },

    model: {
      type: String,
      default: "",
    },

    year: {
      type: Number,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      type: String,
      default: "",
    },

    imageUrl: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    sellerName: {
      type: String,
      default: "",
    },

    sellerEmail: {
      type: String,
      default: "",
    },

    sellerPhone: {
      type: String,
      default: "",
    },

    email: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);