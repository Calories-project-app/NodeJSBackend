const express = require("express");
const router = express.Router();
const FoodHistory = require("../models/FoodHistory");
const WaterHistory = require("../models/waterHistory");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const multer = require("multer");
const storage = getStorage();
const storageConfig = multer.memoryStorage();
const upload = multer({
  storage: storageConfig,
  limits: {
    fileSize: 10 * 1024 * 1024, 
  },
});


//save food
router.post(
  "/saveFood",
  verifyToken,
  upload.single("imgPath"),
  async (req, res) => {
    try {
      const {
        userId,
        foodName,
        calories,
        fat,
        protein,
        carbohydate,
        imgPath,
        time,
      } = req.body;

      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      const foodHistory = new FoodHistory({
        userId,
        foodName,
        calories,
        fat,
        protein,
        carbohydate,
        imgPath,
        time,
      });

      if (req.file) {
        const fileBuffer = req.file.buffer;
        const storageRef = ref(
          storage,
          `foodPictures/${userId}/${foodHistory._id}`
        );
        const metadata = {
          contentType: req.file.mimetype,
        };
        const uploadTask = uploadBytesResumable(
          storageRef,
          fileBuffer,
          metadata
        );
        const snapshot = await uploadTask;
        foodHistory.imgPath = await getDownloadURL(snapshot.ref);
      }

      await foodHistory.save();

      res.status(201).json({
        foodHistory: foodHistory,
        message: "Food history saved successfully",
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }
);

router.get("/foodHistory/:userId", verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const foodHistory = await FoodHistory.find({ userId });

    res.status(200).json({ foodHistory });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/foodHistory/oneDayStatistics", verifyToken, async (req, res) => {
  try {
    const { userId, date } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const foodHistory = await FoodHistory.find({
      userId,
      time: { $gte: startDate, $lt: endDate },
    });
    const waterHistory = await WaterHistory.find({
      userId,
      time: { $gte: startDate, $lt: endDate },
    });
    const totalLitre = waterHistory.reduce(
      (sum, entry) => sum + (entry.intake || 0),
      0
    );
    const totalCaloriesWater = waterHistory.reduce(
      (sum, entry) => sum + (entry.calories || 0),
      0
    );
    const totalCaffeine = waterHistory.reduce(
      (sum, entry) => sum + (entry.caffeine || 0),
      0
    );
    const totalSugar = waterHistory.reduce(
      (sum, entry) => sum + (entry.sugar || 0),
      0
    );
    const totalCaloriesFood = foodHistory.reduce(
      (sum, entry) => sum + (entry.calories || 0),
      0
    );
    const totalFat = foodHistory.reduce(
      (sum, entry) => sum + (entry.fat || 0),
      0
    );
    const totalCarbohydate = foodHistory.reduce(
      (sum, entry) => sum + (entry.carbohydate || 0),
      0
    );
    const totalProtein = foodHistory.reduce(
      (sum, entry) => sum + (entry.protein || 0),
      0
    );
    const totalCalories = totalCaloriesFood + totalCaloriesWater;
    res.status(200).json({
      foodHistory,
      waterHistory,
      totalCalories,
      totalFat,
      totalCarbohydate,
      totalProtein,
      totalLitre,
      totalCaffeine,
      totalSugar,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
router.post("/foodHistory/latestFoods/", verifyToken, async (req, res) => {
  try {
    const { userId } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const uniqueFoodNames = await FoodHistory.distinct("foodName", { userId });

    const latestUniqueFoods = [];
    for (const foodName of uniqueFoodNames) {
      const latestFood = await FoodHistory.findOne({ userId, foodName })
        .sort({ time: "desc" })
        .limit(5);
      if (latestFood) {
        latestUniqueFoods.push(latestFood);
      }
    }

    res.status(200).json({ latestUniqueFoods });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
module.exports = router;
