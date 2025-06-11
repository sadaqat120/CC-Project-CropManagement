const express = require("express");
const router = express.Router();

const LandRecord = require("../models/LandRecord");
const CropRecord = require("../models/CropRecord");
const CostTracking = require("../models/CostTracking");
const ResultSummary = require("../models/ResultSummary");

router.get("/:cropFarmId", async (req, res) => {
  try {
    const { cropFarmId } = req.params;

    const [landRecords, cropRecords, costEntries, resultSummaries] =
      await Promise.all([
        LandRecord.find({ cropFarmId }),
        CropRecord.find({ cropFarmId }),
        CostTracking.find({ cropFarmId }).sort({ date: 1 }),
        ResultSummary.find({ cropFarmId }),
      ]);

    const land = landRecords[0] || null;
    const crop = cropRecords[0] || null;
    const costs = costEntries;
    const summary = resultSummaries[0] || null;

    res.status(200).json({ land, crop, costs, summary });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res
      .status(500)
      .json({ message: "Server error while fetching dashboard data." });
  }
});

module.exports = router;
