const postModel = require('../models/postModel');

module.exports = {
    createPost: async (req, res) => {
        try {
            const userId = req.params.userId;
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
                userId,
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
    }
};
