const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const userModel = require('../models/userModel')
const postModel = require('../models/postModel')
const emailService = require('../services/emailService')
const userLogger = require('../utils/userLogger/userLogger')

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
                userLogger.log('error', 'User is already exist with this email or phone number')
                return res.status(401).send({
                    success: false,
                    message: "User is already exist with this email or phone number"
                })
            }
            if (isUserNameTaken) {
                userLogger.log('error', 'This user name is already taken ,try another')
                return res.status(401).send({
                    success: false,
                    message: "This user name is already taken ,try another"
                })
            }
            const bcryptPassword = await bcrypt.hash(userData.accountPassword, 10);
            userData.userProfilePic = 'D:/My Space/Node Projects/LinkUp/uploads/avatars/blankAvatar.jpg'
            userData.accountPassword = bcryptPassword
            userData.usedPassword.push(bcryptPassword);
            await userData.save()
            userLogger.log('info', 'Your account is created!')
            res.status(201).send({
                success: true,
                message: "Your account is created!",
                user: userData,
            })
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error!",
                error: error.message
            })
        }
    },

    userLogin: async (req, res) => {
        try {
            const { userAccount, accountPassword } = req.body;
            const isEmail = await userModel.findOne({ userEmail: userAccount });
            const isUserName = await userModel.findOne({ userName: userAccount });
            if (!isEmail && !isUserName) {
                userLogger.log('error', 'Invalid credentials. User not found.')
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials. User not found.",
                });
            }
            const userData = isEmail || isUserName;
            const token = jwt.sign({ userData }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const isCorrectPassword = await bcrypt.compare(accountPassword, userData.accountPassword)
            if (!isCorrectPassword) {
                userLogger.log('error', 'Invalid credentials. Password incorrect.')
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials. Password incorrect.",
                });
            }
            userLogger.log('info', 'Authentication successful.')
            res.status(200).json({
                success: true,
                message: "Authentication successful.",
                token: token,
            });
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
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
                return res.status(404).json({
                    success: false,
                    message: "Invalid credentials. User not found.",
                });
            }
            const userId = isEmailExist._id
            const token = jwt.sign({ isEmailExist }, process.env.SECRET_KEY, { expiresIn: '1h' });
            const link = `https://linkUp/resetPassword/${userId}/${token}`
            emailService.mailOptions(userEmail, link)
            userLogger.log('info', 'Email has been sended')
            res.status(200).send({
                success: true,
                message: "Email has been sended",
                userId: userId,
                token: token,
            })
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error!",
                error: error.message,
            });
        }
    },

    resetPassword: async (req, res) => {
        let isPasswordExist = false
        try {
            const { newPassword, confirmPassword } = req.body
            const { userId, token } = req.params
            const isTokenCorrect = jwt.verify(token, process.env.SECRET_KEY);
            if (isTokenCorrect) {
                if (newPassword === confirmPassword) {
                    const userData = await userModel.findById(userId)
                    for (const oldPassword of userData.usedPassword) {
                        if (await bcrypt.compare(newPassword, oldPassword)) {
                            isPasswordExist = true;
                            break;
                        }
                    }
                    if (isPasswordExist) {
                        userLogger.log('error', "Don't use old passwords, try another password")
                        return res.status(401).json({
                            success: false,
                            message: "Don't use old passwords, try another password",
                        });
                    }
                    const bcryptPassword = await bcrypt.hash(newPassword, 10)
                    userData.usedPassword = bcryptPassword
                    userData.usedPassword.push(bcryptPassword)
                    await userData.save();
                    userLogger.log('info', "Password Updated")
                    res.status(201).json({
                        success: true,
                        message: "Password Updated",
                    });
                } else {
                    userLogger.log('error', "New password or confirm password is incorrect")
                    res.status(401).send({
                        success: false,
                        message: "New password or confirm password is incorrect"
                    })
                }
            } else {
                userLogger.log('error', 'Token is incorrect or expire')
                res.status(401).send({
                    success: false,
                    message: "Token is incorrect or expire"
                })
            }
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },

    setNewPassword: async (req, res) => {
        try {
            let isPasswordExist = false;
            const { userId } = req.params;
            const { oldPassword, newPassword, confirmPassword } = req.body;
            const userData = await userModel.findById(userId);
            const checkPassword = await bcrypt.compare(oldPassword, userData.accountPassword);
            if (checkPassword) {
                if (confirmPassword === newPassword) {
                    for (const usedPassword of userData.usedPassword) {
                        if (await bcrypt.compare(newPassword, usedPassword)) {
                            isPasswordExist = true;
                            break;
                        }
                    }
                    if (isPasswordExist) {
                        userLogger.log('error', "This password you already used in the past")
                        return res.status(401).json({
                            success: false,
                            message: "This password you already used in the past",
                        });
                    } else {
                        const bcryptPassword = await bcrypt.hash(newPassword, 10);
                        userData.accountPassword = bcryptPassword;
                        userData.usedPassword.push(bcryptPassword);
                        await userData.save();
                        userLogger.log('info', "Your Password is updated!")
                        res.status(200).json({
                            success: true,
                            message: "Your Password is updated!",
                        });
                    }
                } else {
                    userLogger.log('error', "New password and Confirm password do not match")
                    res.status(401).json({
                        success: false,
                        message: "New password and Confirm password do not match",
                    });
                }
            } else {
                userLogger.log('error', "Old Password is incorrect")
                res.status(401).json({
                    success: false,
                    message: "Old password is incorrect",
                });
            }
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).json({
                success: false,
                message: "Error",
                error: error.message,
            });
        }
    },

    profileDetails: async (req, res) => {
        try {
            const { userId } = req.params
            const userData = await userModel.findById(userId).select('userName name userBio userProfilePic userFollowers userFollowing')
            userLogger.log('info', 'Your profile found')
            res.status(200).send({
                success: true,
                message: "Your profile found",
                userProfile: userData
            })
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`)
            res.status(500).send({
                success: false,
                message: "Error",
                error: error.message
            });
        }
    },

    editProfile: async (req, res) => {
        try {
            const userId = req.params.userId;
            const { name, userBio, userName } = req.body;
            const userProfilePic = req.file ? `/upload/userProfile/${req.file.filename}` : undefined;
            if (userName) {
                const isUserNameTaken = await userModel.findOne({
                    userName: userName
                });
                if (isUserNameTaken) {
                    userLogger.log('error', 'This user name is already taken, try another');
                    return res.status(401).json({
                        success: false,
                        message: "This user name is already taken, try another"
                    });
                }
            }
            const updateUserData = await userModel.findByIdAndUpdate(
                userId,
                {
                    name: name || undefined,
                    userProfilePic: userProfilePic || undefined,
                    userBio: userBio || undefined,
                    userName: userName || undefined,
                },
                { new: true }
            );
            userLogger.log('info', "User profile updated");
            res.status(200).json({
                success: true,
                message: "User profile updated",
                updatedData: updateUserData
            });
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`,
            });
        }
    },

    searchAccount: async (req, res) => {
        try {
            const { userName } = req.params
            const searchData = await userModel.find({ userName: { $regex: `^${userName}`, $options: "i" } }).select('userName userProfilePic')
            if (searchData.length === 0) {
                return res.status(404).send({
                    success: false,
                    message: "Account not found!"
                })
            }
            res.status(200).send({
                success: true,
                message: "Account Found",
                accountData: searchData
            })
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`,
            });
        }
    },

    followAccount: async (req, res) => {
        try {
            const { accountId, userId } = req.params;
            const accountData = await userModel.findById(accountId);
            const userData = await userModel.findById(userId);
            const accountUserEmail = accountData.userEmail
            if (!accountData || !userData) {
                return res.status(404).json({
                    success: false,
                    message: "Account or user not found"
                });
            }
            const accountName = accountData.userName;
            const userAccountName = userData.userName;
            const isUserPresent = accountData.userFollowersList.includes(userAccountName);
            if (isUserPresent) {
                const userNameIndex = accountData.userFollowersList.indexOf(userAccountName);
                const accountNameIndex = userData.userFollowingList.indexOf(accountName);
                accountData.userFollowers -= 1;
                accountData.userFollowersList.splice(userNameIndex, 1);
                userData.userFollowing -= 1;
                userData.userFollowingList.splice(accountNameIndex, 1);
                await accountData.save();
                await userData.save();
                userLogger.log('info', 'Un follow successfully');
                return res.status(200).json({
                    success: true,
                    message: "Un follow successfully"
                });
            } else {
                accountData.userFollowers += 1;
                accountData.userFollowersList.push(userAccountName);
                userData.userFollowing += 1;
                userData.userFollowingList.push(accountName);
                await accountData.save();
                await userData.save();
                await emailService.mailOptions(accountUserEmail)
                userLogger.log('info', 'Follow successfully');
                return res.status(200).json({
                    success: true,
                    message: "Follow successfully"
                });
            }
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`
            });
        }
    },

    showFollowersList: async (req, res) => {
        try {
            const { userId } = req.params
            const userData = await userModel.findById(userId).select('userFollowersList')
            userLogger.log('info', 'User followers')
            res.status(200).send({
                success: true,
                message: "Your followers",
                followersList: userData
            })
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`
            });
        }
    },

    showFollowingList: async (req, res) => {
        try {
            const { userId } = req.params
            const userData = await userModel.findById(userId).select('userFollowingList')
            userLogger.log('info', 'User following')
            res.status(200).send({
                success: true,
                message: "Your following",
                followersList: userData
            })
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`
            });
        }
    },

    myPost: async (req, res) => {
        try {
            const { userId } = req.params
            const postData = await postModel.find({
                userId: userId
            }).select('postName postImage postVideo')
            if (postData.length === 0) {
                userLogger.log('info', 'Post not found')
                return res.status(404).send({
                    success: false,
                    message: "Post not found"
                })
            }
            userLogger.log('info', 'User all post')
            res.status(200).send({
                success: true,
                message: "Your all post",
                postData: postData
            })
        } catch (error) {
            userLogger.log('error', `Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`
            });
        }
    },

    userDashBoard: async (req, res) => {
        try {
            const { userId } = req.params;
            const userData = await userModel.findById(userId);
            const followingPost = await postModel.find({
                userName: userData.userFollowingList
            }).select('postName postImage postVideo postLikes')
            userLogger.log('info', 'User dashboard')
            res.status(200).send({
                success: true,
                message: "User dashboard",
                post: followingPost
            });
        } catch (error) {
            console.error(`Error: ${error.message}`);
            res.status(500).json({
                success: false,
                error: `Error occurred: ${error.message}`
            });
        }
    },
}
