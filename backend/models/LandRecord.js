const mongoose = require("mongoose");

const LandRecordSchema = new mongoose.Schema({
  cropFarmId: { type: mongoose.Schema.Types.ObjectId, ref: "CropFarm", required: true },
  area: { type: Number, required: true },
  location: { type: String, required: true },
  soilType: { type: String, required: true },
  landType: { type: String, enum: ["irrigated", "rainfed"], required: true },
  landSuitability: { type: String },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("LandRecord", LandRecordSchema);
