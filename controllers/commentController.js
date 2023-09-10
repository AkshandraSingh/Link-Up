const commentModel = require('../models/commentModel')

module.exports = {
    addComment: async (req, res) => {
        try {
            const { userId, postId } = req.params
            const commentData = new commentModel(req.body)
            commentData.userId = userId
            commentData.postId = postId
            commentData.save()
            res.status(201).send({
                success: true,
                message: "Comment added successfully",
                comment: commentData
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message,
            })
        }
    },

    editComment: async (req, res) => {
        try {
            const { commentId } = req.params
            const commentData = await commentModel.findByIdAndUpdate(commentId, { comment: req.body.comment }, { new: true, })
            res.status(200).send({
                success: true,
                message: "Comment updated successfully",
                comment: commentData
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message,
            })
        }
    },

    deleteComment: async (req, res) => {
        try {
            const { commentId } = req.params
            const commentData = await commentModel.findByIdAndDelete(commentId)
            res.status(200).send({
                success: true,
                message: "Comment deleted successfully",
                comment: commentData
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message,
            })
        }
    },
}
