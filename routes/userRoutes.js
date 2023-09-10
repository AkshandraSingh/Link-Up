const express = require('express')

const user = require('../controllers/userController')
const validations = require('../validations/userValidations/userValidator')
const { profilePicUpload } = require('../middleware/userStorage')
const { userAuthentication } = require('../middleware/authToken')

const router = express.Router()

router.post('/userSignUp', validations.userSignUpValidation, user.userSignUp)
router.post('/userLogin', validations.userLoginValidation, user.userLogin)
router.post('/forgetPassword', user.forgetPassword)
router.post('/resetPassword/:userId/:token', validations.resetPasswordValidation, user.resetPassword)
router.post('/setNewPassword/:userId', validations.setNewPasswordValidation, user.setNewPassword)
router.get('/showProfile/:userId', userAuthentication, user.profileDetails)
router.get('/searchAccount/:userName', userAuthentication, user.searchAccount)
router.get('/followAccount/:accountId/:userId', userAuthentication, user.followAccount)
router.get('/showFollowersList/:userId', userAuthentication, user.showFollowersList)
router.get('/showFollowingList/:userId', userAuthentication, user.showFollowingList)
router.get('/myPost/:userId', userAuthentication, user.myPost)
router.get('/userDashBoard/:userId', userAuthentication, user.userDashBoard)
router.patch('/editProfile/:userId', userAuthentication, profilePicUpload.single('userProfilePic'), user.editProfile)

module.exports = router
