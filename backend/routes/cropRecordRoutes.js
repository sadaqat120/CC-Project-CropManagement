const express = require("express");
const router = express.Router();
const CropRecord = require("../models/CropRecord");

// Create Crop Record
router.post("/", async (req, res) => {
  try {
    const {
      cropFarmId,
      season,
      cropType,
      cropName,
      duration,
      seedingDate,
      seedQuantity,
      notes,
    } = req.body;

    if (
      !cropFarmId ||
      !season ||
      !cropType ||
      !cropName ||
      !duration ||
      !seedingDate ||
      !seedQuantity
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const cropRecord = new CropRecord({
      cropFarmId,
      season,
      cropType,
      cropName,
      duration,
      seedingDate,
      seedQuantity,
      notes,
    });

    await cropRecord.save();
    res.status(201).json(cropRecord);
  } catch (error) {
    console.error("Crop Record Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all crop records for a specific crop farm (usually 1)
router.get("/:cropFarmId", async (req, res) => {
  try {
    const cropRecords = await CropRecord.find({
      cropFarmId: req.params.cropFarmId,
    });
    res.status(200).json(cropRecords);
  } catch (error) {
    console.error("Fetch Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Update existing Crop Record
router.put("/:id", async (req, res) => {
  try {
    const updated = await CropRecord.findOneAndUpdate(
      { _id: req.params.id},
      req.body,
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: "Crop record not found." });
    }
    res.status(200).json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
