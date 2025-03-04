const mongoose = require('mongoose');
const Likeschema = mongoose.Schema({

    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blogModel',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'signupModel',
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Blog Like', Likeschema);