import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total User', value: 128, icon: Users, tone: 'default' },
  { label: 'User Aktif', value: 96, icon: UserCheck, tone: 'success' },
  { label: 'User Nonaktif', value: 32, icon: UserX, tone: 'danger' },
];

function Home() {
  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          Selamat datang kembali <span className="wave-emoji">👋</span>
        </h1>
        <p className="page-subtitle">
          Berikut ringkasan aktivitas user pada aplikasi kamu hari ini.
        </p>
      </div>

      <div className="stats-grid">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div className={`stat-card tone-${tone}`} key={label}>
            <div className="stat-icon">
              <Icon size={20} strokeWidth={2} />
            </div>
            <div className="stat-text">
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="hint-card">
        <p>
          Buka menu <strong>Users</strong> di navbar untuk melihat, mencari, dan mengelola
          seluruh user yang terdaftar.
        </p>
      </div>
    </div>
  );
}

export default Home;