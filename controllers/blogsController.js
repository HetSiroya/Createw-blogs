const express = require('express');
const blogModel = require('../Models/blogModel');
const signupModel = require('../Models/signupModel');

exports.postblog = async (req, res) => {
    try {
        const user = req.user
        const userId = user._id
        console.log(userId);
        const blogphto = req.file
        console.log("blogphto", blogphto);

        const { title, content, category } = req.body;
        const blog = new blogModel({
            userId: userId,
            blogImage: blogphto.filename,
            title: title,
            description: content,
            category: category
        });
        await blog.save();
        res.status(201).json({
            message: 'Blog created successfully',
            blog,
            blogPath: blogphto.filename
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error creating blog',
            error: err.message
        });
    }
}
exports.getblogs = async (req, res) => {
    try {
        const user = req.user
        const { userid, category } = req.query;
        const currentUser = user.id;
        let blogs;

        if (!userid && !category) {
            blogs = await blogModel.find({ userId: { $ne: currentUser } })
                .populate('userId', 'name email profileImage');
        } else if (userid && !category) {
            blogs = await blogModel.find({
                userId: userid,
                userId: { $ne: currentUser }
            }).populate('userId', 'name email profileImage');
        } else if (!userid && category) {
            blogs = await blogModel.find({
                category: category,
                userId: { $ne: currentUser }
            }).populate('userId', 'name email profileImage');
        } else {
            blogs = await blogModel.find({
                userId: userid,
                category: category,
                userId: { $ne: currentUser }
            }).populate('userId', 'name email profileImage');
        }

        res.status(200).json({ blogs });
    } catch (err) {
        res.status(500).json({
            message: 'Error retrieving blogs',
            error: err.message
        });
    }
};


exports.editblog = async (req, res) => {
    try {
        const { blogId } = req.query;
        const blog = await blogModel.findByIdAndUpdate(blogId, req.body, { new: true });
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog updated successfully', blog });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error updating blog',
            error: err.message
        });
    }
}

exports.deleteblog = async (req, res) => {
    try {
        const { blogId } = req.query;
        const blog = await blogModel.findByIdAndDelete(blogId);
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({ message: 'Blog deleted successfully' });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error deleting blog',
            error: err.message
        });
    }
}

exports.getblogsuser = async (req, res) => {
    try {
        const { userId } = req.query;
        const blogs = await blogModel.find({ userId });
        if (!blogs) {
            return res.status(404).json({ message: 'No blogs found for this user' });
        }
        res.status(200).json({ blogs });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error retrieving user blogs',
            error: err.message
        });
    }
}

exports.loginuserdetail = async (req, res) => {
    try {
        const user = req.user
        console.log(user);
        const userdetail = await signupModel.findById(user._id);
        if (!userdetail) {
            return res.status(404).json({ message: 'User not found' });
        }
        const loginuserblog = await blogModel.find({ userId: userdetail._id });
        res.status(200).json({ userdetail, loginuserblog });
        // res.status(200).json({ user });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error retrieving user',
            error: err.message
        });
    }
}



