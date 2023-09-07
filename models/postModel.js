const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postName: {
        type: String,
        required: true,
    },
    postImage: {
        type: String,
        default: "not-given",
    },
    postVideo: {
        type: String,
        default: "not-given",
    },
    postLikes: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

postSchema.set('timestamps', true)

module.exports = mongoose.model('user', userSchema)

