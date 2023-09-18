
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');


app.post('/register', async (req, res) => {
    try {
        const { email, password, goal, birthDate, gender, height, weight, weightGoal, activityLevel, eatType } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists' });
        }

        const newUser = new User({
            email,
            password,
            goal,
            birthDate,
            gender,
            height,
            weight,
            weightGoal,
            activityLevel,
            eatType,
            userImg,
        });

        await newUser.save();

        res.status(201).json({ message: 'Registration successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Authentication failed' });
        }


        const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '7d' });

        res.json({ token });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/profile', verifyToken, async (req, res) => {
    const userId = req.userId;

    try {
        const updatedFields = {
            goal: req.body.goal,
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            height: req.body.height,
            weight: req.body.weight,
            weightGoal: req.body.weightGoal,
            activityLevel: req.body.activityLevel,
            eatType: req.body.eatType,
            userImg: req.body.userImg,
        };
                const updatedProfile = await User.findByIdAndUpdate(userId, updatedFields, { new: true });

        if (!updatedProfile) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ message: 'User profile updated successfully', user: updatedProfile });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

module.exports = router;
