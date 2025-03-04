const express = require('express');
const likeModel = require('../Models/likeModel');


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
        const like = new likeModel({
            blogId,
            userId
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
