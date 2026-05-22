import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Button } from '../Common/Button';
import { Card, CardBody, CardHeader } from '../Common/Card';
import '../Tests/PsychometricTest.css';

export const PsychometricTest = ({ test, onSubmit, candidateName }) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const allAnswered = test.questions.every(q => answers[q.id] !== undefined);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (allAnswered) {
      setSubmitted(true);
      onSubmit?.({
        candidateName,
        testId: test.id,
        answers,
        completedAt: new Date().toISOString(),
      });
    }
  };

  if (submitted) {
    return (
      <Card className="psychometric-result">
        <CardBody>
          <div className="result-content">
            <CheckCircle size={64} className="success-icon" />
            <h2>¡Test Psicotécnico Completado!</h2>
            <p>Tus respuestas han sido registradas correctamente.</p>
            <p className="result-info">
              El equipo de recursos humanos analizará tus respuestas y te contactará pronto con los resultados.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  const progress = (Object.keys(answers).length / test.questions.length) * 100;

  return (
    <div className="psychometric-test">
      <Card>
        <CardHeader>
          <h2>{test.title}</h2>
          <p>Tiempo estimado: {test.duration} minutos</p>
        </CardHeader>

        <CardBody>
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="progress-text">Completadas {Object.keys(answers).length} de {test.questions.length} preguntas</p>
          </div>

          <form onSubmit={handleSubmit} className="psychometric-form">
            {test.questions.map((question, index) => (
              <div key={question.id} className="question-card">
                <div className="question-header">
                  <h3>{index + 1}. {question.question}</h3>
                  {answers[question.id] !== undefined && (
                    <CheckCircle size={20} className="answered-icon" />
                  )}
                </div>

                {question.type === 'scale' && (
                  <div className="scale-options">
                    {[1, 2, 3, 4, 5].map(value => (
                      <button
                        key={value}
                        type="button"
                        className={`scale-btn ${answers[question.id] === value ? 'selected' : ''}`}
                        onClick={() => handleAnswer(question.id, value)}
                      >
                        {value}
                      </button>
                    ))}
                    <div className="scale-labels">
                      <span>Totalmente en desacuerdo</span>
                      <span>Totalmente de acuerdo</span>
                    </div>
                  </div>
                )}

                {question.type === 'multiple_choice' && (
                  <div className="choice-options">
                    {question.options.map((option, idx) => (
                      <label key={idx} className="choice">
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={idx}
                          checked={answers[question.id] === idx}
                          onChange={() => handleAnswer(question.id, idx)}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="form-footer">
              <Button
                type="submit"
                variant="success"
                size="lg"
                disabled={!allAnswered}
                fullWidth
              >
                Enviar Test Psicotécnico
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};
