const express = require('express');
const blogModel = require('../Models/blogModel')

exports.postblog = async (req, res) => {
    try {
        const blogphto = req.file
        const { title, content, category } = req.body;
        const blog = new blogModel({
            blogImage: blogphto.path,
            title: title,
            description: content,
            category: category
        });
        await blog.save();
        res.status(201).json({ message: 'Blog created successfully', blog });
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
        const { category } = req.query
        const blogs = await blogModel.find({ category: category });
        res.status(200).json({ blogs });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error retrieving blogs',
            error: err.message
        });
    }
}
