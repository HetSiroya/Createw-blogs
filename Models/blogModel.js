const express = require('express');
const mongoose = require('mongoose');
const blogSchema = mongoose.Schema({
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