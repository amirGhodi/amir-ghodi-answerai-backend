const { authenticateUser, refreshToken } = require('../services/authService');
const TokenBlacklist = require('../models/TokenBlacklist');

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const token = await authenticateUser(email, password);
        res.json({ token });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};

exports.logout = async (req, res) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Add token to blacklist or mark it as expired
        await TokenBlacklist.create({ token });

        res.json({ message: 'Logout successful' });
    } catch (err) {
        console.error('Logout error:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.refreshToken = async (req, res, next) => {
    const { token } = req.body;

    try {
        const newToken = await refreshToken(token);
        res.json({ token: newToken });
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
};
