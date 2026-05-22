import { useState } from 'react';
import { Button } from '../components/Common/Button';
import { VacancyCard } from '../components/Vacancies/VacancyCard';
import { VacancyForm } from '../components/Vacancies/VacancyForm';
import { mockVacancies } from '../utils/mockData';
import '../styles/pages.css';

export const RecruiterVacanciesPage = () => {
  const [vacancies, setVacancies] = useState(mockVacancies);
  const [showForm, setShowForm] = useState(false);

  const handleCreateVacancy = (data) => {
    const newVacancy = {
      id: Math.max(...vacancies.map(v => v.id)) + 1,
      ...data,
      publishDate: new Date().toISOString().split('T')[0],
      status: 'active',
      applicants: 0,
    };
    setVacancies(prev => [newVacancy, ...prev]);
    setShowForm(false);
  };

  const handleDeleteVacancy = (id) => {
    setVacancies(prev => prev.filter(v => v.id !== id));
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <span className="page-eyebrow">Gestion de vacantes</span>
          <h1>Vacantes y requerimientos</h1>
          <p>Administra cargos abiertos, requisitos, fechas limite y volumen de aspirantes.</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : '+ Nueva vacante'}
        </Button>
      </div>

      <div className="module-summary">
        <div>
          <strong>{vacancies.length}</strong>
          <span>vacantes activas</span>
        </div>
        <div>
          <strong>{vacancies.reduce((total, vacancy) => total + vacancy.applicants, 0)}</strong>
          <span>aspirantes registrados</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>trazabilidad del proceso</span>
        </div>
      </div>

      {showForm && (
        <VacancyForm onSubmit={handleCreateVacancy} />
      )}

      <div className="vacancies-list">
        {vacancies.map(vacancy => (
          <VacancyCard
            key={vacancy.id}
            vacancy={vacancy}
            onView={(id) => console.log('View', id)}
            onEdit={(id) => console.log('Edit', id)}
            onDelete={handleDeleteVacancy}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );
};
