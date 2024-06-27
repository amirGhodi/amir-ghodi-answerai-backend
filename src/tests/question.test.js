const sinon = require('sinon');
const chai = require('chai');
const expect = chai.expect;
chai.use(require('sinon-chai'));
const QuestionService = require('../services/questionService');
const Question = require('../models/Question');
const aiService = require('../services/aiService');

describe('QuestionService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createQuestion', () => {
    it('should create a new question with a generated answer', async () => {
      const userId = 'userId';
      const content = 'Sample question content';
      const answer = 'Sample answer';
      const question = { content, answer };

      sandbox.stub(aiService, 'generateAnswer').resolves(answer);

      sandbox.stub(Question.prototype, 'save').resolves(question);

      const result = await QuestionService.createQuestion(userId, content);

      expect(aiService.generateAnswer).to.have.been.calledOnceWith(content);
      expect(Question.prototype.save).to.have.been.calledOnce;
      expect(result).to.includes(question);
    });

    it('should handle error when generateAnswer fails', async () => {
      const userId = 'userId';
      const content = 'Sample question content';

      sandbox.stub(aiService, 'generateAnswer').rejects(new Error('Failed to generate answer'));

      try {
        await QuestionService.createQuestion(userId, content);
      } catch (err) {
        expect(err.message).to.equal('Failed to generate answer');
      }
    });

    it('should handle error when saving question fails', async () => {
      const userId = 'userId';
      const content = 'Sample question content';

      sandbox.stub(aiService, 'generateAnswer').resolves('Sample answer');
      sandbox.stub(Question.prototype, 'save').rejects(new Error('Failed to save question'));

      try {
        await QuestionService.createQuestion(userId, content);
      } catch (err) {
        expect(err.message).to.equal('Failed to save question');
      }
    });
  });

  describe('getQuestion', () => {
    it('should return a question by its ID', async () => {
      const questionId = 'questionId';
      const question = { _id: questionId, userId: 'userId', content: 'Sample question content' };

      sandbox.stub(Question, 'findById').resolves(question);

      const result = await QuestionService.getQuestion(questionId);

      expect(Question.findById).to.have.been.calledOnceWith(questionId);
      expect(result).to.deep.equal(question);
    });

    it('should return null if question is not found', async () => {
      const questionId = 'questionId';

      sandbox.stub(Question, 'findById').resolves(null);

      const result = await QuestionService.getQuestion(questionId);

      expect(Question.findById).to.have.been.calledOnceWith(questionId);
      expect(result).to.be.null;
    });
  });
});
