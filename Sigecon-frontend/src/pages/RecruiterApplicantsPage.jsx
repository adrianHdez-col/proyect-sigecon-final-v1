import { useState } from 'react';
import { Card, CardBody, CardHeader } from '../components/Common/Card';
import { ApplicationCard } from '../components/Applications/ApplicationCard';
import { mockApplications, mockVacancies } from '../utils/mockData';
import '../styles/pages.css';

export const RecruiterApplicantsPage = () => {
  const [applications] = useState(mockApplications);

  const getVacancy = (vacancyId) => {
    return mockVacancies.find(v => v.id === vacancyId);
  };

  const pendingApplications = applications.filter((app) => !app.score).length;
  const evaluatedApplications = applications.length - pendingApplications;

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <span className="page-eyebrow">Gestion de candidatos</span>
          <h1>Postulaciones y seguimiento</h1>
          <p>Revisa aspirantes, estados del proceso, puntajes y acciones de evaluacion.</p>
        </div>
      </div>

      <div className="module-summary">
        <div>
          <strong>{applications.length}</strong>
          <span>postulaciones recibidas</span>
        </div>
        <div>
          <strong>{pendingApplications}</strong>
          <span>pendientes por revisar</span>
        </div>
        <div>
          <strong>{evaluatedApplications}</strong>
          <span>con resultado registrado</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <h2>Pipeline de aspirantes</h2>
        </CardHeader>
        <CardBody>
          <div className="applications-grid">
            {applications.map(app => (
              <ApplicationCard
                key={app.id}
                application={app}
                vacancy={getVacancy(app.vacancyId)}
                onView={(id) => console.log('View application', id)}
                onEvaluate={(id) => console.log('Evaluate', id)}
              />
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
