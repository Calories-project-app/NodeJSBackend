const express = require("express");
const router = express.Router();
const Medal = require("../models/UserMedal");

router.get("/", async (req, res) => {
  try {
    const medals = await Medal.find();
    res.json(medals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
