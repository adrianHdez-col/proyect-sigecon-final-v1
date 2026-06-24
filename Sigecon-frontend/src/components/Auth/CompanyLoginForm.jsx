import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Briefcase,
  Users,
  ArrowLeft,
} from 'lucide-react';
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

const companyBenefits = [
  {
    icon: ShieldCheck,
    title: 'Seguro y confiable',
    text: 'Protegemos la información de tu empresa y tus procesos de selección.',
  },
  {
    icon: Users,
    title: 'Acceso a talento',
    text: 'Conecta con miles de profesionales calificados.',
  },
  {
    icon: Briefcase,
    title: 'Gestión eficiente',
    text: 'Publica vacantes y gestiona candidatos en minutos.',
  },
];

const demoUsers = [
  { label: 'Super Admin', email: 'superadmin@empresa.com' },
  { label: 'RRHH', email: 'rrhh@empresa.com' },
  { label: 'Evaluador', email: 'psicologo@empresa.com' },
];

export const CompanyLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <section className="login-showcase company-login-showcase">
      <aside className="login-visual company-login-visual" aria-hidden="true">
        <div className="visual-wash company-visual-wash" />
        <div className="visual-laptop">
          <img src={logoImage} alt="" />
        </div>
        <div className="visual-plant" />
        <span className="hexagon hexagon-top" />
        <span className="hexagon hexagon-mid" />
        <span className="hexagon hexagon-bottom" />
        <span className="visual-dots" />
      </aside>

      <div className="login-content company-login-content">
        <form onSubmit={handleSubmit} className="login-form login-form-modern company-login-form">
          <div className="modern-form-header company-form-header">
            <span className="login-brand-frame company-brand-frame">
              <img src={logoImage} alt="SIGECON" />
            </span>
            <div className="company-badge">
              <Building2 size={16} />
              <span>Portal Empresas</span>
            </div>
            <h1>Acceso para Empresas</h1>
            <p>Gestiona tus vacantes y encuentra el talento ideal para tu equipo.</p>
          </div>

          {error && (
            <Alert
              type="error"
              message={error}
              onClose={() => setError('')}
            />
          )}

          <label className="modern-field">
            <span>Correo electrónico corporativo</span>
            <div className="modern-input">
              <Mail size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="empresa@correo.com"
                required
              />
            </div>
          </label>

          <label className="modern-field">
            <span>Contraseña</span>
            <div className="modern-input">
              <LockKeyhole size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
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

          <button type="submit" className="modern-submit company-submit" disabled={loading}>
            {loading ? 'Ingresando...' : 'Acceder como Empresa'}
          </button>

          <div className="company-divider">
            <span>o</span>
          </div>

          <div className="quick-login company-quick-login">
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

          <div className="company-links">
            <Link to="/login" className="back-to-login">
              <ArrowLeft size={16} />
              Soy candidato / Ingreso estándar
            </Link>
            <p className="auth-switch modern-switch">
              ¿Tu empresa no está registrada?{' '}
              <Link to="/register">Regístrate aquí</Link>
            </p>
          </div>
        </form>

        <div className="login-benefits company-login-benefits">
          {companyBenefits.map((benefit) => {
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