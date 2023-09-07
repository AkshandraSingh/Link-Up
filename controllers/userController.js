const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel')
const emailService = require('../services/emailService')

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
    },

    userLogin: async (req, res) => {
        try {
            const { userAccount, userPassword } = req.body;
            const isEmail = await userModel.findOne({ userEmail: userAccount });
            const isUserName = await userModel.findOne({ userName: userAccount });
            if (!isEmail && !isUserName) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials. User not found.",
                });
            }
            const userData = isEmail || isUserName;
            const token = jwt.sign({ userData }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const isCorrectPassword = await bcrypt.compare(userPassword, userData.userPassword)
            if (!isCorrectPassword) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials. Password incorrect.",
                });
            }
            res.status(200).json({
                success: true,
                message: "Authentication successful.",
                token: token,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error!",
                error: error.message,
            });
        }
    },

    forgetPassword: async (req, res) => {
        try {
            const { userEmail } = req.body
            const isEmailExist = await userModel.findOne({
                userEmail: userEmail
            })
            if (!isEmailExist) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials. User not found.",
                });
            }
            const userId = isEmailExist._id
            const token = jwt.sign({ isEmailExist }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const link = `https://linkUp/resetPassword/${userId}/${token}`
            emailService.mailOptions(userEmail, link)
            res.status(200).send({
                success: true,
                message: "Email has been sended",
                userId: userId,
                token: token,
            })
        } catch (error) {
            res.status(500).json({
                success: false,
                message: "Error!",
                error: error.message,
            });
        }
    },
}
