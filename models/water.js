const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const waterSchema = new Schema(
  {
    type_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "watertypes",
      required: true,
    },
    name_eng: {
      type: String,
      required: true,
    },
    name_thai: {
      type: String,
      required: true,
    },
    calories: {
      type: Number,
    },
    caffeine: {
      type: Number,
    },
    sugar: {
      type: Number,
    },
    volumn: {
      type: Number,
      required: true,
    },
    imgPath: {
      type: String,
      required: true,
    },
  },
  {
    collection: "water",
  }
);

module.exports = mongoose.model("Water", waterSchema);
