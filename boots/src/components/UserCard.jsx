import { Mail, ShieldCheck, CircleDot } from 'lucide-react';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function UserCard({ name, email, role, status }) {
  const isActive = status === 'Active';

  return (
    <div className="user-card">
      <div className="user-card-top">
        <div className="user-avatar">{getInitials(name)}</div>
        <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
          <CircleDot size={11} strokeWidth={3} />
          {status}
        </span>
      </div>

      <h3 className="user-name">{name}</h3>

      <p className="user-email">
        <Mail size={14} strokeWidth={2} />
        <span>{email}</span>
      </p>

      <div className="user-role">
        <ShieldCheck size={14} strokeWidth={2} />
        <span>{role}</span>
      </div>
    </div>
  );
}