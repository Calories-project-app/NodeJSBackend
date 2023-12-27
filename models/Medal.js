const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const medalSchema = new Schema(
  {
    name_eng: {
      type: String,
      required: true,
    },
    name_thai: {
      type: String,
      required: true,
    },
    requirement: {
      type: Number,
    },
    description: {
      type: String,
    },
    imgPath: {
      type: String,
    },
  },
  {
    collection: "Medals",
  }
);

module.exports = mongoose.model("Medal", medalSchema);
