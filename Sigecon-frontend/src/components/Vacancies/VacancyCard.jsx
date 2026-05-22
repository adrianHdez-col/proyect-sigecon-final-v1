import { MapPin, Clock, Users, DollarSign } from 'lucide-react';
import { Button } from '../Common/Button';
import '../Vacancies/VacancyCard.css';

export const VacancyCard = ({ vacancy, onView, onEdit, onDelete, showActions = true }) => {
  return (
    <div className="vacancy-card">
      <div className="vacancy-header">
        <h3>{vacancy.title}</h3>
        <span className={`vacancy-status status-${vacancy.status}`}>
          {vacancy.status === 'active' ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      <p className="vacancy-department">{vacancy.department}</p>

      <p className="vacancy-description">{vacancy.description}</p>

      <div className="vacancy-details">
        <div className="detail">
          <MapPin size={16} />
          <span>{vacancy.location}</span>
        </div>
        <div className="detail">
          <DollarSign size={16} />
          <span>{vacancy.salaryRange}</span>
        </div>
        <div className="detail">
          <Clock size={16} />
          <span>{vacancy.type}</span>
        </div>
        <div className="detail">
          <Users size={16} />
          <span>{vacancy.applicants} aplicantes</span>
        </div>
      </div>

      <div className="vacancy-skills">
        {vacancy.requirements?.map((req, idx) => (
          <span key={idx} className="skill-tag">{req}</span>
        ))}
      </div>

      {showActions && (
        <div className="vacancy-actions">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView?.(vacancy.id)}
          >
            Ver
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(vacancy.id)}
            >
              Editar
            </Button>
          )}
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete?.(vacancy.id)}
            >
              Eliminar
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
