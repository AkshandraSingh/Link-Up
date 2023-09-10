const express = require('express');

const postController = require('../controllers/postController');
const { postImageUpload, videoUpload } = require('../middleware/userStorage');

const router = express.Router();

router.post('/createImage/:userId', postImageUpload.single('postImage'), postController.createPost);
router.post('/createVideo/:userId', videoUpload.single('postVideo'), postController.createPost);
router.patch('/editPost/:postId', postController.editPost)
router.delete('/delete/:postId', postController.deletePost)
router.get('details/:postId', postController.postDetails)
router.get('/likeDislike/:userId/:postId', postController.likeDislikePost)

module.exports = router;
