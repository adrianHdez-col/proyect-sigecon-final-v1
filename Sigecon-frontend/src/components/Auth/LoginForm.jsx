import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../Common/Button';
import { Input } from '../Common/Input';
import { Alert } from '../Common/Alert';
import '../Auth/LoginForm.css';

const roleHome = {
  admin: '/dashboard',
  recruiter: '/dashboard',
  evaluator: '/evaluator/dashboard',
  aspirant: '/aspirant/dashboard',
};

export const LoginForm = () => {
  const [email, setEmail] = useState('admin@sigecon.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = login(email, password);
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
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-header">
        <span className="auth-eyebrow">Acceso seguro</span>
        <h1>SIGECON</h1>
        <p>Sistema de Gestion de Contratacion</p>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError('')}
        />
      )}

      <Alert
        type="info"
        title="Credenciales de prueba"
        message={`Admin: admin@sigecon.com | Reclutador: hr@sigecon.com | Evaluador: evaluador@sigecon.com | Aspirante: aspirante@sigecon.com\nContrasena: password123`}
      />

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="correo@empresa.com"
        required
      />

      <Input
        label="Contrasena"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Ingresa tu contrasena"
        required
      />

      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={loading}
      >
        Iniciar sesion
      </Button>

      <p className="auth-switch">
        No tienes cuenta? <Link to="/register">Crear cuenta profesional</Link>
      </p>

      <p className="footer-text">
        2024 SIGECON - Todos los derechos reservados
      </p>
    </form>
  );
};
