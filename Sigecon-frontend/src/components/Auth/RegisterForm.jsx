import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../Common/Button';
import { Input, Select } from '../Common/Input';
import { Alert } from '../Common/Alert';
import './LoginForm.css';

const roleHome = {
  admin: '/dashboard',
  recruiter: '/dashboard',
  evaluator: '/evaluator/dashboard',
  aspirant: '/aspirant/dashboard',
};

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    role: 'aspirant',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!formData.fullName.trim()) nextErrors.fullName = 'Ingresa tu nombre completo';
    if (!formData.email.trim()) nextErrors.email = 'Ingresa tu correo empresarial';
    if (!formData.company.trim()) nextErrors.company = 'Ingresa la empresa o institucion';
    if (formData.password.length < 8) nextErrors.password = 'Usa minimo 8 caracteres';
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Las contrasenas no coinciden';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    const result = register(formData);
    setLoading(false);

    if (result.success) {
      navigate(roleHome[formData.role] || '/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form auth-form-wide">
      <div className="form-header">
        <span className="auth-eyebrow">Crear cuenta profesional</span>
        <h1>Registro SIGECON</h1>
        <p>Configura tu perfil para comenzar a gestionar procesos de seleccion.</p>
      </div>

      <Alert
        type="success"
        title="Acceso inmediato"
        message="Este registro demo crea la sesion local y te lleva al panel segun tu perfil."
      />

      <div className="auth-grid">
        <Input
          label="Nombre completo"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          placeholder="Ej: Maria Gonzalez"
          required
        />
        <Input
          label="Correo"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          placeholder="nombre@empresa.com"
          required
        />
      </div>

      <div className="auth-grid">
        <Input
          label="Empresa o institucion"
          name="company"
          value={formData.company}
          onChange={handleChange}
          error={errors.company}
          placeholder="SIGECON S.A.S."
          required
        />
        <Select
          label="Tipo de usuario"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={[
            { value: 'admin', label: 'Administrador - Control total del sistema' },
            { value: 'recruiter', label: 'Reclutador' },
            { value: 'evaluator', label: 'Evaluador - Aplicacion y revision de pruebas' },
            { value: 'aspirant', label: 'Aspirante - Registro y postulacion' },
          ]}
          required
        />
      </div>

      <div className="auth-grid">
        <Input
          label="Contrasena"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          placeholder="Minimo 8 caracteres"
          required
        />
        <Input
          label="Confirmar contrasena"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          placeholder="Repite tu contrasena"
          required
        />
      </div>

      <div className="auth-assurance">
        <span><ShieldCheck size={18} /> Datos protegidos</span>
        <span><CheckCircle2 size={18} /> Perfil listo para evaluar</span>
      </div>

      <Button variant="primary" size="lg" fullWidth loading={loading}>
        Crear cuenta
      </Button>

      <p className="auth-switch">
        Ya tienes cuenta? <Link to="/login">Inicia sesion</Link>
      </p>
    </form>
  );
};
