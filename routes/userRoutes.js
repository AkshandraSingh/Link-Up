const express = require('express')

const user = require('../controllers/userController')

const router = express.Router()

router.post('/userSignUp', user.userSignUp)
router.post('/userLogin', user.userLogin)
router.post('/forgetPassword', user.forgetPassword)

module.exports = router
