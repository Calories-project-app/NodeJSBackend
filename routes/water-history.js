const express = require('express');
const router = express.Router();
const WaterHistory = require('../models/waterHistory');
const User = require('../models/User');
const verifyToken = require('../middleware/verifyToken');

router.post('/saveWater', verifyToken, async (req, res) => {
    try {
        const { userId, waterName,calories, caffeine, sugar, intake, time } = req.body;

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const waterHistory = new WaterHistory({
            userId, waterName,calories, caffeine, sugar, intake, time
        });

        await waterHistory.save();

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
module.exports = router;
