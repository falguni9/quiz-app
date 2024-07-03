const Quiz = require('../models/quizModel');

const getQuestions = async (req, res) => {
  try {
    const questions = await Quiz.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const addQuestions = async (req, res) => {
  try {
    const questions = req.body;
    await Quiz.insertMany(questions);
    res.json({ message: 'Questions added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

module.exports = {
  getQuestions,
  addQuestions,
};
