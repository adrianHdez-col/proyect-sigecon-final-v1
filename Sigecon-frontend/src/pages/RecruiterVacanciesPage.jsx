import { useMemo, useState } from 'react';
import { Button } from '../components/Common/Button';
import { Input, Select } from '../components/Common/Input';
import { VacancyForm } from '../components/Vacancies/VacancyForm';
import { mockVacancies } from '../utils/mockData';
import '../styles/pages.css';

const statusOptions = [
  { value: '', label: 'Todos los estados' },
  { value: 'active', label: 'Activas' },
  { value: 'inactive', label: 'Inactivas' },
];

export const RecruiterVacanciesPage = () => {
  const [vacancies, setVacancies] = useState(mockVacancies);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const departments = useMemo(
    () => [...new Set(vacancies.map((v) => v.department))].sort(),
    [vacancies]
  );

  const filteredVacancies = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return vacancies.filter((vacancy) => {
      const matchesSearch =
        !query ||
        vacancy.title.toLowerCase().includes(query) ||
        vacancy.department.toLowerCase().includes(query) ||
        vacancy.location.toLowerCase().includes(query);
      const matchesStatus = !statusFilter || vacancy.status === statusFilter;
      const matchesDepartment = !departmentFilter || vacancy.department === departmentFilter;
      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [vacancies, searchQuery, statusFilter, departmentFilter]);

  const totalOpen = vacancies.filter((v) => v.status === 'active').length;
  const totalApplicants = vacancies.reduce((total, vacancy) => total + vacancy.applicants, 0);
  const activeRatio = vacancies.length ? Math.round((totalOpen / vacancies.length) * 100) : 0;

  const handleCreateVacancy = (data) => {
    const requirements = data.requirements
      ? data.requirements.split(',').map((item) => item.trim()).filter(Boolean)
      : [];

    const newVacancy = {
      id: vacancies.length ? Math.max(...vacancies.map((v) => v.id)) + 1 : 1,
      ...data,
      requirements,
      publishDate: new Date().toISOString().split('T')[0],
      status: 'active',
      applicants: 0,
    };
    setVacancies((prev) => [newVacancy, ...prev]);
    setShowForm(false);
  };

  const handleDeleteVacancy = (id) => {
    setVacancies((prev) => prev.filter((v) => v.id !== id));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('');
    setDepartmentFilter('');
  };

  return (
    <div className="page-container">
      <div className="module-header">
        <div>
          <span className="page-eyebrow">Gestión de vacantes</span>
          <h1>Vacantes y requerimientos</h1>
          <p>Administra cargos abiertos, requisitos, fechas límite y volumen de aspirantes.</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? 'Cancelar' : '+ Nueva vacante'}
        </Button>
      </div>

      <div className="quick-actions recruiter-summary-cards">
        <div className="panel-stat-card">
          <span className="panel-stat-value">{vacancies.length}</span>
          <span className="panel-stat-label">Vacantes publicadas</span>
        </div>
        <div className="panel-stat-card">
          <span className="panel-stat-value">{totalApplicants}</span>
          <span className="panel-stat-label">Aspirantes totales</span>
        </div>
        <div className="panel-stat-card">
          <span className="panel-stat-value">{activeRatio}%</span>
          <span className="panel-stat-label">Vacantes activas</span>
        </div>
      </div>

      <div className="panel-surface">
        <div className="panel-controls">
          <div className="panel-search">
            <Input
              placeholder="Buscar por título, departamento o ciudad"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>

          <div className="filter-row">
            <Select
              label="Estado"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              options={statusOptions}
            />
            <Select
              label="Departamento"
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              options={[
                { value: '', label: 'Todos los departamentos' },
                ...departments.map((department) => ({ value: department, label: department })),
              ]}
            />
            <Button variant="secondary" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        </div>

        {showForm && <VacancyForm onSubmit={handleCreateVacancy} />}

        <div className="vacancies-table-wrap">
          <table className="vacancies-table">
            <thead>
              <tr>
                <th>Vacante</th>
                <th>Departamento</th>
                <th>Ubicación</th>
                <th>Aspirantes</th>
                <th>Fecha límite</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredVacancies.length > 0 ? (
                filteredVacancies.map((vacancy) => (
                  <tr key={vacancy.id}>
                    <td>
                      <div className="job-title-cell">
                        <strong>{vacancy.title}</strong>
                        <small>{vacancy.description}</small>
                      </div>
                    </td>
                    <td>{vacancy.department}</td>
                    <td>{vacancy.location}</td>
                    <td>{vacancy.applicants}</td>
                    <td>{vacancy.deadline}</td>
                    <td>
                      <span className={`status-badge ${vacancy.status}`}>
                        {vacancy.status === 'active' ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="table-actions">
                      <Button variant="primary" size="sm" onClick={() => console.log('View', vacancy.id)}>
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => console.log('Edit', vacancy.id)}>
                        Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDeleteVacancy(vacancy.id)}>
                        Eliminar
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    No hay vacantes que coincidan con los filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
