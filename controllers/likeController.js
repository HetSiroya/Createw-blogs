const express = require('express');
const likeModel = require('../Models/likeModel');
const blogModel = require('../Models/blogModel');


exports.likeBlog = async (req, res) => {
    try {
        const { blogId } = req.query;
        const userId = req.user._id;
        if (!blogId) {
            return res.status(400).json({
                message: 'Blog ID is required '
            })
        }
        const existingLike = await likeModel.findOne({ blogId, userId });
        if (existingLike) {
            return res.status(400).json({
                message: 'Blog already liked'
            });
        }
        const blog = await blogModel.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                message: 'Blog not found'
            });
        }
        const like = new likeModel({
            blogId: blogId,
            userId: userId,
            blog_post_by: blog.userId
        });
        await like.save();

        const count = await likeModel.find({
            blogId
        })
        console.log("count", count.length);

        res.status(200).json({
            message: 'Blog liked successfully',
            like: like,
            count: count.length
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
}


exports.dislike = async (req, res) => {
    try {
        const { blogId } = req.query;
        const userId = req.user._id;
        if (!blogId) {
            return res.status(400).json({
                message: 'Blog ID is required '
            })
        }
        const existingLike = await likeModel.findOne({
            blogId,
            userId
        });
        if (!existingLike) {
            return res.status(400).json({
                message: 'Blog not liked'
            });
        }
        await likeModel.deleteOne({
            blogId,
            userId
        });
        res.status(200).json({
            message: 'Blog disliked successfully'
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
}

exports.getLikes = async (req, res) => {
    try {
        const userid = req.user._id;
        const likes = await likeModel.find({
            userId: userid
        });
        const like_id = likes.map(like => like.blogId);

        res.status(200).json({
            message: 'Likes fetched successfully',
            likes: like_id
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
}

exports.getblogdetail = async (req, res) => {
    try {
        const userid = req.user.id;
        const likes = await likeModel.find({
            userId: userid
        });
        const like_id = likes.map(like => like.blogId);
                const blog = await blogModel.find({
                    _id: { $in: like_id }
                });
        
        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        res.status(200).json({
            message: 'Blog detail fetched successfully',
            blog: blog
        });
    }
    catch (err) {
        res.status(500).json({
            message: 'Error retrieving blog',
            error: err.message
        });
    }
}