const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  images: { type: [String], default: [] }, // multiple images supported
  location: { type: String, default: "" },
  type: { type: String, default: "" },
  establishedYear: { type: String, default: "" },
  ranking: { type: String, default: "" },
  branches: { type: [String], default: [] },
  distanceFromRailway: {
    stationName: { type: String, required: true },
    distanceKm: { type: String, required: true },
  },
  // Fee structure per category
  fees: {
    general: { type: Number, default: 0 },
    obc: { type: Number, default: 0 },
    sc: { type: Number, default: 0 },
    st: { type: Number, default: 0 },
    tfws: { type: Number, default: 0 },
    ews: { type: Number, default: 0 },
  },
  // Student reviews
  reviews: [
    {
      author: { type: String, default: "Anonymous Student" },
      rating: { type: Number, default: 0 },
      text: { type: String, default: "" },
      createdAt: { type: Date, default: Date.now },
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("College", collegeSchema);
