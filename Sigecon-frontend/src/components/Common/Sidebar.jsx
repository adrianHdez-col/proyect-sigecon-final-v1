import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  Briefcase,
  FileText,
  CheckSquare,
  Brain,
  Settings,
  Users,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import '../Common/Sidebar.css';

export const Sidebar = ({ isOpen, onLinkClick }) => {
  const { user } = useAuth();

  const adminLinks = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Users, label: 'Usuarios', path: '/admin/users' },
    { icon: Briefcase, label: 'Vacantes', path: '/admin/vacancies' },
    { icon: Users, label: 'Postulaciones', path: '/admin/applications' },
    { icon: Settings, label: 'Configuracion', path: '/admin/settings' },
  ];

  const recruiterLinks = [
    { icon: BarChart3, label: 'Dashboard', path: '/dashboard' },
    { icon: Briefcase, label: 'Vacantes', path: '/recruiter/vacancies' },
    { icon: FileText, label: 'Crear vacante', path: '/recruiter/vacancy-form' },
    { icon: Users, label: 'Candidatos', path: '/recruiter/applicants' },
    { icon: Settings, label: 'Configuracion', path: '/recruiter/settings' },
  ];

  const evaluatorLinks = [
    { icon: BarChart3, label: 'Dashboard', path: '/evaluator/dashboard' },
    { icon: Brain, label: 'Pruebas', path: '/evaluator/tests' },
    { icon: CheckSquare, label: 'Revisiones', path: '/evaluator/applications' },
    { icon: Settings, label: 'Configuracion', path: '/evaluator/settings' },
  ];

  const aspirantLinks = [
    { icon: Briefcase, label: 'Vacantes', path: '/aspirant/vacancies' },
    { icon: FileText, label: 'Hoja de vida', path: '/aspirant/resume' },
    { icon: CheckSquare, label: 'Postulaciones', path: '/aspirant/my-applications' },
    { icon: Brain, label: 'Pruebas', path: '/aspirant/my-evaluations' },
    { icon: Settings, label: 'Configuracion', path: '/aspirant/settings' },
  ];

  const getLinks = () => {
    switch (user?.role) {
      case 'admin':
        return adminLinks;
      case 'recruiter':
        return recruiterLinks;
      case 'evaluator':
        return evaluatorLinks;
      case 'aspirant':
        return aspirantLinks;
      default:
        return [];
    }
  };

  const links = getLinks();

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  onClick={onLinkClick}
                >
                  <Icon size={20} />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
