import { Briefcase, Users, CheckSquare, TrendingUp } from 'lucide-react';
import '../Dashboard/StatCard.css';

export const StatCard = ({ icon: Icon, label, value, color = 'primary' }) => {
  return (
    <div className={`stat-card stat-card-${color}`}>
      <div className="stat-icon">
        <Icon size={32} />
      </div>
      <div className="stat-content">
        <p className="stat-label">{label}</p>
        <h3 className="stat-value">{value}</h3>
      </div>
    </div>
  );
};

export const DashboardStats = ({ stats }) => {
  return (
    <div className="stats-grid">
      <StatCard
        icon={Briefcase}
        label="Vacantes Activas"
        value={stats?.activeVacancies || 0}
        color="primary"
      />
      <StatCard
        icon={Users}
        label="Aplicaciones"
        value={stats?.totalApplications || 0}
        color="secondary"
      />
      <StatCard
        icon={CheckSquare}
        label="Evaluaciones Pendientes"
        value={stats?.pendingEvaluations || 0}
        color="warning"
      />
      <StatCard
        icon={TrendingUp}
        label="Aspirantes Contratados"
        value={stats?.hired || 0}
        color="success"
      />
    </div>
  );
};
