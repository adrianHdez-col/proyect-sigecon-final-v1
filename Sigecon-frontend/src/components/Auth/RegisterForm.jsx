import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, LockKeyhole, Mail, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Alert } from '../Common/Alert';
import logoImage from '../../assets/sigecon-logo.svg';
import './LoginForm.css';

const roleHome = {
  admin: '/dashboard',
  recruiter: '/dashboard',
  evaluator: '/evaluator/dashboard',
  aspirant: '/aspirant/dashboard',
};

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.firstName.trim()) nextErrors.firstName = 'Ingresa tu nombre';
    if (!formData.lastName.trim()) nextErrors.lastName = 'Ingresa tus apellidos';
    if (!formData.email.trim()) nextErrors.email = 'Ingresa tu correo electronico';
    if (formData.password.length < 8) nextErrors.password = 'Usa minimo 8 caracteres';
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contrasenas no coinciden';
    }
    if (!formData.terms) nextErrors.terms = 'Debes aceptar los terminos';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = register({
      fullName: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      company: 'SIGECON',
      role: 'aspirant',
      password: formData.password,
    });
    setLoading(false);

    if (result.success) {
      navigate(roleHome.aspirant);
    }
  };

  return (
    <section className="register-showcase">
      <form onSubmit={handleSubmit} className="register-card">
        <div className="modern-form-header register-header">
          <img src={logoImage} alt="SIGECON" />
          <h1>Crea tu cuenta</h1>
          <p>Únete y comienza a conectar con el mejor talento.</p>
        </div>

        {(errors.firstName || errors.lastName || errors.email || errors.password || errors.confirmPassword || errors.terms) && (
          <Alert
            type="error"
            message="Revisa los campos marcados para continuar."
          />
        )}

        <div className="register-grid">
          <label className="modern-field">
            <span>Nombre</span>
            <div className={`modern-input ${errors.firstName ? 'modern-input-error' : ''}`}>
              <User size={20} />
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>
          </label>

          <label className="modern-field">
            <span>Apellidos</span>
            <div className={`modern-input ${errors.lastName ? 'modern-input-error' : ''}`}>
              <User size={20} />
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Tus apellidos"
                required
              />
            </div>
          </label>
        </div>

        <label className="modern-field">
          <span>Correo electrónico</span>
          <div className={`modern-input ${errors.email ? 'modern-input-error' : ''}`}>
            <Mail size={20} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@correo.com"
              required
            />
          </div>
        </label>

        <label className="modern-field">
          <span>Contraseña</span>
          <div className={`modern-input ${errors.password ? 'modern-input-error' : ''}`}>
            <LockKeyhole size={20} />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Crea una contraseña"
              required
            />
            <Eye size={20} />
          </div>
        </label>

        <label className="modern-field">
          <span>Confirmar contraseña</span>
          <div className={`modern-input ${errors.confirmPassword ? 'modern-input-error' : ''}`}>
            <LockKeyhole size={20} />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              required
            />
            <Eye size={20} />
          </div>
        </label>

        <label className={`terms-row ${errors.terms ? 'terms-row-error' : ''}`}>
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
          />
          <span>
            Acepto los <a href="#terminos">Términos y Condiciones</a> y la <a href="#privacidad">Política de Privacidad</a>
          </span>
        </label>

        <button type="submit" className="modern-submit" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

       
        <p className="auth-switch modern-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </section>
  );
};
