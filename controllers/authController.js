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
        console.log("Img" + Img);

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
            userphoto: Img.filename
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

exports.updateProfile = async (req, res) => {
    try {
        const user = req.user
        const { firstname, lastname } = req.body

        let updateData = {
            firstname,
            lastname
        }

        // Only add photo to update if file was uploaded
        if (req.file) {
            updateData.userphoto = req.file.filename  // Changed from profilephoto to userphoto to match schema
        }

        const updatedUser = await signupModel.findByIdAndUpdate(
            user._id,
            updateData,
            { new: true }
        )

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' })
        }

        // Create response with full image path
        const userResponse = {
            ...updatedUser.toObject(),
            userphoto: updatedUser.userphoto
                ? `${req.protocol}://${req.get('host')}/${updatedUser.userphoto}`
                : null
        }

        res.status(200).json({
            message: 'User profile updated successfully',
            user: userResponse
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
exports.getusers = async (req, res) => {
    try {
        const users = await signupModel.find({ email: { $ne: req.user.email } })
        if (!users) {
            return res.status(400).json({ msg: 'No users found' })
        }
        if (users.length === 0) {
            return res.status(400).json({ msg: 'No users found' })
        }

        // Map users to include full image path
        const usersWithImagePath = users.map(user => ({
            _id: user._id,
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            userphoto: `${req.protocol}://${req.get('host')}/${user.userphoto}`
        }));

        res.status(200).json({
            message: 'Users fetched successfully',
            users: usersWithImagePath
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

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please enter email" });
        }
        const user = await signupModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = generateOTP();
        console.log("otp", otp);
        let existingOtp = await registrationModel.findOne({ email });

        if (existingOtp) {
            await registrationModel.updateOne({ email }, { OTP: otp });
        } else {
            const data = new registrationModel({
                email: email,
                OTP: otp
            });
            await data.save();
        }

        res.status(200).json({
            status: true,
            message: "Reset OTP sent to email",
        });
    } catch (error) {
        console.error("Error forgot password:", error.message);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};

exports.verifyResetOtp = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Please enter email" });
        }
        if (!otp) {
            return res.status(400).json({ message: "Please enter OTP" });
        }
        if (!newPassword) {
            return res.status(400).json({ message: "Please enter newPassword" });
        }

        // First verify OTP
        const otpExists = await registrationModel.findOne({
            email: email,
            OTP: otp
        });

        if (!otpExists) {
            return res.status(400).json({ message: "Invalid OTP or email" });
        }

        // Update password in signup model
        const updatedUser = await signupModel.findOneAndUpdate(
            { email: email },
            {
                $set: {
                    password: newPassword,
                    verified: true
                }
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({ message: "User not found" });
        }

        // Delete the OTP record after successful password reset
        await registrationModel.deleteOne({ email: email });

        res.status(200).json({
            status: true,
            message: "Password reset successfully",
            data: {
                email: updatedUser.email
            }
        });

    } catch (error) {
        console.error("Error verifying reset OTP:", error.message);
        res.status(500).json({ status: false, message: "Server Error" });
    }
};