import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';
import '../Common/Alert.css';

export const Alert = ({ type = 'info', message, title, onClose, className = '' }) => {
  const icons = {
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
    error: XCircle,
  };

  const Icon = icons[type];

  return (
    <div className={`alert alert-${type} ${className}`}>
      <div className="alert-content">
        <Icon size={20} className="alert-icon" />
        <div className="alert-text">
          {title && <h4 className="alert-title">{title}</h4>}
          <p className="alert-message">{message}</p>
        </div>
      </div>
      {onClose && (
        <button className="alert-close" onClick={onClose}>
          ×
        </button>
      )}
    </div>
  );
};
