const postModel = require('../models/postModel');
const userModel = require('../models/userModel')

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
            res.status(201).json({
                success: true,
                message: "Post created successfully",
                post: newPost
            });
        } catch (error) {
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
            res.status(200).send({
                success: true,
                message: "Post is updated",
                postUpdated: postData
            })
        } catch (error) {
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
            res.status(200).send({
                success: true,
                message: "Post Deleted!",
                postDelete: postData
            })
        } catch (error) {
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
            res.status(200).send({
                success: true,
                message: 'Post details found',
                userInfo: userData,
                postInfo: postSelectedData,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    }
};
