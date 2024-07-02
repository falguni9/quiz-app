const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/quiz', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Quiz Schema
const quizSchema = new mongoose.Schema({
  question: String,
  A: String,
  B: String,
  C: String,
  D: String,
  answer: String
});

const Quiz = mongoose.model('Quiz', quizSchema);

// Add a route to get the quiz questions
app.get('/api/questions', async (req, res) => {
  const questions = await Quiz.find();
  res.json(questions);
});

// Add initial quiz data
app.post('/api/add-questions', async (req, res) => {
  const questions = req.body;
  await Quiz.insertMany(questions);
  res.json({ message: 'Questions added successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
