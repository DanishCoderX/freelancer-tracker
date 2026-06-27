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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed top-0 left-0 h-full w-56 bg-surface-card border-r border-surface-border flex flex-col z-10">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-surface-border">
        <span className="text-primary font-mono font-bold text-lg tracking-tight">freelance/</span>
        <span className="text-ink-muted font-mono text-lg">track</span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-ink-muted hover:text-ink hover:bg-surface-border'
              }`
            }
          >
            <span className="text-base">{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-surface-border">
        <p className="text-xs text-ink-muted mb-0.5">Signed in as</p>
        <p className="text-sm font-medium text-ink truncate">{user?.name}</p>
        <button
          onClick={handleLogout}
          className="mt-3 w-full text-xs text-ink-faint hover:text-danger transition-colors text-left"
        >
          Sign out →
        </button>
      </div>
    </aside>
  );
}