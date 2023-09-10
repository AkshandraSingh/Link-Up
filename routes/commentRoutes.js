const express = require('express');

const commentController = require('../controllers/commentController');

const router = express.Router();

router.post('/addComment/:userId/:postId', commentController.addComment);
router.patch('/editComment/:commentId', commentController.editComment);
router.delete('/deleteComment/:commentId', commentController.deleteComment)

module.exports = router;
