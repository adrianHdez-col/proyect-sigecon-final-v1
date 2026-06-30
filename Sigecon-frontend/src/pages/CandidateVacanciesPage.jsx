import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  ChevronDown,
  Clock3,
  Filter,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Common/Button';
import { VacancyCard } from '../components/Vacancies/VacancyCard';
import { ApplicationForm } from '../components/Applications/ApplicationForm';
import '../styles/pages.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const filterTabs = ['Todas', 'Remoto', 'Presencial', 'Híbrido', 'Tiempo completo', 'Medio tiempo'];
const filterGroups = ['Ubicación', 'Tipo de empleo', 'Experiencia', 'Modalidad'];
const categoryFilters = ['Tecnología', 'Diseño', 'Marketing', 'Ventas', 'Administración'];

const normalize = (value = '') =>
  value
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

const getCompanyName = (vacancy) =>
  vacancy.companyName || vacancy.company || vacancy.department || 'Empresa aliada';

const getInitials = (vacancy) => {
  const company = getCompanyName(vacancy);
  const words = company.split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase();
};

const getPostedLabel = (date) => {
  if (!date) return 'Publicado recientemente';
  const published = new Date(date);
  if (Number.isNaN(published.getTime())) return `Publicado ${date}`;

  const diffMs = Date.now() - published.getTime();
  const diffDays = Math.max(0, Math.floor(diffMs / 86400000));
  if (diffDays === 0) return 'Publicado hoy';
  if (diffDays === 1) return 'Publicado hace 1 día';
  return `Publicado hace ${diffDays} días`;
};

export const CandidateVacanciesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vacancies, setVacancies] = useState([]);
  const [applications, setApplications] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Todas');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [savedVacancyIds, setSavedVacancyIds] = useState(() => new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchVacancies = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/vacantes`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'No se pudieron cargar las vacantes.');
      }

      setVacancies(payload.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar vacantes.');
    } finally {
      setLoading(false);
    }
  };

  const fetchApplications = async () => {
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/postulaciones/mine`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.message || 'No se pudieron cargar tus postulaciones.');
      }

      setApplications(payload.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar postulaciones.');
    }
  };

  useEffect(() => {
    if (!user?.token) return;
    fetchVacancies();
    fetchApplications();
  }, [user?.token]);

  const handleApply = async (data) => {
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const payload = {
        vacancyId: data.vacancyId,
        coverLetter: data.coverLetter,
        candidateName: data.candidateName,
        email: data.email,
        phone: data.phone,
      };

      const response = await fetch(`${API_URL}/api/postulaciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'No se pudo enviar tu postulacion.');
      }

      setApplications((prev) => [
        {
          id: result.data.id,
          vacancyId: data.vacancyId,
          status: 'postulado',
          appliedDate: new Date().toISOString().split('T')[0],
          vacancyTitle: selectedVacancy?.title || '',
          companyName: selectedVacancy?.companyName || '',
        },
        ...prev,
      ]);
      setSelectedVacancy(null);
      setSuccess('Postulación enviada correctamente.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar la postulacion.');
    } finally {
      setSubmitting(false);
    }
  };

  const appliedVacancyIds = new Set(applications.map((application) => application.vacancyId));
  const selectedVacancyApplied = selectedVacancy ? appliedVacancyIds.has(selectedVacancy.id) : false;
  const profileName = user?.fullName || user?.name || 'Adrián López';
  const filteredVacancies = useMemo(() => {
    const query = normalize(searchQuery.trim());
    const tab = normalize(activeTab);
    const category = normalize(categoryFilter);

    return vacancies.filter((vacancy) => {
      const haystack = normalize([
        vacancy.title,
        vacancy.description,
        vacancy.location,
        vacancy.type,
        vacancy.department,
        getCompanyName(vacancy),
        ...(vacancy.requirements || []),
      ].join(' '));

      const matchesSearch = !query || haystack.includes(query);
      const matchesTab =
        activeTab === 'Todas' ||
        haystack.includes(tab) ||
        (tab === 'hibrido' && haystack.includes('hybrid')) ||
        (tab === 'tiempo completo' && haystack.includes('completo'));
      const matchesCategory = !category || haystack.includes(category);

      return matchesSearch && matchesTab && matchesCategory;
    });
  }, [activeTab, categoryFilter, searchQuery, vacancies]);

  const recommendedVacancy =
    filteredVacancies.find((vacancy) => !appliedVacancyIds.has(vacancy.id)) || filteredVacancies[0];

  const toggleSavedVacancy = (vacancyId) => {
    setSavedVacancyIds((prev) => {
      const next = new Set(prev);
      if (next.has(vacancyId)) {
        next.delete(vacancyId);
      } else {
        next.add(vacancyId);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveTab('Todas');
    setCategoryFilter('');
  };

  if (selectedVacancy) {
    return (
      <div className="page-container">
        <div className="module-header">
          <div>
            <span className="page-eyebrow">Postulación</span>
            <h1>Aplicar a {selectedVacancy.title}</h1>
            <p>Completa tu información y adjunta tu hoja de vida para continuar el proceso.</p>
          </div>
          <Button variant="outline" onClick={() => setSelectedVacancy(null)}>
            Volver
          </Button>
        </div>
        {selectedVacancyApplied ? (
          <div className="alert alert-info">
            Ya te has postulado a esta vacante. Revisa el estado en "Mis postulaciones".
          </div>
        ) : (
          <ApplicationForm vacancy={selectedVacancy} onSubmit={handleApply} loading={submitting} />
        )}
      </div>
    );
  }

  return (
    <div className="page-container jobs-page">
      <section className="jobs-sidebar-panel" aria-label="Filtros de ofertas">
        <div className="jobs-filter-block">
          <button type="button" className="jobs-side-link active">
            <Search size={18} />
            Explorar ofertas
          </button>
          <button type="button" className="jobs-side-link">
            <Sparkles size={18} />
            Recomendadas
          </button>
          <button type="button" className="jobs-side-link">
            <BriefcaseBusiness size={18} />
            Guardadas
            <span>{savedVacancyIds.size}</span>
          </button>
          <button type="button" className="jobs-side-link">
            <Clock3 size={18} />
            Historial de búsquedas
          </button>
        </div>

        <div className="jobs-filter-block">
          <span className="jobs-filter-title">Categorías</span>
          {categoryFilters.map((category) => (
            <button
              key={category}
              type="button"
              className={`jobs-side-link ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter((current) => (current === category ? '' : category))}
            >
              <BriefcaseBusiness size={17} />
              {category}
            </button>
          ))}
          <button type="button" className="jobs-side-link muted" onClick={() => setCategoryFilter('')}>
            Ver todas
          </button>
        </div>

        <div className="jobs-filter-block">
          <span className="jobs-filter-title">Filtros rápidos</span>
          {filterGroups.map((group) => (
            <button key={group} type="button" className="jobs-collapse-row">
              {group}
              <ChevronDown size={16} />
            </button>
          ))}
          <button type="button" className="jobs-clear-btn" onClick={clearFilters}>
            <RotateCcw size={16} />
            Limpiar filtros
          </button>
        </div>
      </section>

      <section className="jobs-main-panel">
        <div className="jobs-heading">
          <div>
            <h1>Ofertas de empleo</h1>
            <p>Encuentra oportunidades que se ajusten a tu perfil.</p>
          </div>
        </div>

        <div className="jobs-search-row">
          <div className="jobs-search">
            <Search size={18} />
            <input
              type="search"
              placeholder="Buscar por cargo, empresa o habilidad..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </div>
          <button type="button" className="jobs-filter-button">
            <Filter size={18} />
            Filtros
          </button>
        </div>

        <div className="jobs-tabs" aria-label="Tipo de oferta">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={activeTab === tab ? 'active' : ''}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <p className="jobs-count">{filteredVacancies.length} ofertas disponibles</p>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="vacancies-list">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="vacancy-card vacancy-card-loading" />
            ))
          : filteredVacancies.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                onView={() => setSelectedVacancy(vacancy)}
                showActions={true}
                isApplied={appliedVacancyIds.has(vacancy.id)}
                isSaved={savedVacancyIds.has(vacancy.id)}
                onToggleSave={() => toggleSavedVacancy(vacancy.id)}
                postedLabel={getPostedLabel(vacancy.publishDate)}
                companyInitials={getInitials(vacancy)}
                companyName={getCompanyName(vacancy)}
              />
            ))}
        {!loading && filteredVacancies.length === 0 && (
          <div className="empty-state-card">No hay ofertas que coincidan con tu búsqueda.</div>
        )}
      </div>
      </section>

      <aside className="jobs-right-panel" aria-label="Resumen de ofertas">
        <div className="jobs-mini-card">
          <h2>Perfil</h2>
          <div className="jobs-profile-mini">
            <span>{profileName.charAt(0)}</span>
            <div>
              <strong>{profileName}</strong>
              <small>{user?.email || 'aspirante@email.com'}</small>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/aspirant/resume')}>
            Completar perfil
          </Button>
        </div>

        <div className="jobs-mini-card">
          <h2>Resumen</h2>
          <div className="jobs-stat-row">
            <span>{vacancies.length}</span>
            <p>Ofertas abiertas</p>
          </div>
          <div className="jobs-stat-row">
            <span>{applications.length}</span>
            <p>Mis postulaciones</p>
          </div>
          <div className="jobs-stat-row">
            <span>{savedVacancyIds.size}</span>
            <p>Guardadas</p>
          </div>
        </div>

        {recommendedVacancy && (
          <div className="jobs-mini-card">
            <h2>Oferta recomendada</h2>
            <button
              type="button"
              className="jobs-recommendation-card"
              onClick={() => setSelectedVacancy(recommendedVacancy)}
            >
              <span>{getInitials(recommendedVacancy)}</span>
              <strong>{recommendedVacancy.title}</strong>
              <small>{getCompanyName(recommendedVacancy)}</small>
              <p>
                <MapPin size={15} />
                {recommendedVacancy.location || 'Ubicación no indicada'}
              </p>
              <p>
                <BriefcaseBusiness size={15} />
                {recommendedVacancy.type || 'Tipo no indicado'}
              </p>
              <em>{recommendedVacancy.salaryRange || 'Salario por convenir'}</em>
            </button>
          </div>
        )}
      </aside>

      {applications.length > 0 && (
        <section className="my-applications">
          <h2>Mis postulaciones</h2>
          <div className="applications-grid">
            {applications.map((application) => (
              <div key={application.id} className="application-summary-card">
                <strong>{application.vacancyTitle || 'Vacante'}</strong>
                <span>{application.companyName || 'Empresa'}</span>
                <span>Estado: {application.status}</span>
                <small>Fecha: {application.appliedDate}</small>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
