const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userMedalSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    medalId: {
      type: Schema.Types.ObjectId,
      ref: "Medal",
      required: true,
    },
    streak: {
      type: Number,
    },
    modified_at: {
      type: String,
      required: true,
    },
    created_at: {
      type: String,
      required: true,
    },
  },
  {
    collection: "UserMedal",
  }
);

module.exports = mongoose.model("UserMedal", userMedalSchema);
