import { RegisterForm } from '../components/Auth/RegisterForm';
import '../styles/pages.css';

export const RegisterPage = () => {
  return (
    <div className="login-page auth-page">
      <section className="auth-panel">
        <div className="auth-copy">
          <span className="auth-badge">SIGECON PRO</span>
          <h2>Centraliza el talento desde el primer contacto.</h2>
          <p>
            Crea cuentas para administradores, reclutadores, evaluadores o aspirantes
            y entra directamente al flujo que corresponde a cada rol.
          </p>
          <div className="auth-metrics">
            <strong>4</strong>
            <span>roles operativos</span>
            <strong>100%</strong>
            <span>flujo demo funcional</span>
          </div>
        </div>
        <RegisterForm />
      </section>
    </div>
  );
};
