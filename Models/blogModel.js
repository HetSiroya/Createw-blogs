const express = require('express');
const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    blogImage: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Blog', blogSchema);