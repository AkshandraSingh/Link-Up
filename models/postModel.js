const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    postName: {
        type: String,
        required: true,
    },
    postDescription: {
        type: String,
        default: "",
    },
    postImage: {
        type: String,
        default: "",
    },
    postVideo: {
        type: String,
        default: "",
    },
    postLikes: {
        type: Number,
        default: 0,
    },
    postLikeList: {
        type: [],
        default: [],
    },
    userName: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true
    },
})

postSchema.set('timestamps', true)

module.exports = mongoose.model('post', postSchema)
