const express = require('express');

const commentController = require('../controllers/commentController');
const commentValidation = require('../validations/commentValidations/commentValidator')
const { userAuthentication } = require('../middleware/authToken')

const router = express.Router();

router.post('/addComment/:userId/:postId', userAuthentication, commentValidation.createPost, commentController.addComment);
router.patch('/editComment/:commentId', userAuthentication, commentValidation.createPost, commentController.editComment);
router.delete('/deleteComment/:commentId', userAuthentication, commentController.deleteComment)
router.get('/likeComment/:commentId/:userId', userAuthentication, commentController.likeComment)

module.exports = router;
