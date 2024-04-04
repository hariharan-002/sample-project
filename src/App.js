import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuizApp = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizData, setQuizData] = useState(null);
  const [showAnswers, setShowAnswers] = useState(false);
  const [wrongOption, setWrongOption] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/questions');
        setQuizData(response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchData();
  }, []);

  const shuffleOptions = (options) => {
    
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    return options;
  };

  const handleOptionSelect = (selectedOption) => {
    if (!showAnswers) {
      setSelectedOption(selectedOption);
      if (selectedOption !== quizData[currentQuestionIndex].answer) {
        setWrongOption(selectedOption);
        setQuizData((prevData) => {
          const updatedData = [...prevData];
          updatedData[currentQuestionIndex].options = shuffleOptions(updatedData[currentQuestionIndex].options);
          return updatedData;
        });
      } else {
        setWrongOption(null);
      }
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setWrongOption(null);
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = () => {
    setShowAnswers(true);
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  const currentQuestion = quizData[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizData.length - 1;

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
      {currentQuestion && (
        <>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#4CAF50' }}>{currentQuestion.question}</h2>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
            {shuffleOptions(currentQuestion.options).map((option) => (
              <div
                key={option.id}
                onClick={() => handleOptionSelect(option.name)}
                style={{ 
                  width: '20%', 
                  margin: '10px',
                  marginTop:'10px', 
                  cursor: 'pointer', 
                  transition: 'transform 0.3s, box-shadow 0.3s', 
                  boxShadow: wrongOption === option.name ? '0 0 10px rgba(255, 0, 0, 0.7)' : '0 0 10px rgba(0, 0, 0, 0.3)',
                  backgroundColor: selectedOption === option.name && wrongOption === option.name ? 'rgba(255, 0, 0, 0.2)' : 'transparent',
                  border: wrongOption === option.name ? '2px solid red' : 'none',
                  borderRadius: '8px',
                }}
              >
                <img src={option.image} alt={option.name} style={{ width: '90px', height: '100px', borderRadius: '8px' }} />
                <p style={{ fontSize: '16px', marginTop: '5px', color: '#333' }}>{option.name}</p>
              </div>
            ))}
          </div>
          {!showAnswers && selectedOption && (
            <p style={{ fontSize: '18px', color: selectedOption === currentQuestion.answer ? '#4CAF50' : '#F44336', marginTop: '20px' }}>{selectedOption === currentQuestion.answer ? 'Correct!' : `Incorrect! The correct answer is ${currentQuestion.answer}`}</p>
          )}
          {showAnswers && (
            <p style={{ fontSize: '18px', color: '#4CAF50', marginTop: '20px' }}>The correct answer is {currentQuestion.answer}</p>
          )}
          {!showAnswers && (
            <button onClick={handleNextQuestion} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '20px', transition: 'background-color 0.3s, color 0.3s', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              Next
            </button>
          )}
          {isLastQuestion && !showAnswers && (
            <button onClick={handleSubmit} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', marginTop: '20px', transition: 'background-color 0.3s, color 0.3s', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
              Submit
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default QuizApp;
