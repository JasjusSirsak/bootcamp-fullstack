import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Sparkles, Clock as ClockIcon } from 'lucide-react';
import Clock from './Clock';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">
          <Sparkles size={18} strokeWidth={2.2} />
        </span>
        <span className="navbar-title">User Dashboard</span>
      </div>

      <nav className="navbar-links">
        <NavLink
          to="/"
          end
          className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
        >
          <LayoutDashboard size={17} strokeWidth={2} />
          <span>Home</span>
        </NavLink>
        <NavLink
          to="/users"
          className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
        >
          <Users size={17} strokeWidth={2} />
          <span>Users</span>
        </NavLink>
      </nav>

      <div className="navbar-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Komponen Jam Digital */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ClockIcon size={16} />
          <Clock />
        </div>

        <span className="navbar-badge">Admin Mode</span>
      </div>
    </header>
  );
}