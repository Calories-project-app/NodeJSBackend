const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waterHistorySchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    waterName: {
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
    intake: {
        type: Number,
        required: true,
    },
    time: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('waterHistory', waterHistorySchema);
