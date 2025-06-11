// routes/cropFarmRoutes.js
const express = require("express");
const CropFarm = require("../models/CropFarm")

const router = express.Router();

// Create a new CropFarm
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const newCropFarm = new CropFarm({ name });
    await newCropFarm.save();
    res.status(201).json(newCropFarm);
  } catch (error) {
    res.status(500).json({ message: "Error creating CropFarm", error });
  }
});

// Get all CropFarm for the authenticated user
router.get("/", async (req, res) => {
  try {
    const cropFarms = await CropFarm.find();
    res.status(200).json(cropFarms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cropFarms", error });
  }
});

// Edit a CropFarm
router.put("/:id", async (req, res) => {
  try {
    const { name } = req.body;
    const updatedCropFarm = await CropFarm.findOneAndUpdate(
      { _id: req.params.id},
      { name },
      { new: true }
    );
    if (!updatedCropFarm) return res.status(404).json({ message: "CropFarm not found" });
    res.status(200).json(updatedCropFarm);
  } catch (error) {
    res.status(500).json({ message: "Error updating CropFarm", error });
  }
});

// Delete a CropFarm
router.delete("/:id", async (req, res) => {
  try {
    await CropFarm.findOneAndDelete({ _id: req.params.id});
    res.status(200).json({ message: "CropFarm deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting CropFarm", error });
  }
});

module.exports = router;
