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
  { icon: UserCheck, title: 'Desarrollador Full Stack', company: 'Empresa Tech', tags: ['Remoto', 'Full-time'] },
  { icon: Target, title: 'Diseñador UI/UX', company: 'Creativa Studio', tags: ['Híbrido', 'Full-time'] },
  { icon: Briefcase, title: 'Analista de Datos', company: 'Data Smart', tags: ['Remoto', 'Full-time'] },
];

const candidates = [
  { name: 'María López', role: 'Diseñadora UI/UX' },
  { name: 'Javier Fernández', role: 'Ingeniero de Software' },
  { name: 'Camila Torres', role: 'Analista de Datos' },
  { name: 'Andrés Gómez', role: 'Product Manager' },
];

const benefits = [
  { icon: Users, title: 'Miles de candidatos', text: 'Encuentra el perfil que necesitas' },
  { icon: Target, title: 'Filtros avanzados', text: 'Ahorra tiempo y encuentra mejor' },
  { icon: ShieldCheck, title: 'Proceso seguro', text: 'Contrata con confianza' },
];

const stats = [
  { icon: Briefcase, value: '+10.000', label: 'Ofertas publicadas' },
  { icon: Users, value: '+50.000', label: 'Candidatos registrados' },
  { icon: Building2, value: '+5.000', label: 'Empresas confían en nosotros' },
  { icon: CheckCircle2, value: null, label: 'Contrataciones exitosas cada día' },
];

const LandingPage = () => {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <header className="landing-header" role="banner">
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
          
          </div>
        </header>

        <div className="hero-shell">
          <div className="hero-copy">
            <h1>
              Encuentra al <span>talento ideal</span> para tu empresa
            </h1>
            <p>
              Publica tus ofertas de trabajo y conecta con miles de profesionales listos para un nuevo desafío.
            </p>

            <Link to="/register" className="publish-cta" id="publicar">
              <span className="cta-icon">
                <Briefcase size={22} />
              </span>
              <span className="cta-text">
                <strong>Publicar empleo</strong>
                <small>Es rápido y sencillo</small>
              </span>
            </Link>

            <div className="benefit-row" id="empresas">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <article className="benefit-item" key={benefit.title}>
                    <span className="benefit-icon">
                      <Icon size={22} />
                    </span>
                    <div>
                      <h3>{benefit.title}</h3>
                      <p>{benefit.text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="hero-visual" id="buscar" aria-label="Vista previa">
            <div className="hero-shape" />
            <div className="dot-pattern" />

            <div className="people-scene">
              <img src={heroPeopleImage} alt="Profesionales trabajando juntos en una laptop" className="hero-people-image" />
            </div>
          </div>
        </div>

        <div className="stats-bar">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article key={stat.label}>
                <Icon size={34} strokeWidth={1.5} />
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
