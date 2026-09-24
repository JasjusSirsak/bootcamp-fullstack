import { Link } from 'react-router-dom';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';

function ErrorPage({ error, onRetry }) {
  const message =
    error?.message ||
    'Terjadi kendala tak terduga saat memuat aplikasi. Tim kami sudah mencatatnya, silakan coba lagi.';

  return (
    <div className="error-page">
      <div className="error-page-card">
        <div className="error-page-icon tone-500">
          <AlertTriangle size={28} strokeWidth={2} />
        </div>

        <p className="error-page-code">Error 500</p>
        <h1 className="error-page-title">Aplikasi sedang dalam kendala</h1>
        <p className="error-page-desc">
          Maaf, sesuatu tidak berjalan seperti yang diharapkan.
          Data kamu aman — ini hanya gangguan sementara di sisi aplikasi.
        </p>

        <p className="error-page-detail" role="status">
          {message}
        </p>

        <div className="error-page-actions">
          {onRetry && (
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              <RotateCcw size={16} />
              <span>Coba lagi</span>
            </button>
          )}
          <Link to="/" className="btn btn-secondary" onClick={onRetry}>
            <Home size={16} />
            <span>Kembali ke Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
