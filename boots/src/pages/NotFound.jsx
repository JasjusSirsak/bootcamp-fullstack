import { Link, useLocation } from 'react-router-dom';
import { SearchX, Home, Users } from 'lucide-react';

function NotFound() {
  const location = useLocation();
  const attemptedPath = location.pathname || '/';

  return (
    <div className="error-page">
      <div className="error-page-card">
        <div className="error-page-icon tone-404">
          <SearchX size={28} strokeWidth={2} />
        </div>

        <p className="error-page-code">Error 404</p>
        <h1 className="error-page-title">Halaman tidak ditemukan</h1>
        <p className="error-page-desc">
          Maaf, kami tidak dapat menemukan halaman yang kamu cari.
          Alamat{' '}
          <code className="error-page-path">{attemptedPath}</code>{' '}
          tidak ada di aplikasi ini. Coba periksa ejaan URL-nya,
          atau kembali ke halaman yang tersedia.
        </p>

        <div className="error-page-actions">
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Kembali ke Home</span>
          </Link>
          <Link to="/users" className="btn btn-secondary">
            <Users size={16} />
            <span>Buka Daftar User</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
