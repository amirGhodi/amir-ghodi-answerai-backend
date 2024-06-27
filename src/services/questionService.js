const Question = require('../models/Question');
const aiService = require('./aiService');

exports.createQuestion = async (userId, content) => {
    const answer = await aiService.generateAnswer(content);
    console.log("answer",answer);
    const question = new Question({ userId, content, answer });
    await question.save();
    return question;
};

exports.getQuestion = async (questionId) => {
    return Question.findById(questionId);
};
