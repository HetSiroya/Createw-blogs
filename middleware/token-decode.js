const jwt = require('jsonwebtoken');
const signupModel = require('../Models/signupModel');
// const SignInModel = require('../Models/SignIn.model');

exports.security = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            return res.status(400).json({ status: false, message: 'Token missing', data: {} });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(400).json({ status: false, message: 'Invalid token format', data: {} });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(400).json({ status: false, message: 'Invalid token', data: {} });
        }

        const userId = decoded.id;
        const decodedUser = await signupModel.findById(userId);
        if (!decodedUser) {
            return res.status(400).json({ status: false, message: 'User not found', data: {} });
        }

        if (decodedUser.token !== token) {
            return res.status(401).json({ status: false, message: 'Token has been invalidated', data: {} });
        }

        req.user = decodedUser;
        next();
    } catch (err) {
        return res.status(400).json({ status: false, message: err.message, data: {} });
    }
};