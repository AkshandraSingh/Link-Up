const express = require('express')

const user = require('../controllers/userController')

const router = express.Router()

router.post('/userSignUp', user.userSignUp)
router.post('/userLogin', user.userLogin)
router.post('/forgetPassword', user.forgetPassword)
router.post('/resetPassword/:userId/:token', user.resetPassword)
router.post('/setNewPassword/:userId', user.setNewPassword)
router.get('/showProfile/:userId', user.showProfile)

module.exports = router
