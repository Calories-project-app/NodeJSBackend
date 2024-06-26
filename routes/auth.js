const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const verifyToken = require("../middleware/verifyToken");
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } = require("firebase/auth");


const auth = getAuth();
router.post("/register", async (req, res) => {
    try {
        const {
            email,
            name,
            password,
            birthDate,
            gender,
            height,
            weight,
            weightGoal,
            activityLevel,
            eatType,
            userImg,
        } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists" });
        }

        const basalMetabolicRate = calculateBMR(weight, height, birthDate, gender);
        const totalDailyCalories = calculateTotalDailyCalories(
            basalMetabolicRate,
            activityLevel
        );
        const waterConsumingRate = calculateWaterRate(weight);

        const fatConsumingRate = ((totalDailyCalories * 0.3) / 9).toFixed(2); // 1g of fat = 9 calories
        const proteinConsumingRate = ((totalDailyCalories * 0.3) / 4).toFixed(2); // 1g of protein = 4 calories
        const carbConsumingRate = ((totalDailyCalories * 0.4) / 4).toFixed(2); // 1g of carbohydrates = 4 calories
        const userRecord = await createUserWithEmailAndPassword(auth, email, password)
        sendEmailVerification(auth.currentUser)
        const newUser = new User({
            _id: userRecord.uid,
            email,
            name,
            birthDate,
            gender,
            height,
            weight,
            weightGoal,
            activityLevel,
            eatType,
            userImg,
            basalMetabolicRate,
            waterConsumingRate,
            totalDailyCalories,
            fatConsumingRate,
            proteinConsumingRate,
            carbConsumingRate,
        });
        await newUser.save();
        res.status(201).json({ message: "Registration successful" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;
        if (!firebaseUser) {
            return res.status(401).json({ message: "Authentication failed with Firebase" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User details not found in MongoDB" });
        }
        const token = await firebaseUser.getIdToken();

        res.status(200).json({
            token,
            user: user.toObject(),
        });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
});

router.get("/user-id", (req, res) => {
    try {
        console.log(req.headers);
        const authHeader = req.headers["authorization"];

        console.log(authHeader);
        if (!authHeader) {
            return res
                .status(401)
                .json({ message: "Authorization header is missing" });
        }

        const token = authHeader.split(" ")[1];
        const userId = decodedToken.userId;

        res.status(200).json({ userId });
    } catch (error) {
        res.status(401).json({ message: "Authentication failed" });
    }
});

router.put("/edit-profile/:userId", verifyToken, async (req, res) => {
    const userId = req.params.userId;

    try {
        const updatedFields = {
            birthDate: req.body.birthDate,
            gender: req.body.gender,
            height: req.body.height,
            weight: req.body.weight,
            weightGoal: req.body.weightGoal,
            activityLevel: req.body.activityLevel,
            eatType: req.body.eatType,
            userImg: req.body.userImg,
        };
        const updatedProfile = await User.findByIdAndUpdate(userId, updatedFields, {
            new: true,
        });

        if (!updatedProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.json({
            message: "User profile updated successfully",
            user: updatedProfile,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});

router.put("/change-password", verifyToken, async (req, res) => {
    const email = req.body.email;
    try {
        console.log(email)
        await sendPasswordResetEmail(auth, email);
        res.status(201).json({ message: 'Email sent successfully!' })
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
router.put("/confirm-password", verifyToken, async (req, res) => {
    const code = req.body;
    try {
        await confirmPasswordReset(email, code);
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Internal server error", error: error.message });
    }
});
function calculateBMR(weight, height, birthDate, gender) {
    //BMR สำหรับผู้ชาย = 66 + (13.7 X น้ำหนักตัวปัจจุบันเป็นกิโลกรัม) + (5 x ส่วนสูงปัจจุบันเป็นเซนติเมตร) – (6.8 x อายุปัจจุบัน)

    //BMR สำหรับผู้หญิง = 665 + (9.6 x น้ำหนักตัวปัจจุบันเป็นกิโลกรัม) + (1.8 x ส่วนสูงปัจจุบันเป็นเซนติเมตร) – (4.7 x อายุปัจจุบัน)
    const age = calculateAge(birthDate);

    let bmr;
    if (gender.toLowerCase() === "male") {
        bmr = 66 + 13.7 * weight + 5 * height - 6.8 * age;
    } else if (gender.toLowerCase() === "female") {
        bmr = 665 + 9.6 * weight + 1.8 * height - 4.7 * age;
    } else {
        throw new Error("Invalid gender");
    }

    return bmr.toFixed(2);
}

function calculateAge(birthDate) {
    const currentDate = new Date();
    const birthDateObj = new Date(birthDate);
    const age = currentDate.getFullYear() - birthDateObj.getFullYear();

    if (
        currentDate.getMonth() < birthDateObj.getMonth() ||
        (currentDate.getMonth() === birthDateObj.getMonth() &&
            currentDate.getDate() < birthDateObj.getDate())
    ) {
        return age - 1;
    }

    return age;
}

function calculateTotalDailyCalories(bmr, activityLevel) {
    const activityFactors = {
        sedentary: 1.2,
        lightlyActive: 1.375,
        moderatelyActive: 1.55,
        veryActive: 1.725,
        superActive: 1.9,
    };

    if (!activityFactors.hasOwnProperty(activityLevel)) {
        throw new Error("Invalid activity level");
    }

    const totalDailyCalories = bmr * activityFactors[activityLevel];

    return totalDailyCalories.toFixed(2);
}

function calculateWaterRate(weight) {
    let litre;
    litre = weight * 33;

    return litre.toFixed(2);
}
module.exports = router;
