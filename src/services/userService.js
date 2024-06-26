const User = require('../models/User');
const Question = require('../models/Question');

exports.createUser = async (email, password) => {
    await this.getUserByEmail(email).then(user => {
        if (user) {
            throw new Error('User already exists');
        }
    }); 
    const user = new User({ email, password });
    await user.save();
};

exports.getUserProfile = async (userId) => {
    return User.findById(userId).select('-password');
};

exports.getUserByEmail = async (email) => {
    return User.findOne({email:email});
};

exports.getUserQuestions = async (userId) => {
    return Question.find({ userId });
};

exports.getUsers = async () => {
    return User.find().select('-password');
}
