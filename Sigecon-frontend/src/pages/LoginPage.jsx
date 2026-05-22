import { LoginForm } from '../components/Auth/LoginForm';
import '../styles/pages.css';

export const LoginPage = () => {
  return (
    <div className="login-page auth-page">
      <section className="auth-panel auth-panel-login">
        <div className="auth-copy">
          <span className="auth-badge">SIGECON PRO</span>
          <h2>Gestiona contratacion con una vista clara y ejecutiva.</h2>
          <p>
            Ingresa al panel para revisar vacantes, aplicaciones, hojas de vida
            y evaluaciones desde un solo entorno.
          </p>
          <div className="auth-metrics">
            <strong>15</strong>
            <span>aplicantes demo</span>
            <strong>4</strong>
            <span>roles disponibles</span>
          </div>
        </div>
        <LoginForm />
      </section>
    </div>
  );
};
