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

    type: {
      type: String,
      enum: ["Car", "Bike"],
      default: "Car",
    },

    make: {
      type: String,
      default: "",
    },

    brand: {
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

    mileage: {
      type: String,
      default: "",
    },

    fuel: {
      type: String,
      default: "Petrol",
    },

    transmission: {
      type: String,
      default: "Manual",
    },

    condition: {
      type: String,
      enum: ["New", "Used", "Certified"],
      default: "Used",
    },

    color: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    city: {
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
