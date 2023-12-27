const express = require("express");
const router = express.Router();
const Medal = require("../models/Medal");

// Get all medals
router.get("/", async (req, res) => {
  try {
    const medals = await Medal.find();
    res.json(medals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new medal
router.post("/", async (req, res) => {
  const { name_eng, name_thai, requirement, imgPath } = req.body;

  try {
    const newMedal = new Medal({
      name_eng,
      name_thai,
      requirement,
      imgPath,
    });

    const savedMedal = await newMedal.save();
    res.status(201).json(savedMedal);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
