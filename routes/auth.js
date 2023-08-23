
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

module.exports = router;
