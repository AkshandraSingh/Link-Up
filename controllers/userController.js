const bcrypt = require('bcrypt')

const userModel = require('../models/userModel')

module.exports = {
    userSignUp: async (req, res) => {
        try {
            const userData = new userModel(req.body)
            const isEmailExist = await userModel.findOne({
                userEmail: userData.userEmail
            })
            const isPhoneExist = await userModel.findOne({
                userPhone: userData.userPhone
            })
            const isUserNameTaken = await userModel.findOne({
                userName: userData.userName
            })
            if (isEmailExist || isPhoneExist) {
                return res.status(401).send({
                    success: false,
                    message: "User is already exist with this email or phone number"
                })
            }
            if (isUserNameTaken) {
                return res.status(401).send({
                    success: false,
                    message: "This user name is already taken ,try another"
                })
            }
            const bcryptPassword = await bcrypt.hash(userData.userPassword, 10);
            userData.userProfilePic = 'D:/My Space/Node Projects/LinkUp/uploads/avatars/blankAvatar.jpg'
            userData.userPassword = bcryptPassword
            userData.usedPassword.push(bcryptPassword);
            await userData.save()
            res.status(201).send({
                success: true,
                message: "Your account is created!",
                user: userData,
            })
        } catch (error) {
            res.status(500).send({
                success: false,
                message: "Error!",
                error: error.message
            })
        }
    }
}
