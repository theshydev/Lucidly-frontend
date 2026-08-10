import React from 'react';
import { BookOpen, Brain, Home, LogOut, Menu, Moon, Sparkles, Sun, User, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const navItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'today', label: 'Today', icon: Sparkles },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'insights', label: 'Insights', icon: Brain },
  { id: 'profile', label: 'Profile', icon: User },
];

const logoStyle = {
  width: 29,
  height: 29,
  objectFit: 'contain',
  display: 'block',
};

export default function AppShell({ page, onNavigate, dark, onToggleDark, children }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const navigate = (id) => {
    setMenuOpen(false);
    onNavigate(id);
  };

  return (
    <div className={`lucidly-app ${dark ? 'lucidly-dark' : 'lucidly-light'}`}>
      <header className="lucidly-topbar">
        <button className="lucidly-brand" onClick={() => navigate('home')} aria-label="Go home">
          <img
            src={dark ? '/images/lucidly-hero-a.png' : '/images/lucidly-hero-b.png'}
            alt=""
            style={logoStyle}
            draggable="false"
          />
          <span>lucidly</span>
        </button>

        <nav className="lucidly-desktop-nav" aria-label="Main navigation">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`lucidly-nav-link ${page === id ? 'active' : ''}`} onClick={() => navigate(id)}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        <div className="lucidly-top-actions">
          <button className="lucidly-icon-button" onClick={onToggleDark} aria-label="Toggle theme">
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {user && <span className="lucidly-user-chip"><User size={14} /> {user.name?.split(' ')[0]}</span>}
          {user && <button className="lucidly-icon-button lucidly-desktop-only" onClick={logout} aria-label="Sign out"><LogOut size={17} /></button>}
          <button className="lucidly-icon-button lucidly-mobile-menu" onClick={() => setMenuOpen((v) => !v)} aria-label="Open menu">
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="lucidly-mobile-nav">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={`lucidly-mobile-nav-link ${page === id ? 'active' : ''}`} onClick={() => navigate(id)}>
              <Icon size={18} /> {label}
            </button>
          ))}
          {user && <button className="lucidly-mobile-nav-link" onClick={() => { logout(); setMenuOpen(false); }}><LogOut size={18} /> Sign out</button>}
        </div>
      )}

      <main className="lucidly-main">{children}</main>
    </div>
  );
}
