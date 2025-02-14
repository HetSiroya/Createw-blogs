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

// Check if model already exists before creating it
module.exports = mongoose.models.Signup || mongoose.model('rigistartion', registrationModel);   