const express = require('express')

const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')

const commonRouter = express.Router()

commonRouter.use('/users', userRouter)
commonRouter.use('/post', postRouter)

module.exports = commonRouter
