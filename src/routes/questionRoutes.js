const express = require('express');
const { createQuestion, getQuestion } = require('../controllers/questionController');

const router = express.Router();

router.post('/', createQuestion);
router.get('/:questionId', getQuestion);

module.exports = router;
