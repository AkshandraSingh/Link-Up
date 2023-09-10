const express = require('express')

const userRouter = require('./routes/userRoutes')
const postRouter = require('./routes/postRoutes')
const commentRouter = require('./routes/commentRoutes')

const commonRouter = express.Router()

commonRouter.use('/users', userRouter)
commonRouter.use('/post', postRouter)
commonRouter.use('/comments', commentRouter)

module.exports = commonRouter
