const postSchema = require('./postValSchema')

module.exports = {
    createPost: async (req, res, next) => {
        const value = await postSchema.createPost.validate(req.body, { abortEarly: false })
        if (value.error) {
            return res.status(403).json({
                success: false,
                message: value.error.details[0].message
            })
        } else {
            next()
        }
    },
}
