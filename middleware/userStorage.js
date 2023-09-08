const multer = require('multer');
const path = require('path');

const profilePicStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '..', 'uploads', 'userProfilePics'));
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        callback(null, `image_${Date.now()}${ext}`);
    }
});
const videoStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '..', 'uploads', 'userPostVideos'));
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        callback(null, `video_${Date.now()}${ext}`);
    }
});
const postImageStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, path.join(__dirname, '..', 'uploads', 'userPostImage'));
    },
    filename: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        callback(null, `image_${Date.now()}${ext}`);
    }
});

const profilePicFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new Error('Only image files are supported'));
    }
};
const postImageFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('image')) {
        callback(null, true);
    } else {
        callback(new Error('Only image files are supported'));
    }
};
const videoFilter = (req, file, callback) => {
    if (file.mimetype.startsWith('video')) {
        callback(null, true);
    } else {
        callback(new Error('Only video files are supported'));
    }
};

const profilePicUpload = multer({ storage: profilePicStorage, fileFilter: profilePicFilter });
const postImageUpload = multer({ storage: postImageStorage, fileFilter: postImageFilter });
const videoUpload = multer({ storage: videoStorage, fileFilter: videoFilter });

module.exports = {
    profilePicUpload,
    videoUpload,
    postImageUpload,
};
