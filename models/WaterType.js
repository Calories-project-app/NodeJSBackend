const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const waterTypeSchema = new Schema({
    type: {
        type: String,
    },
    imgPath: {
        type: String,
    },
}, {
    collection: 'watertypes'
});

module.exports = mongoose.model('WaterType', waterTypeSchema);
