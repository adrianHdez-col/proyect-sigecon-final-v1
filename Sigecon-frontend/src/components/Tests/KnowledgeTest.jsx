import { useCallback, useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../Common/Button';
import { Card, CardBody, CardHeader } from '../Common/Card';
import '../Tests/KnowledgeTest.css';

export const KnowledgeTest = ({ test, onSubmit, candidateName }) => {
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(test.duration * 60);

  const question = test.questions[currentQuestion];
  const totalQuestions = test.questions.length;

  const handleAnswer = (answer) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer,
    }));
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmitTest = useCallback(() => {
    let correctCount = 0;
    test.questions.forEach((q, idx) => {
      if (q.type === 'multiple_choice' && answers[idx] === q.correctAnswer) {
        correctCount++;
      } else if (q.type === 'true_false' && answers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    setScore(calculatedScore);
    setSubmitted(true);

    onSubmit?.({
      candidateName,
      testId: test.id,
      score: calculatedScore,
      passed: calculatedScore >= test.passingScore,
      answers,
    });
  }, [answers, candidateName, onSubmit, test, totalQuestions]);

  useEffect(() => {
    if (submitted) return undefined;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleSubmitTest, submitted]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (submitted) {
    return (
      <Card className="test-result">
        <CardBody>
          <div className="result-content">
            <div className={`result-icon ${score >= test.passingScore ? 'success' : 'warning'}`}>
              {score >= test.passingScore ? (
                <CheckCircle size={64} />
              ) : (
                <AlertCircle size={64} />
              )}
            </div>
            <h2>{score >= test.passingScore ? '¡Felicidades!' : 'Resultado'}</h2>
            <p className="result-message">
              {score >= test.passingScore
                ? `Has aprobado la prueba con una puntuación de ${score}%`
                : `La puntuación mínima requerida es ${test.passingScore}%. Tu puntuación: ${score}%`}
            </p>
            <div className="result-score">
              <span className="score-value">{score}%</span>
              <span className="score-label">Puntuación Final</span>
            </div>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="knowledge-test">
      <Card>
        <CardHeader className="test-header">
          <div className="header-left">
            <h2>{test.title}</h2>
            <p className="test-meta">Pregunta {currentQuestion + 1} de {totalQuestions}</p>
          </div>
          <div className={`time-indicator ${timeLeft < 300 ? 'warning' : ''}`}>
            <Clock size={20} />
            {formatTime(timeLeft)}
          </div>
        </CardHeader>

        <CardBody className="test-body">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>

          <div className="question-container">
            <h3 className="question-text">{question.question}</h3>

            {question.type === 'multiple_choice' && (
              <div className="options">
                {question.options.map((option, idx) => (
                  <label key={idx} className="option">
                    <input
                      type="radio"
                      name="answer"
                      value={idx}
                      checked={answers[currentQuestion] === idx}
                      onChange={() => handleAnswer(idx)}
                    />
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {question.type === 'true_false' && (
              <div className="options">
                <label className="option">
                  <input
                    type="radio"
                    name="answer"
                    value={true}
                    checked={answers[currentQuestion] === true}
                    onChange={() => handleAnswer(true)}
                  />
                  <span className="option-text">Verdadero</span>
                </label>
                <label className="option">
                  <input
                    type="radio"
                    name="answer"
                    value={false}
                    checked={answers[currentQuestion] === false}
                    onChange={() => handleAnswer(false)}
                  />
                  <span className="option-text">Falso</span>
                </label>
              </div>
            )}

            {question.type === 'short_answer' && (
              <textarea
                className="short-answer"
                placeholder="Escribe tu respuesta aquí..."
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}
          </div>

          <div className="navigation-buttons">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              ← Anterior
            </Button>

            {currentQuestion < totalQuestions - 1 ? (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={answers[currentQuestion] === undefined}
              >
                Siguiente →
              </Button>
            ) : (
              <Button
                variant="success"
                onClick={handleSubmitTest}
              >
                Enviar Respuestas
              </Button>
            )}
          </div>

          <div className="question-summary">
            {test.questions.map((_, idx) => (
              <button
                key={idx}
                className={`question-dot ${
                  idx === currentQuestion ? 'current' : answers[idx] !== undefined ? 'answered' : ''
                }`}
                onClick={() => setCurrentQuestion(idx)}
                title={`Pregunta ${idx + 1}`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
