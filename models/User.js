const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  gender: { type: String, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  weightGoal: { type: Number, required: true },
  activityLevel: { type: String, required: true },
  eatType: { type: String, required: true },
  userImg: { type: String },
  basalMetabolicRate: { type: Number },
  waterConsumingRate: { type: Number },
  totalDailyCalories: { type: Number },
  fatConsumingRate: { type: Number },
  proteinConsumingRate: { type: Number },
  carbConsumingRate: { type: Number },
  foodStreak: {
    type: Number,
    default: 0, // starts with 0
  },
  waterStreak: {
    type: Number,
    default: 0, // starts with 0
  },
  lastFoodLogDate: {
    type: Date,
  },
  lastWaterLogDate: {
    type: Date,
  },
  friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
});


module.exports = mongoose.model("User", UserSchema);
