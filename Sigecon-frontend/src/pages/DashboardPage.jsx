import { Link } from 'react-router-dom';
import { Award, Briefcase, CheckCircle2, ClipboardCheck, Settings, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DashboardStats } from '../components/Dashboard/StatCard';
import { Card, CardBody, CardHeader } from '../components/Common/Card';
import { VacancyCard } from '../components/Vacancies/VacancyCard';
import { mockVacancies, mockApplications, statusLabels } from '../utils/mockData';
import '../styles/pages.css';

const roleDashboards = {
  admin: {
    eyebrow: 'Control total del sistema',
    title: 'Centro de mando administrativo',
    description:
      'Supervisa usuarios, vacantes, aplicaciones y configuracion general desde una vista consolidada.',
    actions: [
      { icon: Users, label: 'Gestionar usuarios', path: '/admin/users' },
      { icon: Briefcase, label: 'Auditar vacantes', path: '/admin/vacancies' },
      { icon: Settings, label: 'Configuracion', path: '/admin/settings' },
    ],
  },
  recruiter: {
    eyebrow: 'Gestion de vacantes y candidatos',
    title: 'Operacion de reclutamiento',
    description:
      'Publica vacantes, revisa candidatos y prioriza postulaciones con trazabilidad del proceso.',
    actions: [
      { icon: Briefcase, label: 'Vacantes activas', path: '/recruiter/vacancies' },
      { icon: Users, label: 'Candidatos', path: '/recruiter/applicants' },
      { icon: CheckCircle2, label: 'Seguimiento', path: '/recruiter/applicants' },
    ],
  },
  evaluator: {
    eyebrow: 'Aplicacion y revision de pruebas',
    title: 'Mesa de evaluacion',
    description:
      'Consulta pruebas pendientes, revisa resultados y acompana decisiones tecnicas o psicometricas.',
    actions: [
      { icon: ClipboardCheck, label: 'Pruebas asignadas', path: '/evaluator/tests' },
      { icon: Award, label: 'Resultados', path: '/evaluator/applications' },
      { icon: Users, label: 'Aspirantes', path: '/evaluator/applications' },
    ],
  },
  aspirant: {
    eyebrow: 'Registro y postulacion',
    title: 'Portal del aspirante',
    description:
      'Explora oportunidades, mantiene tu hoja de vida actualizada y completa las pruebas asignadas.',
    actions: [
      { icon: Briefcase, label: 'Explorar vacantes', path: '/aspirant/vacancies' },
      { icon: ShieldCheck, label: 'Hoja de vida', path: '/aspirant/resume' },
      { icon: ClipboardCheck, label: 'Mis pruebas', path: '/aspirant/my-evaluations' },
    ],
  },
};

const getDashboardConfig = (role) => roleDashboards[role] || roleDashboards.aspirant;

export const DashboardPage = () => {
  const { user } = useAuth();
  const config = getDashboardConfig(user?.role);
  const stats = {
    activeVacancies: mockVacancies.length,
    totalApplications: mockApplications.length,
    pendingEvaluations: mockApplications.filter(a => !a.score).length,
    hired: 3,
  };

  return (
    <div className="page-container">
      <section className="role-hero">
        <div>
          <span className="page-eyebrow">{config.eyebrow}</span>
          <h1>{config.title}</h1>
          <p>{config.description}</p>
        </div>
        <div className="role-user-card">
          <span>Sesion activa</span>
          <strong>{user?.name}</strong>
          <small>{user?.profile}</small>
        </div>
      </section>

      <DashboardStats stats={stats} />

      <div className="quick-actions">
        {config.actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link to={action.path} className="quick-action" key={action.label}>
              <span className="quick-action-icon">
                <Icon size={18} />
              </span>
              <span>{action.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <Card>
          <CardHeader>
            <h2>Vacantes prioritarias</h2>
          </CardHeader>
          <CardBody>
            <div className="vacancies-grid">
              {mockVacancies.slice(0, 3).map(vacancy => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  onView={(id) => console.log('View vacancy', id)}
                  showActions={false}
                />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2>Pipeline reciente</h2>
          </CardHeader>
          <CardBody>
            <div className="pipeline-list">
              {mockApplications.map((application) => (
                <div className="pipeline-item" key={application.id}>
                  <div>
                    <strong>{application.candidateName}</strong>
                    <span>{statusLabels[application.status]}</span>
                  </div>
                  <small className={`status-pill ${application.score ? 'status-pill-success' : 'status-pill-warning'}`}>
                    {application.score ? `${application.score}%` : 'Pendiente'}
                  </small>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};
