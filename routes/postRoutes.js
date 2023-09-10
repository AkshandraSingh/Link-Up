const express = require('express');

const postController = require('../controllers/postController');
const { postImageUpload, videoUpload } = require('../middleware/userStorage');
const postValidator = require('../validations/postValidations/postValidator')
const { userAuthentication } = require('../middleware/authToken')

const router = express.Router();

router.post('/createImage/:userId', userAuthentication, postImageUpload.single('postImage'), postValidator.createPost, postController.createPost);
router.post('/createVideo/:userId', userAuthentication, videoUpload.single('postVideo'), postValidator.createPost, postController.createPost);
router.patch('/editPost/:postId', userAuthentication, postController.editPost)
router.delete('/delete/:postId', userAuthentication, postController.deletePost)
router.get('details/:postId', userAuthentication, postController.postDetails)
router.get('/likeDislike/:userId/:postId', userAuthentication, postController.likeDislikePost)

module.exports = router;
