const express = require("express");
const router = express.Router();
const WaterType = require("../models/WaterType");
const Water = require("../models/water");
router.get("/getType", async (req, res) => {
  try {
    const allWaterTypes = await WaterType.find();

    res.status(200).json({ WaterTypes: allWaterTypes });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
router.post("/getType/getWater", async (req, res) => {
  try {
    const { type_id } = req.body;
    console.log(
      "🚀 ~ file: getWaterType.js:20 ~ router.post ~ type_id:",
      type_id
    );
    const allWater = await Water.find({ type_id });

    res.status(200).json({ Water: allWater });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
module.exports = router;
