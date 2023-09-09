const express = require('express')

const user = require('../controllers/userController')
const validations = require('../validations/userValidations/userValidator')
const { profilePicUpload } = require('../middleware/userStorage')

const router = express.Router()

router.post('/userSignUp', validations.userSignUpValidation, user.userSignUp)
router.post('/userLogin', validations.userLoginValidation, user.userLogin)
router.post('/forgetPassword', user.forgetPassword)
router.post('/resetPassword/:userId/:token', validations.resetPasswordValidation, user.resetPassword)
router.post('/setNewPassword/:userId', validations.setNewPasswordValidation, user.setNewPassword)
router.get('/showProfile/:userId', user.profileDetails)
router.get('/searchAccount/:userName', user.searchAccount)
router.get('/followAccount/:accountId/:userId', user.followAccount)
router.get('/showFollowersList/:userId', user.showFollowersList)
router.get('/showFollowingList/:userId', user.showFollowingList)
router.get('/myPost/:userId', user.myPost)
router.get('/userDashBoard/:userId', user.userDashBoard)
router.patch('/editProfile/:userId', profilePicUpload.single('userProfilePic'), user.editProfile)

module.exports = router
