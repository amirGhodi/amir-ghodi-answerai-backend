const { createQuestion, getQuestion } = require('../services/questionService');

exports.createQuestion = async (req, res, next) => {
    const { content } = req.body;
    const userId = req.user.userId;

    console.log("userid",userId);
    console.log("content",content);

    try {
        const question = await createQuestion(userId, content);
        res.status(201).json(question);
    } catch (err) {
        next(err);
    }
};

exports.getQuestion = async (req, res, next) => {
    const { questionId } = req.params;

    try {
        const question = await getQuestion(questionId);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }
        res.json(question);
    } catch (err) {
        next(err);
    }
};
