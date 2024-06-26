const { createUser, getUserProfile, getUserQuestions, getUsers } = require('../services/userService');

exports.createUser = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        await createUser(email, password);
        res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
        next(err);
    }
};

exports.getUsers = async (req, res) => {
    try{
        const users = await getUsers();
        res.json(users);
    } catch (err) {
        next(err);
    }
};

exports.getUserProfile = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const user = await getUserProfile(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        next(err);
    }
};

exports.getUserQuestions = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const questions = await getUserQuestions(userId);
        res.json(questions);
    } catch (err) {
        next(err);
    }
};
