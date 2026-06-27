import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: '▦' },
  { to: '/clients', label: 'Clients', icon: '👤' },
  { to: '/projects', label: 'Projects', icon: '📁' },
  { to: '/calendar', label: 'Calendar', icon: '📅' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-surface-card border-b border-surface-border px-4 py-3 flex items-center justify-between">
        <div>
          <span className="text-primary font-mono font-bold text-lg">freelance/</span>
          <span className="text-ink-muted font-mono text-lg">track</span>
        </div>
        <button onClick={() => setOpen(!open)} className="text-ink-muted hover:text-ink p-1 transition-colors">
          {open ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="lg:hidden fixed top-14 left-0 right-0 z-20 bg-surface-card border-b border-surface-border px-4 py-3 space-y-1">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive ? 'bg-primary/10 text-primary font-medium' : 'text-ink-muted hover:text-ink hover:bg-surface-border'
                }`
              }
            >
              <span>{icon}</span>{label}
            </NavLink>
          ))}
          <div className="pt-2 border-t border-surface-border">
            <p className="text-xs text-ink-muted">{user?.name}</p>
            <button onClick={handleLogout} className="mt-1 text-xs text-danger hover:underline">Sign out →</button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 h-full w-56 bg-surface-card border-r border-surface-border flex-col z-10">
        <div className="px-5 py-6 border-b border-surface-border">
          <span className="text-primary font-mono font-bold text-lg">freelance/</span>
          <span className="text-ink-muted font-mono text-lg">track</span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                  isActive ? 'bg-primary/10 text-primary font-medium' : 'text-ink-muted hover:text-ink hover:bg-surface-border'
                }`
              }
            >
              <span>{icon}</span>{label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-surface-border">
          <p className="text-xs text-ink-muted mb-0.5">Signed in as</p>
          <p className="text-sm font-medium text-ink truncate">{user?.name}</p>
          <button onClick={handleLogout} className="mt-3 w-full text-xs text-ink-faint hover:text-danger transition-colors text-left">Sign out →</button>
        </div>
      </aside>
    </>
  );
}
