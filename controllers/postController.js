const postModel = require('../models/postModel');
const userModel = require('../models/userModel')
const postLogger = require('../utils/postLogger/postLogger')

module.exports = {
    createPost: async (req, res) => {
        try {
            const userId = req.params.userId;
            const userData = await userModel.findById(userId)
            const userName = userData.userName
            let postImage;
            let postVideo;
            if (req.file && req.file.fieldname === 'postImage') {
                postImage = `/upload/userPostImage/${req.file.filename}`;
            }
            if (req.file && req.file.fieldname === 'postVideo') {
                postVideo = `/upload/userVideoPost/${req.file.filename}`;
            }
            const newPostData = {
                ...req.body,
                userName,
                postImage,
                postVideo
            };
            const newPost = new postModel(newPostData);
            await newPost.save();
            postLogger.log('info', 'Post created successfully')
            res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: newPost
            });
        } catch (error) {
            postLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },

    editPost: async (req, res) => {
        try {
            const { postId } = req.params
            const postName = req.body.postName ? `${req.body.postName}` : undefined;
            const postDescription = req.body.postDescription ? `${req.body.postDescription}` : undefined;
            const postData = await postModel.findByIdAndUpdate(postId, {
                postName: postName,
                postDescription: postDescription,
            },
                { new: true }
            )
            postLogger.log('info', 'Post is updated')
            res.status(200).send({
                success: true,
                message: "Post is updated",
                postUpdated: postData
            })
        } catch (error) {
            postLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },

    deletePost: async (req, res) => {
        try {
            const { postId } = req.params
            const postData = await postModel.findByIdAndDelete(postId)
            postLogger.log('info', 'Post deleted!')
            res.status(200).send({
                success: true,
                message: "Post deleted!",
                postDelete: postData
            })
        } catch (error) {
            postLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },

    postDetails: async (req, res) => {
        try {
            const { postId } = req.params
            const postData = await postModel.findById(postId)
            const postSelectedData = await postModel.findById(postId).select('postName postDescription postImage postVideo postLikes')
            const userData = await userModel.findOne({
                userName: postData.userName
            }).select('userName userProfilePic')
            postLogger.log('info', 'Post details found')
            res.status(200).send({
                success: true,
                message: 'Post details found',
                userInfo: userData,
                postInfo: postSelectedData,
            })
        } catch (error) {
            postLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },

    likeDislikePost: async (req, res) => {
        try {
            const { postId, userId } = req.params
            const postData = await postModel.findById(postId);
            const userData = await userModel.findById(userId);
            if (postData.postLikeList.includes(userData.userName)) {
                const userNameIndex = postData.postLikeList.indexOf(userData.userName)
                postData.postLikeList.splice(userNameIndex, 1)
                postData.postLikes -= 1
                postData.save()
                postLogger.log('info', 'You dislike the post')
                res.status(200).send({
                    success: true,
                    message: "You dislike the post"
                })
            } else {
                postData.postLikeList.push(userData.userName)
                postData.postLikes += 1
                postData.save()
                postLogger.log('info', 'You like the post')
                res.status(200).send({
                    success: true,
                    message: "You like the post"
                })
            }
        } catch (error) {
            postLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },
};
