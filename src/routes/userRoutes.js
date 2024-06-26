const express = require('express');
const { getUsers, createUser, getUserProfile, getUserQuestions } = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', createUser);
router.get('/getalluser', verifyToken, getUsers);
router.get('/:userId', verifyToken, getUserProfile);
router.get('/:userId/questions',verifyToken, getUserQuestions);

module.exports = router;
