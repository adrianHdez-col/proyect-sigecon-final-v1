import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  ChevronDown,
  FileText,
  MessageCircle,
  ShieldCheck,
  HelpCircle,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../Common/Header.css';

export const Header = ({ onMenuToggle, mobileMenuOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const displayName = user?.fullName || user?.name || 'Usuario';
  const initial = displayName.charAt(0).toUpperCase();
  const isAspirant = user?.role === 'aspirant' || user?.role === 'candidate';

  const navLinks = isAspirant
    ? [
        { label: 'Inicio', path: '/aspirant/dashboard' },
        { label: 'Ofertas', path: '/aspirant/vacancies' },
        { label: 'Mis postulaciones', path: '/aspirant/my-applications' },
      ]
    : [
        { label: 'Inicio', path: '/dashboard' },
        { label: 'Vacantes', path: user?.role === 'recruiter' ? '/recruiter/vacancies' : '/admin/vacancies' },
        { label: 'Postulaciones', path: user?.role === 'recruiter' ? '/recruiter/applicants' : '/admin/applications' },
        { label: 'Configuración', path: `/${user?.role || 'admin'}/settings` },
      ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button
            className="menu-toggle"
            type="button"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="brand-block">
            <div className="brand-logo-block">
              <span className="brand-logo">S</span>
            </div>
            <div>
              <span className="brand-label">SIGECON</span>
              <p className="brand-subtitle">Encuentra tu próximo paso</p>
            </div>
          </div>
        </div>

        <nav className="header-nav" aria-label="Navegación principal">
          {navLinks.map((link) => (
            <NavLink
              key={`${link.label}-${link.path}`}
              to={link.path}
              className={({ isActive }) => `header-nav-link ${isActive ? 'active' : ''}`}
            >
              {link.label}
              {link.label === 'Mis postulaciones' && applicationsBadge()}
            </NavLink>
          ))}
          {isAspirant && (
            <>
              <button type="button" className="header-nav-link header-nav-button">
                Mensajes
                <span className="nav-count">3</span>
              </button>
              <button type="button" className="header-nav-link header-nav-button">
                Guardados
              </button>
            </>
          )}
        </nav>

        <div className="header-right">
          <button className="icon-btn" type="button" aria-label="Notificaciones">
            <Bell size={20} />
            <span className="notification-dot" />
          </button>
          <button className="icon-btn" type="button" aria-label="Mensajes">
            <MessageCircle size={20} />
          </button>

          <div className={`profile-menu ${profileOpen ? 'open' : ''}`}>
            <button
              type="button"
              className="profile-trigger"
              aria-haspopup="menu"
              aria-expanded={profileOpen}
              onClick={() => setProfileOpen((open) => !open)}
            >
              <span className="profile-avatar">{initial}</span>
              <span className="profile-meta">
                <strong>{displayName}</strong>
                <small>{user?.role || 'Miembro'}</small>
              </span>
              <ChevronDown size={18} />
            </button>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-summary">
                  <div className="profile-summary-avatar">
                    {initial}
                  </div>
                  <div>
                    <strong>{displayName}</strong>
                    <small>{user?.email || 'usuario@correo.com'}</small>
                    <p>{user?.role || 'Miembro'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/dashboard');
                  }}
                >
                  <User size={18} />
                  Mi perfil
                </button>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/aspirant/resume');
                  }}
                >
                  <FileText size={18} />
                  Mis documentos
                </button>
                <button type="button" className="dropdown-item">
                  <Bell size={18} />
                  Notificaciones
                </button>
                <button type="button" className="dropdown-item">
                  <HelpCircle size={18} />
                  Ayuda
                </button>
                <button type="button" className="dropdown-item">
                  <ShieldCheck size={18} />
                  Privacidad
                </button>
                <button
                  type="button"
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

const applicationsBadge = () => <span className="nav-count">3</span>;
