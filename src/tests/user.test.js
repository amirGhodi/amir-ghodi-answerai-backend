// src/tests/user.test.js
const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
// chai.use(require('chai-as-promised'));
const expect = chai.expect;

const UserService = require('../services/userservice');
const User = require('../models/User');
const Question = require('../models/Question');

describe('UserService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const email = 'test123@example.com';
      const password = 'password123';

      sandbox.stub(User, 'findOne').resolves(null);
      sandbox.stub(User.prototype, 'save').resolves();

      await UserService.createUser(email, password);

      expect(User.findOne).to.have.been.calledOnceWith({ email });
      expect(User.prototype.save).to.have.been.calledOnce;
    });

    it('should throw an error if user already exists', async () => {
      const email = 'test@example.com';
      const password = 'password123';

      try{
        sandbox.stub(User, 'findOne').resolves({ email, password });

        await UserService.createUser(email, password)

      }catch(err){
        expect(User.findOne).to.have.been.calledOnceWith({ email });
        expect(err.message).to.be.equal('User already exists');
      }
      
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile without password', async () => {
      const userId = 'userId';
      const user = { _id: userId, email: 'test@example.com' };

      sandbox.stub(User, 'findById').resolves(user);

      const result = await UserService.getUserProfile(userId);

      expect(User.findById).to.have.been.calledOnceWith(userId);
      expect(result).to.deep.equal(user);
    });

    it('should return null if user not found', async () => {
      const userId = 'userId';

      sandbox.stub(User, 'findById').resolves(null);

      const result = await UserService.getUserProfile(userId);

      expect(User.findById).to.have.been.calledOnceWith(userId);
      expect(result).to.be.null;
    });
  });

  describe('getUserByEmail', () => {
    it('should return user by email', async () => {
      const email = 'test@example.com';
      const user = { _id: 'userId', email };

      sandbox.stub(User, 'findOne').resolves(user);

      const result = await UserService.getUserByEmail(email);

      expect(User.findOne).to.have.been.calledOnceWith({ email });
      expect(result).to.deep.equal(user);
    });

    it('should return null if user not found', async () => {
      const email = 'test@example.com';

      sandbox.stub(User, 'findOne').resolves(null);

      const result = await UserService.getUserByEmail(email);

      expect(User.findOne).to.have.been.calledOnceWith({ email });
      expect(result).to.be.null;
    });
  });

  describe('getUserQuestions', () => {
    it('should return questions asked by user', async () => {
      const userId = 'userId';
      const questions = [{ _id: 'questionId', userId }];

      sandbox.stub(Question, 'find').resolves(questions);

      const result = await UserService.getUserQuestions(userId);

      expect(Question.find).to.have.been.calledOnceWith({ userId });
      expect(result).to.deep.equal(questions);
    });

    it('should return an empty array if no questions found', async () => {
      const userId = 'userId';

      sandbox.stub(Question, 'find').resolves([]);

      const result = await UserService.getUserQuestions(userId);

      expect(Question.find).to.have.been.calledOnceWith({ userId });
      expect(result).to.deep.equal([]);
    });
  });

  describe('getUsers', () => {
    it('should return all users without password', async () => {
      const users = [{ _id: 'userId', email: 'test@example.com' }];

      sandbox.stub(User, 'find').resolves(users);

      const result = await UserService.getUsers();

      expect(User.find).to.have.been.calledOnce;
      expect(result).to.deep.equal(users);
    });
  });
});
