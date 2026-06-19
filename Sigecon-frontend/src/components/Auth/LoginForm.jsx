import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Eye, Linkedin, LockKeyhole, Mail, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Alert } from '../Common/Alert';
import logoImage from '../../assets/log.png';
import '../Auth/LoginForm.css';

const roleHome = {
  admin: '/dashboard',
  recruiter: '/dashboard',
  evaluator: '/evaluator/dashboard',
  aspirant: '/aspirant/dashboard',
};

const loginBenefits = [
  {
    icon: ShieldCheck,
    title: 'Seguro y confiable',
    text: 'Protegemos tu informacion y tus datos.',
  },
  {
    icon: Users,
    title: 'Miles de oportunidades',
    text: 'Encuentra el trabajo ideal para ti.',
  },
  {
    icon: Briefcase,
    title: 'Facil y rapido',
    text: 'Publica empleos y gestiona candidatos en minutos.',
  },
];

const demoUsers = [
  { label: 'Super Admin', email: 'superadmin@empresa.com' },
  { label: 'RRHH', email: 'rrhh@empresa.com' },
  { label: 'Evaluador', email: 'psicologo@empresa.com' },
  { label: 'Aspirante', email: 'juan.perez@example.com' },
];

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate(roleHome[result.user?.role] || '/dashboard');
      } else {
        setError(result.error || 'Error en el login');
      }
    } catch {
      setError('Error en el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail) => {
    setError('');
    setLoading(true);

    try {
      const result = await login(demoEmail, '12345678');
      if (result.success) {
        navigate(roleHome[result.user?.role] || '/dashboard');
      } else {
        setError(result.error || 'Error en el login');
      }
    } catch {
      setError('Error en el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-showcase">
      <aside className="login-visual" aria-hidden="true">
        <div className="visual-wash" />
        <div className="visual-laptop">
          <img src={logoImage} alt="" />
        </div>
        <div className="visual-plant" />
        <span className="hexagon hexagon-top" />
        <span className="hexagon hexagon-mid" />
        <span className="hexagon hexagon-bottom" />
        <span className="visual-dots" />
      </aside>

      <div className="login-content">
        <form onSubmit={handleSubmit} className="login-form login-form-modern">
          <div className="modern-form-header">
            <span className="login-brand-frame">
              <img src={logoImage} alt="SIGECON" />
            </span>
            <h1>Inicia sesión</h1>
            <p>Bienvenido de nuevo. Ingresa tus datos para continuar.</p>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          )}

          <label className="modern-field">
            <span>Correo electrónico</span>
            <div className="modern-input">
              <Mail size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                required
              />
            </div>
          </label>

          <label className="modern-field">
            <span>Contraseña</span>
            <div className="modern-input">
              <LockKeyhole size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <Eye size={20} />
            </div>
          </label>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span>Recordarme</span>
            </label>
            <a href="#recuperar">¿Olvidaste tu contraseña?</a>
          </div>

          <button type="submit" className="modern-submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>

         
          <div className="social-buttons">
            <button type="button">
              <span className="google-mark">G</span>
              Google
            </button>
            <button type="button">
              <Linkedin size={20} />
              LinkedIn
            </button>
          </div>

          <div className="quick-login">
            <p>Entrar como:</p>
            <div className="quick-login-buttons">
              {demoUsers.map((demoUser) => (
                <button
                  key={demoUser.email}
                  type="button"
                  onClick={() => handleQuickLogin(demoUser.email)}
                  disabled={loading}
                >
                  {demoUser.label}
                </button>
              ))}
            </div>
          </div>

          <p className="auth-switch modern-switch">
            ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
          </p>
        </form>

        <div className="login-benefits">
          {loginBenefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <article key={benefit.title}>
                <Icon size={32} />
                <div>
                  <h2>{benefit.title}</h2>
                  <p>{benefit.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
