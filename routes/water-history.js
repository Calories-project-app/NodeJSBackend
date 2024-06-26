const express = require('express');
const router = express.Router();
const WaterHistory = require('../models/waterHistory');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

router.post('/saveWater', verifyToken, async (req, res) => {
  try {
    const { userId, waterName, calories, caffeine, sugar, intake, time } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const waterHistory = new WaterHistory({
      userId, waterName, calories, caffeine, sugar, intake, time
    });

    await waterHistory.save();
    const date = new Date().setHours(0, 0, 0, 0);
    const totalWaterToday = await WaterHistory.aggregate([
      {
        $match: {
          userId: userExists._id,
          time: { $gte: new Date(date), $lt: new Date(date + 24 * 60 * 60 * 1000) }
        }
      },
      { $group: { _id: null, totalWaters: { $sum: "$intake" } } }
    ]);

    const totalWaters = totalWaterToday.length > 0 ? totalWaterToday[0].totalWaters : 0;
    const lastLogDate = userExists.lastWaterLogDate ? new Date(userExists.lastWaterLogDate.setHours(0, 0, 0, 0)) : null;
    console.log(totalWaters)
    if (date > lastLogDate && totalWaters >= userExists.waterConsumingRate) {
      console.log("streak up")
      userExists.waterStreak += 1;
      userExists.lastWaterLogDate = new Date();
      await userExists.save();
    }
    res.status(201).json({ message: 'water history saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

router.get('/waterHistory/:userId', verifyToken, async (req, res) => {
  try {
    const userId = req.params.userId;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const waterHistory = await WaterHistory.find({ userId });

    res.status(200).json({ waterHistory });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});
router.post("/waterHistory/oneDayStatistics", verifyToken, async (req, res) => {
  try {
    const { userId, date } = req.body;

    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(endDate.getDate() + 1);

    const foodHistory = await WaterHistory.find({
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

    const totalCalories = totalCaloriesFood + totalCaloriesWater;
    res.status(200).json({
      foodHistory,
      waterHistory,
      totalCalories,
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
module.exports = router;
