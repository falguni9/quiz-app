const express = require('express');
const { getQuestions, addQuestions } = require('../controllers/quizController');

const router = express.Router();

router.get('/questions', getQuestions);
router.post('/add-questions', addQuestions);

module.exports = router;
