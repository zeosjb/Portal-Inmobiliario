const { response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateToken = async (req, res = response, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'No token provided in the request'
        });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(id);

        if (!user || !user.isActive) {
            return res.status(401).json({
                message: 'Token is invalid - user not authorized'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({
            message: 'Invalid token'
        });
    }
};

module.exports = validateToken;
