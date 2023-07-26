const mongoose = require('mongoose');

const ProDuctSchema = new mongoose.Schema({
    prod_name:String,
    prod_desc:String,
    prod_price:Number,
    updated_at : { type: Date,default:Date.now}
})

module.exports = mongoose.model('Product',ProDuctSchema)