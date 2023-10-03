const express = require('express');
const router = express.Router();
const FoodHistory = require('../models/FoodHistory');
const User = require('../models/User'); 
const verifyToken = require('../middleware/verifyToken'); 

router.post('/foodHistory', verifyToken, async (req, res) => {
    try {
        const { userId, foodName, calories, time } = req.body;

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const foodHistory = new FoodHistory({
            userId,
            foodName,
            calories,
            time,
        });

        await foodHistory.save();

        res.status(201).json({ message: 'Food history saved successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

router.get('/foodHistory/:userId',verifyToken, async (req, res) => {
    try {
        const userId = req.params.userId;

        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const foodHistory = await FoodHistory.find({ userId });

        res.status(200).json({ foodHistory });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});
module.exports = router;
