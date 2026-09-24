import { Mail, ShieldCheck, CircleDot, Phone, Pencil, Trash2 } from 'lucide-react';

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function UserCard({ user, onEdit, onDelete }) {
  const { name, email, phone, role, status } = user;
  
  // Normalisasi status check
  const normalizedStatus = (status || '').toUpperCase();
  const isActive = normalizedStatus === 'ACTIVE' || normalizedStatus === 'AKTIF';
  const isPending = normalizedStatus === 'PENDING';

  const statusClass = isActive
    ? 'status-active'
    : isPending
    ? 'status-pending'
    : 'status-inactive';

  return (
    <div className="user-card">
      <div className="user-card-top">
        <div className="user-avatar">{getInitials(name)}</div>
        <span className={`status-badge ${statusClass}`}>
          <CircleDot size={11} strokeWidth={3} />
          {status}
        </span>
      </div>

      <h3 className="user-name">{name}</h3>

      <p className="user-email" title={email}>
        <Mail size={14} strokeWidth={2} />
        <span>{email}</span>
      </p>

      {phone && (
        <p className="user-phone">
          <Phone size={14} strokeWidth={2} />
          <span>{phone}</span>
        </p>
      )}

      <div className="user-card-footer">
        <div className="user-role">
          <ShieldCheck size={14} strokeWidth={2} />
          <span>{role}</span>
        </div>

        <div className="card-actions">
          <button
            type="button"
            className="action-btn edit-btn"
            title="Edit User"
            onClick={() => onEdit(user)}
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            className="action-btn delete-btn"
            title="Hapus User"
            onClick={() => onDelete(user)}
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}