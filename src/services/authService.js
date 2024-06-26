const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../config');
const TokenBlacklist = require('../models/TokenBlacklist');

exports.authenticateUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new Error('Invalid email or password');
    }

    return jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
};

exports.refreshToken = async (token) => {
    await TokenBlacklist.create({ token });
    const payload = jwt.verify(token, JWT_SECRET);
    return jwt.sign({ userId: payload.userId }, JWT_SECRET, { expiresIn: '1h' });
};
