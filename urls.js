const express = require('express')

const userRouter = require('./routes/userRoutes')

const commonRouter = express.Router()

commonRouter.use('/users', userRouter)

module.exports = commonRouter
