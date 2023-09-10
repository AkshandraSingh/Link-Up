const commentModel = require('../models/commentModel')
const userModel = require('../models/userModel')
const commentLogger = require('../utils/commentLogger/commentLogger')

module.exports = {
    addComment: async (req, res) => {
        try {
            const { userId, postId } = req.params
            const commentData = new commentModel(req.body)
            commentData.userId = userId
            commentData.postId = postId
            commentData.save()
            commentLogger.log('info', 'Comment added successfully')
            res.status(201).send({
                success: true,
                message: "Comment added successfully",
                comment: commentData
            })
        } catch (error) {
            commentLogger.log('error', `Error: ${error.message}`)
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
            commentLogger.log('info', 'Comment updated successfully')
            res.status(200).send({
                success: true,
                message: "Comment updated successfully",
                comment: commentData
            })
        } catch (error) {
            commentLogger.log('error', `Error: ${error.message}`)
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
            commentLogger.log('info', 'Comment deleted successfully')
            res.status(200).send({
                success: true,
                message: "Comment deleted successfully",
                comment: commentData
            })
        } catch (error) {
            commentLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message,
            })
        }
    },

    likeComment: async (req, res) => {
        try {
            const { commentId, userId } = req.params
            const commentData = await commentModel.findById(commentId)
            const userData = await userModel.findById(userId)
            const userName = userData.userName
            if (commentData.commentLikeList.includes(userName)) {
                const userNameIndex = commentData.commentLikeList.indexOf(userName)
                commentData.commentLikes -= 1
                commentData.commentLikeList.splice(userNameIndex, 1)
                await commentData.save()
                commentLogger.log('info', 'You remove like')
                res.status(200).send({
                    success: true,
                    message: "You remove like",
                })
            } else {
                commentData.commentLikes += 1
                commentData.commentLikeList.push(userName)
                await commentData.save()
                commentLogger.log('info', 'You like comment')
                res.status(200).send({
                    success: true,
                    message: "You like comment",
                })
            }
        } catch (error) {
            commentLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message,
            })
        }
    },
}
