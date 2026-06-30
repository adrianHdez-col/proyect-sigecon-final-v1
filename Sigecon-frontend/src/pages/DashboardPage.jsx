import { Link, useLocation } from 'react-router-dom';
import {
  Activity,
  Award,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  KeyRound,
  Mail,
  Phone,
  Save,
  Settings,
  ShieldCheck,
  TrendingUp,
  UserCog,
  Users,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { DashboardStats } from '../components/Dashboard/StatCard';
import { Card, CardBody, CardHeader } from '../components/Common/Card';
import { VacancyCard } from '../components/Vacancies/VacancyCard';
import {
  mockVacancies,
  mockApplications,
  mockCandidateResume,
  statusLabels,
} from '../utils/mockData';
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

const adminUsers = [
  {
    name: 'Laura Mendoza',
    email: 'laura.mendoza@sigecon.com',
    role: 'Reclutador',
    area: 'Talento humano',
    status: 'Activo',
    lastAccess: 'Hoy, 9:42 a.m.',
  },
  {
    name: 'Camilo Rojas',
    email: 'camilo.rojas@sigecon.com',
    role: 'Reclutador',
    area: 'Seleccion',
    status: 'Activo',
    lastAccess: 'Ayer, 4:18 p.m.',
  },
  {
    name: 'Diana Torres',
    email: 'diana.torres@sigecon.com',
    role: 'Evaluador',
    area: 'Pruebas tecnicas',
    status: 'Pendiente',
    lastAccess: 'Invitacion enviada',
  },
  {
    name: 'Andres Pena',
    email: 'andres.pena@sigecon.com',
    role: 'Aspirante',
    area: 'Portal externo',
    status: 'Activo',
    lastAccess: '13 Jun, 2:07 p.m.',
  },
];

const monthlyApplications = [
  { month: 'Ene', total: 18 },
  { month: 'Feb', total: 26 },
  { month: 'Mar', total: 21 },
  { month: 'Abr', total: 34 },
  { month: 'May', total: 29 },
  { month: 'Jun', total: 42 },
];

const funnelStages = [
  { label: 'Postulados', value: 86, tone: 'primary' },
  { label: 'En revision', value: 62, tone: 'info' },
  { label: 'Evaluados', value: 38, tone: 'warning' },
  { label: 'Finalistas', value: 18, tone: 'success' },
];

const roleDistribution = [
  { label: 'Aspirantes', value: 68, color: '#5aaea6' },
  { label: 'Reclutadores', value: 16, color: '#3758a8' },
  { label: 'Evaluadores', value: 10, color: '#f1b77b' },
  { label: 'Admin', value: 6, color: '#d15c57' },
];

const adminAlerts = [
  '3 evaluaciones esperan asignacion de evaluador',
  '2 vacantes llegan a fecha limite esta semana',
  '1 invitacion de usuario sigue pendiente',
];

const getNameParts = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean);
  return {
    firstName: parts[0] || 'Administrador',
    lastName: parts.slice(1).join(' ') || 'SIGECON',
  };
};

const AdminSettingsPanel = ({ user, showRegisteredUsers = false }) => {
  const { firstName, lastName } = getNameParts(user?.name);

  return (
  <div className="admin-workspace">
    <section className="admin-section-header">
      <div>
        <span className="page-eyebrow">Configuracion de cuenta</span>
        <h2>{showRegisteredUsers ? 'Datos personales y usuarios' : 'Datos personales'}</h2>
        <p>
          Actualiza tus datos de contacto, cambia tu contrasena y asigna el rol correcto
          a cada usuario registrado.
        </p>
      </div>
      <button className="admin-primary-action" type="button">
        <Save size={18} />
        Guardar cambios
      </button>
    </section>

    <div className="account-settings-grid">
      <Card className="admin-card">
        <CardHeader>
          <h2>Actualizar datos</h2>
        </CardHeader>
        <CardBody>
          <form className="settings-form">
            <label>
              <span>Nombre</span>
              <input type="text" value={firstName} readOnly />
            </label>
            <label>
              <span>Apellidos</span>
              <input type="text" value={lastName} readOnly />
            </label>
            <label>
              <span>Correo electronico</span>
              <div className="input-with-icon">
                <Mail size={18} />
                <input type="email" defaultValue={user?.email || 'admin@sigecon.com'} />
              </div>
            </label>
            <label>
              <span>Telefono</span>
              <div className="input-with-icon">
                <Phone size={18} />
                <input type="tel" placeholder="300 000 0000" />
              </div>
            </label>
          </form>
        </CardBody>
      </Card>

      <Card className="admin-card">
        <CardHeader>
          <h2>Cambiar contrasena</h2>
        </CardHeader>
        <CardBody>
          <form className="settings-form settings-form-single">
            <label>
              <span>Contrasena actual</span>
              <input type="password" placeholder="Ingresa tu contrasena actual" />
            </label>
            <label>
              <span>Nueva contrasena</span>
              <input type="password" placeholder="Minimo 8 caracteres" />
            </label>
            <label>
              <span>Confirmar contrasena</span>
              <input type="password" placeholder="Repite la nueva contrasena" />
            </label>
          </form>
        </CardBody>
      </Card>
    </div>

    {showRegisteredUsers && (
      <Card className="admin-card">
        <CardHeader>
          <h2>Usuarios registrados</h2>
        </CardHeader>
        <CardBody>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Ultimo acceso</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.map((adminUser) => (
                  <tr key={adminUser.email}>
                    <td>
                      <div className="user-cell">
                        <span>{adminUser.name.charAt(0)}</span>
                        <div>
                          <strong>{adminUser.name}</strong>
                          <small>{adminUser.area}</small>
                        </div>
                      </div>
                    </td>
                    <td>{adminUser.email}</td>
                    <td>
                      <select defaultValue={adminUser.role} aria-label={`Rol de ${adminUser.name}`}>
                        <option>Reclutador</option>
                        <option>Evaluador</option>
                        <option>Aspirante</option>
                      </select>
                    </td>
                    <td>
                      <span className={`admin-status ${adminUser.status === 'Activo' ? 'active' : 'pending'}`}>
                        {adminUser.status}
                      </span>
                    </td>
                    <td>{adminUser.lastAccess}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    )}
  </div>
  );
};

const AdminUsersPanel = () => (
  <div className="admin-workspace">
    <section className="admin-section-header">
      <div>
        <span className="page-eyebrow">Gestion de usuarios</span>
        <h2>Control de cuentas y perfiles</h2>
        <p>
          Administra usuarios internos, cambia roles y revisa actividad reciente desde una
          vista mas operativa.
        </p>
      </div>
      <button className="admin-primary-action" type="button">
        <UserCog size={18} />
        Nuevo usuario
      </button>
    </section>

    <div className="admin-metrics">
      <div>
        <span>Usuarios activos</span>
        <strong>49</strong>
      </div>
      <div>
        <span>Roles configurados</span>
        <strong>4</strong>
      </div>
      <div>
        <span>Invitaciones pendientes</span>
        <strong>3</strong>
      </div>
    </div>

    <Card className="admin-card">
      <CardHeader>
        <h2>Usuarios del sistema</h2>
      </CardHeader>
      <CardBody>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Rol</th>
                <th>Area</th>
                <th>Estado</th>
                <th>Ultimo acceso</th>
                <th>Permisos</th>
              </tr>
            </thead>
            <tbody>
              {adminUsers.map((adminUser) => (
                <tr key={adminUser.email}>
                  <td>
                    <div className="user-cell">
                      <span>{adminUser.name.charAt(0)}</span>
                      <div>
                        <strong>{adminUser.name}</strong>
                        <small>{adminUser.email}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select defaultValue={adminUser.role} aria-label={`Rol de ${adminUser.name}`}>
                      <option>Administrador</option>
                      <option>Reclutador</option>
                      <option>Evaluador</option>
                      <option>Aspirante</option>
                    </select>
                  </td>
                  <td>{adminUser.area}</td>
                  <td>
                    <span className={`admin-status ${adminUser.status === 'Activo' ? 'active' : 'pending'}`}>
                      {adminUser.status}
                    </span>
                  </td>
                  <td>{adminUser.lastAccess}</td>
                  <td>
                    <button className="icon-action" type="button" title="Editar permisos">
                      <KeyRound size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  </div>
);

const AdminOverviewPanel = ({ config, stats }) => (
  <>
    <DashboardStats stats={stats} />

    <div className="admin-command-grid">
      {config.actions.map((action) => {
        const Icon = action.icon;
        return (
          <Link to={action.path} className="admin-command" key={action.label}>
            <span className="quick-action-icon">
              <Icon size={20} />
            </span>
            <span>{action.label}</span>
            <small>Administrar</small>
          </Link>
        );
      })}
    </div>

    <section className="admin-analytics-grid">
      <Card className="admin-card analytics-card analytics-card-wide">
        <CardHeader className="analytics-card-header">
          <div>
            <span className="page-eyebrow">Rendimiento mensual</span>
            <h2>Postulaciones recibidas</h2>
          </div>
          <span className="analytics-badge">
            <TrendingUp size={16} />
            +24%
          </span>
        </CardHeader>
        <CardBody>
          <div className="bar-chart" aria-label="Grafica de postulaciones mensuales">
            {monthlyApplications.map((item) => (
              <div className="bar-chart-item" key={item.month}>
                <span>{item.total}</span>
                <div
                  className="bar-chart-bar"
                  style={{ '--bar-height': `${(item.total / 42) * 100}%` }}
                />
                <small>{item.month}</small>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="admin-card analytics-card">
        <CardHeader className="analytics-card-header">
          <div>
            <span className="page-eyebrow">Usuarios</span>
            <h2>Distribucion por rol</h2>
          </div>
          <BarChart3 size={20} />
        </CardHeader>
        <CardBody>
          <div className="role-donut-wrap">
            <div className="role-donut" aria-label="Grafica circular de roles">
              <strong>49</strong>
              <span>usuarios</span>
            </div>
            <div className="donut-legend">
              {roleDistribution.map((item) => (
                <div className="donut-legend-item" key={item.label}>
                  <span style={{ backgroundColor: item.color }} />
                  <p>{item.label}</p>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>
    </section>

    <section className="admin-operations-grid">
      <Card className="admin-card">
        <CardHeader>
          <h2>Embudo de seleccion</h2>
        </CardHeader>
        <CardBody>
          <div className="funnel-list">
            {funnelStages.map((stage) => (
              <div className="funnel-row" key={stage.label}>
                <div>
                  <strong>{stage.label}</strong>
                  <span>{stage.value} procesos</span>
                </div>
                <div className="funnel-track">
                  <span
                    className={`funnel-fill funnel-fill-${stage.tone}`}
                    style={{ width: `${stage.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card className="admin-card">
        <CardHeader>
          <h2>Alertas ejecutivas</h2>
        </CardHeader>
        <CardBody>
          <div className="admin-alert-list">
            {adminAlerts.map((alert) => (
              <div className="admin-alert-item" key={alert}>
                <span>
                  <Bell size={16} />
                </span>
                <p>{alert}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </section>

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
  </>
);

const RecruiterDashboard = () => {
  const recentCandidates = mockApplications.slice(0, 3);
  const interviews = [
    { name: 'María López', stage: 'Entrevista técnica', date: 'Hoy, 10:00 a.m.' },
    { name: 'Ana Martínez', stage: 'Entrevista HR', date: 'Mañana, 2:00 p.m.' },
    { name: 'Carlos González', stage: 'Entrevista final', date: 'Viernes, 11:00 a.m.' },
  ];

  return (
    <>
      <DashboardStats
        stats={{
          activeVacancies: mockVacancies.length,
          totalApplications: mockApplications.length,
          pendingEvaluations: mockApplications.filter((a) => !a.score).length,
          hired: 1,
        }}
      />

      <div className="admin-command-grid">
        {[
          { icon: Users, label: 'Candidatos recientes', path: '/recruiter/applicants' },
          { icon: Briefcase, label: 'Entrevistas', path: '/recruiter/applicants' },
          { icon: ClipboardCheck, label: 'Postulaciones', path: '/recruiter/applicants' },
          { icon: Settings, label: 'Mensajes', path: '/recruiter/applicants' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link to={action.path} className="admin-command" key={action.label}>
              <span className="quick-action-icon">
                <Icon size={20} />
              </span>
              <span>{action.label}</span>
              <small>Ver detalles</small>
            </Link>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <Card>
          <CardHeader>
            <h2>Candidatos recientes</h2>
          </CardHeader>
          <CardBody>
            <div className="pipeline-list">
              {recentCandidates.map((candidate) => (
                <div className="pipeline-item" key={candidate.id}>
                  <div>
                    <strong>{candidate.candidateName}</strong>
                    <span>{statusLabels[candidate.status]}</span>
                  </div>
                  <small>{candidate.appliedDate}</small>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2>Entrevistas programadas</h2>
          </CardHeader>
          <CardBody>
            <div className="admin-alert-list">
              {interviews.map((item) => (
                <div className="admin-alert-item" key={item.name}>
                  <span>
                    <Activity size={16} />
                  </span>
                  <p>
                    <strong>{item.name}</strong> — {item.stage} <br />
                    <small>{item.date}</small>
                  </p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <section className="admin-operations-grid">
        <Card>
          <CardHeader>
            <h2>Postulaciones</h2>
          </CardHeader>
          <CardBody>
            <div className="funnel-list">
              {funnelStages.map((stage) => (
                <div className="funnel-row" key={stage.label}>
                  <div>
                    <strong>{stage.label}</strong>
                    <span>{stage.value} candidaturas</span>
                  </div>
                  <div className="funnel-track">
                    <span
                      className={`funnel-fill funnel-fill-${stage.tone}`}
                      style={{ width: `${stage.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2>Estados</h2>
          </CardHeader>
          <CardBody>
            <div className="pipeline-list">
              {Object.entries(statusLabels).slice(0, 4).map(([key, label]) => (
                <div className="pipeline-item" key={key}>
                  <div>
                    <strong>{label}</strong>
                    <span>Estado del proceso</span>
                  </div>
                  <small>{Math.floor(Math.random() * 30) + 8} items</small>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>

      <div className="dashboard-grid">
        <Card>
          <CardHeader>
            <h2>Vacantes activas</h2>
          </CardHeader>
          <CardBody>
            <div className="vacancies-grid">
              {mockVacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  onView={() => console.log('View vacancy', vacancy.id)}
                  showActions={false}
                />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2>Mensajes recientes</h2>
          </CardHeader>
          <CardBody>
            <div className="admin-alert-list">
              {[
                'María ha enviado un documento adicional.',
                'Carlos solicita una entrevista para el viernes.',
                'Ana ha actualizado su perfil profesional.',
              ].map((message) => (
                <div className="admin-alert-item" key={message}>
                  <span>
                    <Mail size={16} />
                  </span>
                  <p>{message}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

const AspirantDashboard = () => {
  const recommendedVacancies = mockVacancies;

  return (
    <>
      <div className="module-summary" style={{ marginBottom: '2rem' }}>
        <div>
          <strong>{recommendedVacancies.length}</strong>
          <span>Ofertas recomendadas</span>
        </div>
        <div>
          <strong>{mockApplications.length}</strong>
          <span>Mis postulaciones</span>
        </div>
        <div>
          <strong>92%</strong>
          <span>Perfil completo</span>
        </div>
      </div>

      <div className="admin-command-grid">
        {[
          { icon: Briefcase, label: 'Mi perfil', path: '/aspirant/resume' },
          { icon: ShieldCheck, label: 'Hoja de vida', path: '/aspirant/resume' },
          { icon: Users, label: 'Empresas destacadas', path: '/aspirant/vacancies' },
          { icon: Mail, label: 'Mensajes', path: '/aspirant/vacancies' },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link to={action.path} className="admin-command" key={action.label}>
              <span className="quick-action-icon">
                <Icon size={20} />
              </span>
              <span>{action.label}</span>
              <small>Acceder</small>
            </Link>
          );
        })}
      </div>

      <div className="dashboard-grid">
        <Card>
          <CardHeader>
            <h2>Ofertas recomendadas</h2>
          </CardHeader>
          <CardBody>
            <div className="vacancies-grid">
              {recommendedVacancies.map((vacancy) => (
                <VacancyCard
                  key={vacancy.id}
                  vacancy={vacancy}
                  onView={() => console.log('Ver oferta', vacancy.id)}
                  showActions={false}
                />
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2>Mi perfil y CV</h2>
          </CardHeader>
          <CardBody>
            <div className="resume-summary">
              <div className="profile-summary">
                <strong>{mockCandidateResume.fullName}</strong>
                <span>{mockCandidateResume.title}</span>
                <p className="section-text">{mockCandidateResume.professionalSummary}</p>
              </div>
              <div className="profile-meta-row">
                <span>Email: {mockCandidateResume.email}</span>
                <span>Telefono: {mockCandidateResume.phone}</span>
                <span>Ubicación: {mockCandidateResume.location}</span>
              </div>
              <div className="resume-skill-tags">
                {mockCandidateResume.skills.slice(0, 4).map((skill) => (
                  <span key={skill.id} className="skill-chip">{skill.name}</span>
                ))}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <section className="admin-operations-grid">
        <Card>
          <CardHeader>
            <h2>Mis postulaciones</h2>
          </CardHeader>
          <CardBody>
            <div className="pipeline-list">
              {mockApplications.map((application) => (
                <div className="pipeline-item" key={application.id}>
                  <div>
                    <strong>{application.candidateName}</strong>
                    <span>{statusLabels[application.status]}</span>
                  </div>
                  <small>{application.appliedDate}</small>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2>Empresas destacadas</h2>
          </CardHeader>
          <CardBody>
            <div className="featured-company-list">
              {['Data Smart', 'Creativa Studio', 'Empresa Tech'].map((company) => (
                <div className="featured-company-item" key={company}>
                  <div>
                    <strong>{company}</strong>
                    <span>Empresa con oportunidades activas</span>
                  </div>
                  <small>5 vacantes</small>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </>
  );
};

export const DashboardPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const config = getDashboardConfig(user?.role);
  const isAdmin = user?.role === 'admin';
  const isRecruiter = user?.role === 'recruiter';
  const isAspirant = ['aspirant', 'candidate'].includes(user?.role);
  const isAdminUsers = isAdmin && location.pathname === '/admin/users';
  const isSettings = [
    '/admin/settings',
    '/recruiter/settings',
    '/evaluator/settings',
    '/aspirant/settings',
    '/candidate/settings',
  ].includes(location.pathname);
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
          {isAdmin && (
            <div className="admin-health">
              <Activity size={16} />
              Sistema operativo
            </div>
          )}
        </div>
      </section>

      {isSettings && <AdminSettingsPanel user={user} showRegisteredUsers={isAdmin} />}
      {isAdminUsers && <AdminUsersPanel />}
      {!isSettings && !isAdminUsers && (
        <>
          {isAdmin && <AdminOverviewPanel config={config} stats={stats} />}
          {isRecruiter && <RecruiterDashboard />}
          {isAspirant && <AspirantDashboard />}
          {!isAdmin && !isRecruiter && !isAspirant && <AdminOverviewPanel config={config} stats={stats} />}
        </>
      )}
    </div>
  );
};
