const express = require("express");
const router = express.Router();
const LandRecord = require("../models/LandRecord");

// Create Land Record
router.post("/", async (req, res) => {
  try {
    const {
      cropFarmId,
      area,
      location,
      soilType,
      landType,
      landSuitability,
      notes,
    } = req.body;

    if (
      !area ||
      !location ||
      !soilType ||
      !landType ||
      !cropFarmId
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const landRecord = new LandRecord({
      cropFarmId,
      area,
      location,
      soilType,
      landType,
      landSuitability,
      notes,
    });

    await landRecord.save();
    res.status(201).json(landRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Land Record for specific cropFarmId (returns array for compatibility)
router.get("/:cropFarmId", async (req, res) => {
  try {
    const record = await LandRecord.find({
      cropFarmId: req.params.cropFarmId
    });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update existing Land Record
router.put("/:id", async (req, res) => {
  try {
    const updatedRecord = await LandRecord.findOneAndUpdate(
      { _id: req.params.id},
      req.body,
      { new: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ message: "Land record not found." });
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
