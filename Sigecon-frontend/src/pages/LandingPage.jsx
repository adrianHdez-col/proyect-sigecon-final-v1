import { Link } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  CheckCircle2,
  Search,
  ShieldCheck,
  Star,
  Target,
  UserCheck,
  Users,
} from 'lucide-react';
import logoImage from '../assets/sigecon-logo.svg';
import heroPeopleImage from '../assets/43d36123-9298-40c0-b10a-ad16065cbe9f.png';
import '../styles/landing.css';

const featuredJobs = [
  { icon: UserCheck, title: 'Desarrollador Full Stack', company: 'Empresa Tech', type: 'Remoto' },
  { icon: Target, title: 'Diseñador UI/UX', company: 'Creativa Studio', type: 'Híbrido' },
  { icon: Briefcase, title: 'Analista de Datos', company: 'Data Smart', type: 'Remoto' },
];

const candidates = [
  { name: 'Maria Lopez', role: 'Diseñadora UI/UX' },
  { name: 'Javier Fernandez', role: 'Ingeniero de Software' },
  { name: 'Camila Torres', role: 'Analista de Datos' },
  { name: 'Andres Gomez', role: 'Product Manager' },
];

const benefits = [
  { icon: Users, title: 'Miles de candidatos', text: 'Encuentra el perfil que necesitas' },
  { icon: Target, title: 'Filtros avanzados', text: 'Ahorra tiempo y encuentra mejor' },
  { icon: ShieldCheck, title: 'Proceso seguro', text: 'Contrata con confianza' },
];

const stats = [
  { icon: Briefcase, value: '+10.000', label: 'Ofertas publicadas' },
  { icon: Users, value: '+50.000', label: 'Candidatos registrados' },
  { icon: Building2, value: '+5.000', label: 'Empresas confian en nosotros' },
  { icon: CheckCircle2, value: '', label: 'Contrataciones exitosas cada dia' },
];

const LandingPage = () => {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <header className="landing-header">
          <Link to="/" className="landing-brand" aria-label="SIGECON inicio">
            <img src={logoImage} alt="SIGECON" className="landing-logo" />
          </Link>

          <nav className="landing-nav" aria-label="Navegación principal">
            <a href="#buscar">Buscar empleos</a>
            <a href="#publicar">Publicar empleo</a>
            <a href="#empresas">Empresas</a>
            <a href="#candidatos">Candidatos</a>
          </nav>

          <div className="landing-actions">
            <Link to="/login" className="header-link">Iniciar sesión</Link>
            <Link to="/register" className="header-button">Crear cuenta</Link>
          </div>
        </header>

        <div className="hero-shell">
          <div className="hero-copy">
            <h1>
              Encuentra al <span>talento ideal</span> para tu empresa
            </h1>
            <p>
              Publica tus ofertas de trabajo y conecta con miles de profesionales listos para un nuevo desafio.
            </p>

            <Link to="/register" className="publish-cta" id="publicar">
              <span>
                <Briefcase size={28} />
              </span>
              <strong>
                Publicar empleo
                <small>Es rapido y sencillo</small>
              </strong>
            </Link>

            <div className="benefit-row" id="empresas">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article className="benefit-item" key={benefit.title}>
                    <div>
                      <Icon size={30} />
                    </div>
                    <h3>{benefit.title}</h3>
                    <p>{benefit.text}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="hero-visual" id="buscar" aria-label="Vista previa de busqueda de talento">
            <div className="teal-shape" />
            <div className="dot-pattern" />

            <div className="search-card">
              <Search size={18} />
              <span>Buscar empleos, empresas o palabras clave...</span>
              <Search size={18} />
            </div>

            <article className="jobs-card floating-card">
              <h2>Ofertas destacadas</h2>
              <div className="card-divider" />
              {featuredJobs.map((job) => {
                const Icon = job.icon;
                return (
                  <div className="job-row" key={job.title}>
                    <span className="job-icon">
                      <Icon size={20} />
                    </span>
                    <div>
                      <strong>{job.title}</strong>
                      <small>{job.company}</small>
                      <em>{job.type}</em>
                    </div>
                  </div>
                );
              })}
              <a href="#candidatos">Ver todas las ofertas</a>
            </article>

            <article className="profile-card floating-card">
              <div className="profile-photo">CM</div>
              <h2>Carlos Martinez</h2>
              <strong>Desarrollador Full Stack</strong>
              <p>5 años de experiencia</p>
              <span>React · Node.js · SQL · MongoDB</span>
              <Link to="/login">Ver perfil</Link>
            </article>

            <article className="candidates-card floating-card" id="candidatos">
              <h2>Candidatos recomendados</h2>
              <div className="card-divider" />
              {candidates.map((candidate) => (
                <div className="candidate-row" key={candidate.name}>
                  <span>{candidate.name.split(' ').map((part) => part[0]).join('')}</span>
                  <div>
                    <strong>{candidate.name}</strong>
                    <small>{candidate.role}</small>
                  </div>
                  <Star size={15} fill="currentColor" />
                </div>
              ))}
              <a href="#candidatos">Ver todos los candidatos</a>
            </article>

            <div className="people-scene" aria-hidden="true">
              <img src={heroPeopleImage} alt="" className="hero-people-image" />
            </div>
          </div>
        </div>

        <div className="stats-bar">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label}>
                <Icon size={36} />
                <div>
                  {stat.value && <strong>{stat.value}</strong>}
                  <span>{stat.label}</span>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default LandingPage;
