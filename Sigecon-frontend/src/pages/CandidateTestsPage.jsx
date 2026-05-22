import { useState } from 'react';
import { AlertCircle, ClipboardCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardBody, CardHeader } from '../components/Common/Card';
import { KnowledgeTest } from '../components/Tests/KnowledgeTest';
import { PsychometricTest } from '../components/Tests/PsychometricTest';
import { mockKnowledgeTest, mockPsychometricTest } from '../utils/mockData';
import '../styles/pages.css';

export const CandidateTestsPage = () => {
  const { user } = useAuth();
  const isEvaluator = user?.role === 'evaluator';
  const [testState, setTestState] = useState({
    knowledgeStarted: false,
    psychometricStarted: false,
    results: {},
  });

  const handleStartTest = (testType) => {
    setTestState(prev => ({
      ...prev,
      [testType + 'Started']: true,
    }));
  };

  const handleTestSubmit = (result) => {
    setTestState(prev => ({
      ...prev,
      results: { ...prev.results, [result.testId]: result },
    }));
  };

  if (!isEvaluator && testState.knowledgeStarted && !testState.results[mockKnowledgeTest.id]) {
    return (
      <div className="page-container">
        <KnowledgeTest
          test={mockKnowledgeTest}
          candidateName="Aspirante"
          onSubmit={handleTestSubmit}
        />
      </div>
    );
  }

  if (!isEvaluator && testState.psychometricStarted && !testState.results[mockPsychometricTest.id]) {
    return (
      <div className="page-container">
        <PsychometricTest
          test={mockPsychometricTest}
          candidateName="Aspirante"
          onSubmit={handleTestSubmit}
        />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <span className="page-eyebrow">
            {isEvaluator ? 'Mesa de evaluacion' : 'Pruebas del proceso'}
          </span>
          <h1>{isEvaluator ? 'Aplicacion y revision de pruebas' : 'Mis pruebas asignadas'}</h1>
          <p>
            {isEvaluator
              ? 'Monitorea pruebas activas, criterios de aprobacion y resultados pendientes de revision.'
              : 'Completa tus evaluaciones para avanzar dentro del proceso de seleccion.'}
          </p>
        </div>
      </div>

      <div className="module-summary">
        <div>
          <strong>2</strong>
          <span>{isEvaluator ? 'pruebas configuradas' : 'pruebas asignadas'}</span>
        </div>
        <div>
          <strong>{mockKnowledgeTest.passingScore}%</strong>
          <span>puntaje minimo</span>
        </div>
        <div>
          <strong>{mockKnowledgeTest.duration + mockPsychometricTest.duration} min</strong>
          <span>duracion total estimada</span>
        </div>
      </div>

      <div className="tests-grid">
        <Card>
          <CardHeader>
            <h2>Test de conocimientos</h2>
          </CardHeader>
          <CardBody>
            <div className="test-info">
              <ClipboardCheck size={24} className="info-icon" />
              <p>Evalua competencias tecnicas relacionadas con la vacante seleccionada.</p>
            </div>
            <p>
              <strong>Duracion:</strong> {mockKnowledgeTest.duration} minutos
            </p>
            <p>
              <strong>Total de preguntas:</strong> {mockKnowledgeTest.totalQuestions}
            </p>
            <p>
              <strong>Calificacion minima:</strong> {mockKnowledgeTest.passingScore}%
            </p>
            {testState.results[mockKnowledgeTest.id] ? (
              <div className="test-result">
                <p>
                  Completado - Puntuacion: {testState.results[mockKnowledgeTest.id].score}%
                </p>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg full-width"
                onClick={() => handleStartTest('knowledge')}
                disabled={isEvaluator}
              >
                {isEvaluator ? 'Disponible para aspirantes' : 'Comenzar test'}
              </button>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2>Test psicotecnico</h2>
          </CardHeader>
          <CardBody>
            <div className="test-info">
              <AlertCircle size={24} className="info-icon" />
              <p>Analiza habilidades cognitivas, criterios de trabajo y aptitudes personales.</p>
            </div>
            <p>
              <strong>Duracion:</strong> {mockPsychometricTest.duration} minutos
            </p>
            <p>
              <strong>Preguntas:</strong> {mockPsychometricTest.questions.length}
            </p>
            {testState.results[mockPsychometricTest.id] ? (
              <div className="test-result">
                <p>Completado</p>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-lg full-width"
                onClick={() => handleStartTest('psychometric')}
                disabled={isEvaluator}
              >
                {isEvaluator ? 'Disponible para aspirantes' : 'Comenzar test'}
              </button>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
