import { useMemo, useState } from 'react';
import { Button } from '../components/Common/Button';
import { Input, Select } from '../components/Common/Input';
import { Card, CardBody, CardHeader } from '../components/Common/Card';
import { ApplicationCard } from '../components/Applications/ApplicationCard';
import { mockApplications, mockVacancies, statusLabels } from '../utils/mockData';
import '../styles/pages.css';

export const RecruiterApplicantsPage = () => {
  const [applications] = useState(mockApplications);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [vacancyFilter, setVacancyFilter] = useState('');

  const getVacancy = (vacancyId) => {
    return mockVacancies.find((v) => v.id === vacancyId);
  };

  const stageOptions = useMemo(
    () => [
      { value: '', label: 'Todas las etapas' },
      ...Array.from(new Set(applications.map((app) => app.status))).map((status) => ({
        value: status,
        label: statusLabels[status] || status,
      })),
    ],
    [applications]
  );

  const vacancyOptions = useMemo(
    () => [
      { value: '', label: 'Todas las vacantes' },
      ...mockVacancies.map((vacancy) => ({ value: vacancy.id.toString(), label: vacancy.title })),
    ],
    []
  );

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return applications.filter((application) => {
      const vacancy = getVacancy(application.vacancyId);
      const matchesSearch =
        !query ||
        application.candidateName.toLowerCase().includes(query) ||
        application.email.toLowerCase().includes(query) ||
        vacancy?.title.toLowerCase().includes(query);
      const matchesStage = !stageFilter || application.status === stageFilter;
      const matchesVacancy = !vacancyFilter || application.vacancyId.toString() === vacancyFilter;
      return matchesSearch && matchesStage && matchesVacancy;
    });
  }, [applications, searchQuery, stageFilter, vacancyFilter]);

  const totalApplications = applications.length;
  const evaluatedApplications = applications.filter((app) => app.score > 0).length;
  const pendingApplications = totalApplications - evaluatedApplications;

  const statusCounts = useMemo(() => {
    return applications.reduce((acc, application) => {
      acc[application.status] = (acc[application.status] || 0) + 1;
      return acc;
    }, {});
  }, [applications]);

  const clearFilters = () => {
    setSearchQuery('');
    setStageFilter('');
    setVacancyFilter('');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <span className="page-eyebrow">Gestión de candidatos</span>
          <h1>Postulaciones y seguimiento</h1>
          <p>Revisa aspirantes, estados del proceso, puntajes y acciones de evaluación.</p>
        </div>
      </div>

      <div className="quick-actions recruiter-summary-cards">
        <div className="panel-stat-card">
          <span className="panel-stat-value">{totalApplications}</span>
          <span className="panel-stat-label">Postulaciones recibidas</span>
        </div>
        <div className="panel-stat-card">
          <span className="panel-stat-value">{pendingApplications}</span>
          <span className="panel-stat-label">Pendientes por revisar</span>
        </div>
        <div className="panel-stat-card">
          <span className="panel-stat-value">{evaluatedApplications}</span>
          <span className="panel-stat-label">Evaluadas</span>
        </div>
      </div>

      <div className="panel-surface">
        <div className="panel-controls">
          <div className="panel-search">
            <Input
              placeholder="Buscar candidatos, correo o vacante"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="filter-row">
            <Select
              label="Etapa"
              value={stageFilter}
              onChange={(event) => setStageFilter(event.target.value)}
              options={stageOptions}
            />
            <Select
              label="Vacante"
              value={vacancyFilter}
              onChange={(event) => setVacancyFilter(event.target.value)}
              options={vacancyOptions}
            />
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>

          <div className="pipeline-summary">
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="pipeline-card">
                <span className="pipeline-card-title">{statusLabels[status] || status}</span>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="module-header">
              <div>
                <h2>Pipeline de aspirantes</h2>
                <p className="small-text">Organiza a tus candidatos según etapa y sigue el avance de cada vacante.</p>
              </div>
              <Button variant="primary" onClick={() => console.log('Export applications')}>
                Exportar lista
              </Button>
            </div>
          </CardHeader>
          <CardBody>
            <div className="applications-grid">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    vacancy={getVacancy(app.vacancyId)}
                    onView={(id) => console.log('View application', id)}
                    onEvaluate={(id) => console.log('Evaluate', id)}
                  />
                ))
              ) : (
                <div className="empty-state-card">
                  No hay aplicaciones que coincidan con los filtros.
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
