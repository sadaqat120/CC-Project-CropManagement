// models/CropFarm.js
const mongoose = require("mongoose");

const CropFarmSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("CropFarm", CropFarmSchema);
