import { useState } from 'react';
import { Button } from '../components/Common/Button';
import { VacancyCard } from '../components/Vacancies/VacancyCard';
import { ApplicationForm } from '../components/Applications/ApplicationForm';
import { mockVacancies } from '../utils/mockData';
import '../styles/pages.css';

export const CandidateVacanciesPage = () => {
  const [vacancies] = useState(mockVacancies);
  const [selectedVacancy, setSelectedVacancy] = useState(null);

  const handleApply = (data) => {
    console.log('Aplicando a vacante:', data);
    setSelectedVacancy(null);
    alert('Postulacion enviada exitosamente');
  };

  if (selectedVacancy) {
    return (
      <div className="page-container">
        <div className="module-header">
          <div>
            <span className="page-eyebrow">Postulacion</span>
            <h1>Aplicar a {selectedVacancy.title}</h1>
            <p>Completa tu informacion y adjunta tu hoja de vida para continuar el proceso.</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedVacancy(null)}>
            Volver
          </Button>
        </div>
        <ApplicationForm vacancy={selectedVacancy} onSubmit={handleApply} />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <span className="page-eyebrow">Portal del aspirante</span>
          <h1>Oportunidades disponibles</h1>
          <p>Explora vacantes activas, compara requisitos y postulate al cargo adecuado.</p>
        </div>
      </div>

      <div className="module-summary">
        <div>
          <strong>{vacancies.length}</strong>
          <span>vacantes abiertas</span>
        </div>
        <div>
          <strong>2</strong>
          <span>pruebas del proceso</span>
        </div>
        <div>
          <strong>24h</strong>
          <span>tiempo promedio de revision</span>
        </div>
      </div>

      <div className="vacancies-list">
        {vacancies.map(vacancy => (
          <VacancyCard
            key={vacancy.id}
            vacancy={vacancy}
            onView={() => setSelectedVacancy(vacancy)}
            showActions={true}
          />
        ))}
      </div>
    </div>
  );
};
