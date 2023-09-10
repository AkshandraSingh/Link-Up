const express = require('express');

const commentController = require('../controllers/commentController');
const commentValidation = require('../validations/commentValidations/commentValidator')

const router = express.Router();

router.post('/addComment/:userId/:postId', commentValidation.createPost, commentController.addComment);
router.patch('/editComment/:commentId', commentValidation.createPost, commentController.editComment);
router.delete('/deleteComment/:commentId', commentController.deleteComment)
router.get('/likeComment/:commentId/:userId', commentController.likeComment)

module.exports = router;
