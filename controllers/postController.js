const postModel = require('../models/postModel');

module.exports = {
    createPost: async (req, res) => {
        try {
            const userId = req.params.userId;
            const postImage = req.file.postImage ? `/upload/userPostImage/${req.file.filename}` : undefined;
            const postVideo = req.file.postVideo ? `/upload/userVideoPost/${req.file.filename}` : undefined;
            const postDescription = req.body.postDescription ? `${req.body.postDescription}` : undefined;
            console.log(req.file.postImage)
            console.log(postVideo)
            const newPost = new postModel({
                userId: userId,
                postName: req.body.postName,
                postImage: postImage,
                postVideo: postVideo,
                postDescription: postDescription
            });
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
