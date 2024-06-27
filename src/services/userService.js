const User = require("../models/User");
const Question = require("../models/Question");

exports.createUser = async (email, password) => {
  await this.getUserByEmail(email).then((user) => {
    if (user) {
      throw new Error("User already exists");
    }
  });
  const user = new User({ email, password });
  await user.save();
};

exports.getUserProfile = async (userId) => {
  const userDetails = User.findById(userId);
  if (userDetails) {
    delete userDetails.password;
  }
  return userDetails;
};

exports.getUserByEmail = async (email) => {
  return User.findOne({ email: email });
};

exports.getUserQuestions = async (userId) => {
  return Question.find({ userId });
};

exports.getUsers = async () => {
  const userDetails = User.find();
  if (userDetails) {
    delete userDetails.password;
  }
  return userDetails;
};
