import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, ClipboardList, ShieldCheck, UserCheck, Users } from 'lucide-react';
import heroImage from '../assets/hero.png';
import '../styles/landing.css';

const highlights = [
  {
    icon: ClipboardList,
    title: 'Vacantes organizadas',
    text: 'Publica cargos, requisitos, salarios y estados desde un solo panel.',
  },
  {
    icon: Users,
    title: 'Candidatos visibles',
    text: 'Centraliza aplicaciones, hojas de vida y datos de contacto para revisar mejor.',
  },
  {
    icon: CheckCircle2,
    title: 'Evaluaciones guiadas',
    text: 'Acompana pruebas de conocimiento, psicotecnicas e induccion sin perder el rastro.',
  },
];

const roles = [
  {
    icon: ShieldCheck,
    name: 'Administrador',
    function: 'Control total del sistema',
  },
  {
    icon: Users,
    name: 'Reclutador',
    function: 'Gestion de vacantes y candidatos',
  },
  {
    icon: CheckCircle2,
    name: 'Evaluador',
    function: 'Aplicacion y revision de pruebas',
  },
  {
    icon: UserCheck,
    name: 'Aspirante',
    function: 'Registro y postulacion',
  },
];

const LandingPage = () => {
  return (
    <main className="landing-page">
      <section className="landing-hero">
        <header className="landing-nav">
          <div className="landing-brand">
            <span className="brand-mark">S</span>
            <span>SIGECON</span>
          </div>
          <nav className="landing-links" aria-label="Navegacion principal">
            <a href="#modulos">Modulos</a>
            <a href="#flujo">Flujo</a>        
            <Link to="/login" className="landing-login">Ingresar</Link>
          </nav>
        </header>

        <div className="hero-content">
          <div className="hero-copy">
            <p className="hero-kicker">Gestion de contratacion y seleccion</p>
            <h1>SIGECON</h1>
            <p className="hero-text">
              Una plataforma para administrar vacantes, candidatos, evaluaciones y hojas de vida
              con una experiencia clara para reclutadores y aspirantes.
            </p>
            <div className="hero-actions">
              <Link to="/login" className="hero-primary">
                Entrar al sistema
                <ArrowRight size={20} />
              </Link>
              <Link to="/register" className="hero-secondary">Crear cuenta</Link>
            </div>
          </div>

          <div className="hero-visual" aria-label="Vista previa del panel SIGECON">
            <div className="product-window">
              <div className="window-top">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="window-body">
                <aside className="preview-sidebar">
                  <strong>SIGECON</strong>
                  <span></span>
                  <span></span>
                  <span></span>
                </aside>
                <div className="preview-dashboard">
                  <div className="preview-header">
                    <div>
                      <small>Panel de control</small>
                      <strong>Contratacion activa</strong>
                    </div>
                    <img src={heroImage} alt="" />
                  </div>
                  <div className="preview-stats">
                    <span>3 vacantes</span>
                    <span>15 candidatos</span>
                    <span>8 evaluaciones</span>
                  </div>
                  <div className="preview-list">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="modulos" className="landing-section">
        <div className="section-heading">
          <p>Modulos principales</p>
          <h2>Todo el proceso en una sola ruta de trabajo</h2>
        </div>
        <div className="feature-grid">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <article className="feature-card" key={item.title}>
                <Icon size={28} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

    
      <section id="flujo" className="landing-flow">
        <div>
          <p className="section-label">Flujo del sistema</p>
          <h2>De la vacante al aspirante seleccionado</h2>
        </div>
        <ol className="flow-list">
          <li>El reclutador crea la vacante y define requisitos.</li>
          <li>El aspirante se registra, aplica y mantiene su hoja de vida actualizada.</li>
          <li>El evaluador revisa pruebas, puntajes y estados del proceso.</li>
        </ol>
        <Link to="/login" className="flow-link">
          Probar con credenciales demo
          <ArrowRight size={18} />
        </Link>
      </section>
    </main>
  );
};

export default LandingPage;
