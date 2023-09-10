const joi = require('joi')
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = joi.extend(joiPasswordExtendCore);

const postSchema = {
    createPost: joi.object({
        postName: joi
            .string()
            .max(20)
            .min(3)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-man": "{#label} should be at least {#limit} characters",
            })
            .required(),
        postDescription: joi
            .string()
            .max(170)
            .min(3)
            .message({
                "string-min": "{#label} should be at least {#limit} characters",
                "string-man": "{#label} should be at least {#limit} characters",
            })
            .required(),
    }).unknown(true),
}

module.exports = postSchema
