import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Header } from './components/Common/Header';
import { Sidebar } from './components/Common/Sidebar';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { CandidateResumePage } from './pages/CandidateResumePage';
import { CandidateTestsPage } from './pages/CandidateTestsPage';
import { CandidateVacanciesPage } from './pages/CandidateVacanciesPage';
import { DashboardPage } from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { RecruiterApplicantsPage } from './pages/RecruiterApplicantsPage';
import { RecruiterVacanciesPage } from './pages/RecruiterVacanciesPage';

const roleHome = {
  admin: '/dashboard',
  recruiter: '/dashboard',
  evaluator: '/evaluator/dashboard',
  aspirant: '/aspirant/dashboard',
};

const ProtectedLayout = () => {
  const { isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return <div className="app-loading">Cargando SIGECON...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="app-shell">
      <Header
        mobileMenuOpen={mobileMenuOpen}
        onMenuToggle={() => setMobileMenuOpen((open) => !open)}
      />
      <Sidebar isOpen={mobileMenuOpen} />
      {mobileMenuOpen && (
        <button
          className="mobile-menu-backdrop"
          type="button"
          aria-label="Cerrar menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <main className="app-main" onClick={() => setMobileMenuOpen(false)}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/evaluator/dashboard" element={<DashboardPage />} />
          <Route path="/evaluator/tests" element={<CandidateTestsPage />} />
          <Route path="/evaluator/applications" element={<RecruiterApplicantsPage />} />
          <Route path="/aspirant/dashboard" element={<DashboardPage />} />
          <Route path="/aspirant/vacancies" element={<CandidateVacanciesPage />} />
          <Route path="/aspirant/resume" element={<CandidateResumePage />} />
          <Route path="/aspirant/my-evaluations" element={<CandidateTestsPage />} />
          <Route path="/aspirant/my-applications" element={<CandidateVacanciesPage />} />
          <Route path="/candidate/dashboard" element={<DashboardPage />} />
          <Route path="/candidate/vacancies" element={<CandidateVacanciesPage />} />
          <Route path="/candidate/resume" element={<CandidateResumePage />} />
          <Route path="/candidate/my-evaluations" element={<CandidateTestsPage />} />
          <Route path="/candidate/my-applications" element={<CandidateVacanciesPage />} />
          <Route path="/recruiter/vacancies" element={<RecruiterVacanciesPage />} />
          <Route path="/recruiter/vacancy-form" element={<RecruiterVacanciesPage />} />
          <Route path="/recruiter/applicants" element={<RecruiterApplicantsPage />} />
          <Route path="/recruiter/evaluations" element={<CandidateTestsPage />} />
          <Route path="/admin/vacancies" element={<RecruiterVacanciesPage />} />
          <Route path="/admin/applications" element={<RecruiterApplicantsPage />} />
          <Route path="/admin/users" element={<DashboardPage />} />
          <Route path="/admin/settings" element={<DashboardPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

const PublicRoutes = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="app-loading">Cargando SIGECON...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={roleHome[user?.role] || '/dashboard'} replace />
          ) : (
            <RegisterPage />
          )
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={roleHome[user?.role] || '/dashboard'} replace />
          ) : (
            <LoginPage />
          )
        }
      />
      <Route path="/*" element={<ProtectedLayout />} />
    </Routes>
  );
};

const App = () => (
  <AuthProvider>
    <PublicRoutes />
  </AuthProvider>
);

export default App;
