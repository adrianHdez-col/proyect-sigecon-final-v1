import { MessageCircle, Calendar, User, FileText } from 'lucide-react';
import { Button } from '../Common/Button';
import { getStatusColor, statusLabels } from '../../utils/mockData';
import '../Applications/ApplicationCard.css';

export const ApplicationCard = ({ application, vacancy, onView, onEvaluate }) => {
  return (
    <div className="application-card">
      <div className="app-header">
        <div className="app-info">
          <h3>{application.candidateName}</h3>
          <div className="app-meta">
            <span className="meta-item">
              <User size={16} />
              {vacancy?.title}
            </span>
            <span className="meta-item">
              <Calendar size={16} />
              {new Date(application.appliedDate).toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>
        <span
          className="app-status"
          style={{ backgroundColor: getStatusColor(application.status) }}
        >
          {statusLabels[application.status]}
        </span>
      </div>

      <div className="app-contact">
        <a href={`mailto:${application.email}`}>
          <FileText size={16} />
          {application.email}
        </a>
        <a href={`tel:${application.phone}`}>
          <MessageCircle size={16} />
          {application.phone}
        </a>
      </div>

      {application.score > 0 && (
        <div className="app-score">
          <span>Puntuación: <strong>{application.score}%</strong></span>
        </div>
      )}

      <div className="app-actions">
        <Button
          variant="primary"
          size="sm"
          onClick={() => onView?.(application.id)}
        >
          Ver Detalles
        </Button>
        {onEvaluate && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEvaluate?.(application.id)}
          >
            Evaluar
          </Button>
        )}
      </div>
    </div>
  );
};
