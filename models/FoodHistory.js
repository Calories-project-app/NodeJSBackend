const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FoodHistorySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  foodName: {
    type: String,
    required: true,
  },
  calories: {
    type: Number,
    required: true,
  },
  fat: {
    type: Number,
    required: true,
  },
  carbohydate: {
    type: Number,
    required: true,
  },
  protein: {
    type: Number,
    required: true,
  },
  imgPath: {
    type: String,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FoodHistory", FoodHistorySchema);
