const express = require('express')
const mongoose = require('mongoose')
const signupModel = require('../Models/signupModel')
const { generateOTP } = require('../Helpers/generateOtp')
const registrationModel = require('../Models/registrationModel')
const generatetoken = require('../Helpers/token')


exports.verify = async (req, res) => {
    try {
        console.log("hello");

        const { email } = req.body
        const otp = generateOTP()
        const user = new registrationModel({
            email: email,
            OTP: otp
        })
        await user.save()
        res.status(200).json({
            message: 'Verification email sent successfully',
            user: user
        })
    }
    catch (error) {
        console.error(error)
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }
}
exports.signUp = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password, confirmPassword, otp } = req.body
        const Signup = await registrationModel.findOne({
            email: email,
            OTP: otp
        })
        if (!Signup) {
            return res.status(400).json({ msg: 'Invalid OTP or email' })
        }

        if (!firstname || !lastname || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' })
        }
        const Img = req.file;
        console.log("img" + Img);

        if (!Img) {
            return res.status(400).json({ message: 'Please upload an image' })
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: 'Passwords do not match' })
        }
        const user = new signupModel({
            firstname,
            lastname,
            email,
            password,
            userphoto: Img.path
        })
        const token = generatetoken(user)
        await user.save()
        await Signup.deleteOne()
        res.status(201).json({
            message: 'User created successfully',
            user: user,
            token: token
        })

    }
    catch (error) {
        // next(error)
        console.error(error)
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await signupModel.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ msg: 'User not found' })
        }

        if (user.password != password) {
            return res.status(400).json({ msg: 'Invalid credentials' })
        }
        const token = generatetoken(user)
        res.json({
            message: 'User logged in successfully',
            user: user,
            token: token
        })

    }
    catch (error) {
        // next(error)
        console.error(error)
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        })
    }
}


