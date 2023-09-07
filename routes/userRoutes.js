const express = require('express')

const user = require('../controllers/userController')

const router = express.Router()

router.post('/userSignUp', user.userSignUp)

module.exports = router
