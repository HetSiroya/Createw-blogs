const express = require('express')
const mongoose = require('mongoose')
const signupModel = require('../Models/signupModel')

exports.signUp = async (req, res, next) => {
    try {
        const { firstname, lastname, email, password, confirmPassword } = req.body

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
        await user.save()
        res.status(201).json({
            message: 'User created successfully',
            user: user
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