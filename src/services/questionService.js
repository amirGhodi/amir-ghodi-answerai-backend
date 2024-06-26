const Question = require('../models/Question');
const { generateAnswer } = require('./aiService');

exports.createQuestion = async (userId, content) => {
    const answer = await generateAnswer(content);
    console.log("answer",answer);
    // const answer = "I'm sorry, I don't have an answer for you right now.";
    const question = new Question({ userId, content, answer });
    await question.save();
    return question;
};

exports.getQuestion = async (questionId) => {
    return Question.findById(questionId);
};
