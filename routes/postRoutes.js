const express = require('express');

const postController = require('../controllers/postController');
const { postImageUpload, videoUpload } = require('../middleware/userStorage');

const router = express.Router();

router.post('/createPostImage/:userId', postImageUpload.single('postImage'), postController.createPost);
router.post('/createPostVideo/:userId', videoUpload.single('postVideo'), postController.createPost);

module.exports = router;
