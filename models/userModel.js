const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
    userPassword: {
        type: String,
        required: true,
    },
    userPhone: {
        type: Number,
        required: true,
    },
    userGender: {
        type: String,
        default: ""
    },
    userBio: {
        type: String,
        default: ""
    },
    pastPassword: {
        type: [],
        required: []
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

userSchema.set('timestamps', true)

module.exports = mongoose.model('user',userSchema)
