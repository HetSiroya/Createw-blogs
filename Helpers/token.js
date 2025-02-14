const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const jwt = require('jsonwebtoken');
function generatetoken(user) {
    const playload = {
        id: user._id,
        email: user.email,
        name: user.Name,
        Mobilenumber: user.MobileNumber,
        // password: user.password
    }
    let jwtScecrte = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(playload, jwtScecrte)
    return token
}


module.exports = generatetoken;