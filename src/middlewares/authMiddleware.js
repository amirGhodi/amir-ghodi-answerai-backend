const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const TokenBlacklist = require('../models/TokenBlacklist');

exports.verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const tokenExists = await TokenBlacklist.exists({ token });

        if (tokenExists) {
            return res.status(401).json({ message: 'Token revoked or expired' });
        }
        const payload = jwt.verify(token, JWT_SECRET);
        req.user = payload;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
