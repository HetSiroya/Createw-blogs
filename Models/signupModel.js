const mongoose = require('mongoose')
const signup = mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    userphoto: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Signup', signup)