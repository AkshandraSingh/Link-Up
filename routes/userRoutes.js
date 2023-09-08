const express = require('express')

const user = require('../controllers/userController')
const { profilePicUpload } = require('../middleware/userStorage')

const router = express.Router()

router.post('/userSignUp', user.userSignUp)
router.post('/userLogin', user.userLogin)
router.post('/forgetPassword', user.forgetPassword)
router.post('/resetPassword/:userId/:token', user.resetPassword)
router.post('/setNewPassword/:userId', user.setNewPassword)
router.get('/showProfile/:userId', user.profileDetails)
router.get('/searchAccount/:userName', user.searchAccount)
router.get('/followAccount/:accountId/:userId', user.followAccount)
router.get('/showFollowersList/:userId', user.showFollowersList)
router.get('/showFollowingList/:userId', user.showFollowingList)
router.get('/myPost/:userId', user.myPost)
router.patch('/editProfile/:userId', profilePicUpload.single('userProfilePic'), user.editProfile)

module.exports = router
