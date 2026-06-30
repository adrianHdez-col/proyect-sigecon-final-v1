import { Bookmark, CheckCircle2, Clock, DollarSign, MapPin, Users } from 'lucide-react';
import { Button } from '../Common/Button';
import '../Vacancies/VacancyCard.css';

export const VacancyCard = ({
  vacancy,
  onView,
  onEdit,
  onDelete,
  showActions = true,
  isApplied = false,
  isSaved = false,
  onToggleSave,
  postedLabel,
  companyInitials,
  companyName,
}) => {
  const displayCompany =
    companyName || vacancy.companyName || vacancy.company || vacancy.department || 'Empresa aliada';
  const logoText = companyInitials || displayCompany.slice(0, 2).toUpperCase();

  return (
    <div className={`vacancy-card ${isApplied ? 'vacancy-card-applied' : ''}`}>
      <div className="vacancy-logo" aria-hidden="true">
        {logoText}
      </div>

      <div className="vacancy-content">
        <div className="vacancy-header">
          <div>
            <h3>{vacancy.title}</h3>
            <p className="vacancy-department">
              {displayCompany}
              <CheckCircle2 size={15} />
            </p>
          </div>

          <div className="vacancy-header-right">
            {isApplied ? (
              <span className="vacancy-applied-badge">Postulado</span>
            ) : (
              <span className="vacancy-new-badge">Nuevo</span>
            )}
            {onToggleSave && (
              <button
                className={`vacancy-save-btn ${isSaved ? 'saved' : ''}`}
                type="button"
                aria-label={isSaved ? 'Quitar de guardadas' : 'Guardar oferta'}
                onClick={onToggleSave}
              >
                <Bookmark size={20} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}
          </div>
        </div>

        <div className="vacancy-details">
          <div className="detail">
            <MapPin size={16} />
            <span>{vacancy.location || 'Ubicación no indicada'}</span>
          </div>
          <div className="detail">
            <Clock size={16} />
            <span>{vacancy.type || 'Tipo no indicado'}</span>
          </div>
          <div className="detail optional-detail">
            <Users size={16} />
            <span>{vacancy.applicants ?? 0} aspirantes</span>
          </div>
        </div>

        {vacancy.description && <p className="vacancy-description">{vacancy.description}</p>}

        <div className="vacancy-skills">
          {vacancy.requirements?.slice(0, 5).map((req, idx) => (
            <span key={`${req}-${idx}`} className="skill-tag">
              {req}
            </span>
          ))}
        </div>
      </div>

      <div className="vacancy-side">
        <span className={`vacancy-status status-${vacancy.status}`}>
          {vacancy.status === 'active' ? 'Activa' : 'Inactiva'}
        </span>
        <small>{postedLabel || 'Publicado recientemente'}</small>
        <strong>
          <DollarSign size={16} />
          {vacancy.salaryRange || 'Salario por convenir'}
        </strong>

        {showActions && (
          <div className="vacancy-actions">
            <Button variant="primary" size="sm" onClick={() => onView?.(vacancy.id)}>
              {isApplied ? 'Ver postulación' : 'Postularme'}
            </Button>
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit?.(vacancy.id)}>
                Editar
              </Button>
            )}
            {onDelete && (
              <Button variant="danger" size="sm" onClick={() => onDelete?.(vacancy.id)}>
                Eliminar
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
