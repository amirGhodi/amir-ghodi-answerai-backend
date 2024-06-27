const sinon = require('sinon');
const chai = require('chai');
chai.use(require('sinon-chai'));
const jwt = require('jsonwebtoken');
const TokenBlacklist = require('../models/TokenBlacklist');
const { JWT_SECRET } = require('../config');
const AuthService = require('../services/authService');
const User = require('../models/User');
const expect = chai.expect;

describe('AuthService', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('authenticateUser', () => {
    it('should authenticate user and return a token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const userId = 'userId';
      const user = new User({ _id: userId, email, password });

      sandbox.stub(User, 'findOne').resolves(user);
      sandbox.stub(user, 'comparePassword').resolves(true);
      sandbox.stub(jwt, 'sign').returns('mockedToken');

      const token = await AuthService.authenticateUser(email, password);

      expect(User.findOne).to.have.been.calledOnceWith({ email });
      expect(user.comparePassword).to.have.been.calledOnceWith(password);
      expect(jwt.sign).to.have.been.calledOnceWith({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
      expect(token).to.equal('mockedToken');
    });

    it('should throw error for invalid email', async () => {
      const email = 'nonexistent@example.com';
      const password = 'password123';
      const user = null;

      sandbox.stub(User, 'findOne').resolves(user);

      try {
        await AuthService.authenticateUser(email, password);
      } catch (err) {
        expect(User.findOne).to.have.been.calledOnceWith({ email });
        expect(err.message).to.equal('Invalid email or password');
      }
    });

    it('should throw error for invalid password', async () => {
      const email = 'test@example.com';
      const password = 'wrongPassword';
      const userId = 'userId';
      const user = new User({ _id: userId, email, password });

      sandbox.stub(User, 'findOne').resolves(user);
      sandbox.stub(user, 'comparePassword').resolves(false);

      try {
        await AuthService.authenticateUser(email, password);
      } catch (err) {
        expect(User.findOne).to.have.been.calledOnceWith({ email });
        expect(user.comparePassword).to.have.been.calledOnceWith(password);
        expect(err.message).to.equal('Invalid email or password');
      }
    });
  });

  describe('refreshToken', () => {
    it('should refresh token and blacklist old token', async () => {
      const token = 'oldToken';
      const userId = 'userId';
      const payload = { userId };

      sandbox.stub(TokenBlacklist, 'create').resolves();
      sandbox.stub(jwt, 'verify').returns(payload);
      sandbox.stub(jwt, 'sign').returns('refreshedToken');

      const refreshedToken = await AuthService.refreshToken(token);

      expect(TokenBlacklist.create).to.have.been.calledOnceWith({ token });
      expect(jwt.verify).to.have.been.calledOnceWith(token, JWT_SECRET);
      expect(jwt.sign).to.have.been.calledOnceWith({ userId: payload.userId }, JWT_SECRET, { expiresIn: '1h' });
      expect(refreshedToken).to.equal('refreshedToken');
    });
  });
});
