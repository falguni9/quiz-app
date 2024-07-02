import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [markedQuestions, setMarkedQuestions] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [questionTimes, setQuestionTimes] = useState([]);
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    axios.get('http://localhost:5000/api/questions')
      .then(response => {
        setQuestions(response.data);
        setSelectedAnswers(Array(response.data.length).fill(null));
        setMarkedQuestions(Array(response.data.length).fill(false));
        setQuestionTimes(Array(response.data.length).fill(0));
      })
      .catch(error => {
        console.error('There was an error fetching the questions!', error);
      });

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerOptionClick = (answer) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[currentQuestion] = answer;
    setSelectedAnswers(newSelectedAnswers);
  };

  const updateQuestionTime = () => {
    const now = Date.now();
    const timeSpent = (now - startTime) / 1000; // Time spent in seconds
    const newQuestionTimes = [...questionTimes];
    newQuestionTimes[currentQuestion] += timeSpent;
    setQuestionTimes(newQuestionTimes);
    setStartTime(now);
  };

  const handleNextButtonClick = () => {
    updateQuestionTime();
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
      calculateScore();
    }
  };

  const handlePreviousButtonClick = () => {
    updateQuestionTime();
    const prevQuestion = currentQuestion - 1;
    if (prevQuestion >= 0) {
      setCurrentQuestion(prevQuestion);
    }
  };

  const handleMarkButtonClick = () => {
    const newMarkedQuestions = [...markedQuestions];
    newMarkedQuestions[currentQuestion] = !newMarkedQuestions[currentQuestion];
    setMarkedQuestions(newMarkedQuestions);
  };

  const calculateScore = () => {
    const score = questions.reduce((acc, question, index) => {
      return acc + (selectedAnswers[index] === question.answer ? 1 : 0);
    }, 0);
    setScore(score);
  };

  const handleQuestionNumberClick = (index) => {
    updateQuestionTime();
    setCurrentQuestion(index);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const totalMarked = markedQuestions.filter(marked => marked).length;
  const totalAttempted = selectedAnswers.filter(answer => answer !== null).length;
  const totalNotAttempted = questions.length - totalAttempted;

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-8'>
          <div className='card'>
            <div className='card-body'>
              {showScore ? (
                <div className='alert alert-success' role='alert'>
                  You scored {score} out of {questions.length}
                </div>
              ) : (
                <>
                  <div className='mb-4'>
                    <h5>Question {currentQuestion + 1}/{questions.length}</h5>
                    <p className='lead'>{questions[currentQuestion]?.question}</p>
                  </div>
                  <div className='d-grid gap-2'>
                    <button
                      className={`btn btn-primary ${selectedAnswers[currentQuestion] === 'A' ? 'active' : ''}`}
                      onClick={() => handleAnswerOptionClick('A')}
                    >
                      {questions[currentQuestion]?.A}
                    </button>
                    <button
                      className={`btn btn-primary ${selectedAnswers[currentQuestion] === 'B' ? 'active' : ''}`}
                      onClick={() => handleAnswerOptionClick('B')}
                    >
                      {questions[currentQuestion]?.B}
                    </button>
                    <button
                      className={`btn btn-primary ${selectedAnswers[currentQuestion] === 'C' ? 'active' : ''}`}
                      onClick={() => handleAnswerOptionClick('C')}
                    >
                      {questions[currentQuestion]?.C}
                    </button>
                    <button
                      className={`btn btn-primary ${selectedAnswers[currentQuestion] === 'D' ? 'active' : ''}`}
                      onClick={() => handleAnswerOptionClick('D')}
                    >
                      {questions[currentQuestion]?.D}
                    </button>
                  </div>
                  <div className='d-flex justify-content-between mt-4'>
                    <button
                      className='btn btn-secondary'
                      onClick={handlePreviousButtonClick}
                      disabled={currentQuestion === 0}
                    >
                      Previous
                    </button>
                    <button
                      className='btn btn-warning'
                      onClick={handleMarkButtonClick}
                    >
                      Mark It
                    </button>
                    <button
                      className='btn btn-secondary'
                      onClick={handleNextButtonClick}
                    >
                      {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className='col-md-4'>
          <div className='list-group-container'>
            {questions.map((_, index) => (
              <div key={index} className='list-group-item-container'>
                <button
                  className={`list-group-item list-group-item-action ${currentQuestion === index ? 'active' : ''} ${selectedAnswers[index] ? 'attempted' : ''} ${markedQuestions[index] ? 'marked' : ''}`}
                  onClick={() => handleQuestionNumberClick(index)}
                >
                  {index + 1}
                </button>
                <small className='time-taken'>{formatTime(questionTimes[index])}</small>
              </div>
            ))}
          </div>
          <div className='mt-4'>
            <p>Current Time: {currentTime}</p>
            <p>Total Marked: {totalMarked}</p>
            <p>Total Attempted: {totalAttempted}</p>
            <p>Total Not Attempted: {totalNotAttempted}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
