import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import AuthModal from './components/AuthModal.jsx';
import AppShell from './components/layout/AppShell.jsx';
import HomePage from './pages/HomePage.jsx';
import TodayPage from './pages/TodayPage.jsx';
import JournalPage from './pages/JournalPage.jsx';
import InsightsPage from './pages/InsightsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function AppContent() {
  const { user, loading, authFetch } = useAuth();
  const [page, setPage] = React.useState('home');
  const [authModal, setAuthModal] = React.useState(null);
  const [dark, setDark] = React.useState(() => localStorage.getItem('lucidly_dark_mode') !== 'false');

  React.useEffect(() => {
    localStorage.setItem('lucidly_dark_mode', String(dark));
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const navigate = (nextPage) => {
    const protectedPages = new Set(['today', 'journal', 'insights', 'profile']);
    if (protectedPages.has(nextPage) && !user) {
      setAuthModal('signup');
      return;
    }
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="lucidly-loading">
        <img
          className="lucidly-loading-logo"
          src="/images/lucidly-hero-a.png"
          alt="Lucidly"
          draggable="false"
          style={{ width: 150, height: 150, objectFit: 'contain', display: 'block' }}
        />
        <span>getting your corner ready...</span>
      </div>
    );
  }

  return (
    <AppShell page={page} onNavigate={navigate} dark={dark} onToggleDark={() => setDark((value) => !value)}>
      {page === 'home' && <HomePage user={user} onNavigate={navigate} onAuth={setAuthModal} />}
      {page === 'today' && <TodayPage authFetch={authFetch} />}
      {page === 'journal' && <JournalPage authFetch={authFetch} />}
      {page === 'insights' && <InsightsPage authFetch={authFetch} />}
      {page === 'profile' && <ProfilePage user={user} authFetch={authFetch} />}
      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} onSuccess={() => { setAuthModal(null); setPage('today'); }} isDark={dark} />}
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
