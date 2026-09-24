import { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Loader2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getUsers } from '../api/userApi';

function Home() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const users = await getUsers();
        const total = users.length;
        const active = users.filter((u) => {
          const s = (u.status || '').toUpperCase();
          return s === 'ACTIVE' || s === 'AKTIF';
        }).length;
        const inactive = total - active;

        setStats({ total, active, inactive });
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    {
      label: 'Total User Terdaftar',
      value: loading ? '...' : stats.total,
      icon: Users,
      tone: 'accent',
    },
    {
      label: 'User Aktif',
      value: loading ? '...' : stats.active,
      icon: UserCheck,
      tone: 'success',
    },
    {
      label: 'User Nonaktif / Lainnya',
      value: loading ? '...' : stats.inactive,
      icon: UserX,
      tone: 'danger',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          Selamat datang kembali <span className="wave-emoji">👋</span>
        </h1>
        <p className="page-subtitle">
          Data statistik user di bawah ditarik langsung dari database PostgreSQL secara realtime.
        </p>
      </div>

      <div className="stats-grid">
        {statCards.map(({ label, value, icon: Icon, tone }) => (
          <div className={`stat-card tone-${tone}`} key={label}>
            <div className="stat-icon">
              {loading ? (
                <Loader2 size={20} className="spin-animation" />
              ) : (
                <Icon size={20} strokeWidth={2} />
              )}
            </div>
            <div className="stat-text">
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="home-action-card">
        <div>
          <h3 className="action-card-title">Mulai Kelola User</h3>
          <p className="action-card-subtitle">
            Buka menu Users untuk menambah, mengedit, mencari, dan menghapus user dari database.
          </p>
        </div>
        <Link to="/users" className="btn btn-primary">
          <span>Buka Daftar User</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}

export default Home;