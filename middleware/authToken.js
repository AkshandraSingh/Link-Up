const jwt = require('jsonwebtoken')

const userAuthentication = async (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer')) {
        let token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    message: "User authentication failed!"
                });
            } else {
                req.user = decoded.userData;
                next();
            }
        })
    } else {
        res.status(401).json({
            success: false,
            message: "Token not found!"
        })
    }
}


module.exports = {
    userAuthentication
}
