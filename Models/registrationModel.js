const mongoose = require('mongoose');

const registrationModel = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    OTP: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Registration', registrationModel);