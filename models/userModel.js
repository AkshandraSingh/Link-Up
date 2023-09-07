const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    accountPassword: {
        type: String,
        required: true,
    },
    userPhone: {
        type: Number,
        required: true,
    },
    userGender: {
        type: String,
        required: true,
    },
    userProfilePic: {
        type: String,
        required: true,
    },
    userBio: {
        type: String,
        default: ""
    },
    usedPassword: {
        type: [],
        required: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

userSchema.set('timestamps', true)

module.exports = mongoose.model('user', userSchema);
