const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  A: { type: String, required: true },
  B: { type: String, required: true },
  C: { type: String, required: true },
  D: { type: String, required: true },
  answer: { type: String, required: true },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
