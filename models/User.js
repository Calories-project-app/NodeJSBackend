const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    birthDate: { type: Date, required: true },
    gender: { type: String, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    weightGoal: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    eatType: { type: String, required: true },
    userImg: { type: String },
    basalMetabolicRate: { type: Number }, 
    totalDailyCalories: { type: Number },
})

UserSchema.pre('save', function (next) {
    const user = this;

    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash
        next()
    }).catch(err => {
        console.log(err);
    })
})


module.exports = mongoose.model('User', UserSchema);
