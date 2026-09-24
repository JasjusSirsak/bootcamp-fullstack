import { useState, useEffect } from 'react';
import { Search, UserPlus, AlertCircle, CheckCircle2, Loader2, X } from 'lucide-react';
import UserCard from '../components/UserCard';
import { getUsers, createUser, updateUser, deleteUser } from '../api/userApi';

const initialFormData = {
  name: '',
  email: '',
  phone: '',
  role: 'USER',
  status: 'ACTIVE',
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [userToDelete, setUserToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // 1. Fetch Users dari Database
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Gagal memuat data dari database. Pastikan server aktif!');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Open Modal untuk Tambah Baru
  const handleOpenAddModal = () => {
    setEditingUser(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  // 3. Open Modal untuk Edit
  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'USER',
      status: user.status || 'ACTIVE',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData(initialFormData);
  };

  // 4. Submit Form (Create atau Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      showToast('Nama dan Email wajib diisi!', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (editingUser) {
        // Update user
        const updated = await updateUser(editingUser.id, formData);
        setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? updated : u)));
        showToast(`User "${updated.name}" berhasil diperbarui!`);
      } else {
        // Create user baru
        const created = await createUser(formData);
        setUsers((prev) => [...prev, created]);
        showToast(`User baru "${created.name}" berhasil ditambahkan!`);
      }
      handleCloseModal();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Terjadi kesalahan saat menyimpan data.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // 5. Hapus User (Delete)
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      setDeleting(true);
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      showToast(`User "${userToDelete.name}" berhasil dihapus.`);
      setUserToDelete(null);
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.error || 'Gagal menghapus user.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  // Filter pencarian
  const filteredUsers = users.filter((user) => {
    const q = query.toLowerCase();
    return (
      user.name?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.role?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="page">
      {/* Toast Alert */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          {toast.type === 'error' ? (
            <AlertCircle size={18} />
          ) : (
            <CheckCircle2 size={18} />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header-row">
        <div className="page-header">
          <h1 className="page-title">Manajemen User</h1>
          <p className="page-subtitle">
            Kelola data user secara langsung dari database PostgreSQL secara realtime.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAddModal}
        >
          <UserPlus size={18} />
          <span>Tambah User</span>
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div className="toolbar-row">
        <div className="search-bar">
          <Search size={18} strokeWidth={2} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email, atau role..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="user-count-badge">
          Total: <strong>{filteredUsers.length}</strong> user
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="error-banner">
          <AlertCircle size={20} />
          <div>
            <p className="error-title">Gagal Terhubung ke Database</p>
            <p className="error-desc">{error}</p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={fetchUsers}
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="loading-container">
          <Loader2 size={36} className="spin-animation" />
          <p>Mengambil data dari database PostgreSQL...</p>
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="user-grid">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={handleOpenEditModal}
              onDelete={(u) => setUserToDelete(u)}
            />
          ))}
        </div>
      ) : (
        <div className="hint-card">
          <p>
            {query
              ? `Tidak ada user yang cocok dengan "${query}".`
              : 'Belum ada data user di database. Silakan klik "+ Tambah User" untuk membuat user pertama!'}
          </p>
        </div>
      )}

      {/* MODAL FORM: TAMBAH / EDIT USER */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={handleCloseModal}>
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2 className="modal-title">
                {editingUser ? 'Edit Data User' : 'Tambah User Baru'}
              </h2>
              <button
                type="button"
                className="close-modal-btn"
                onClick={handleCloseModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label htmlFor="user-name">Nama Lengkap *</label>
                <input
                  id="user-name"
                  type="text"
                  placeholder="Contoh: Sarah Azhari"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-email">Email *</label>
                <input
                  id="user-email"
                  type="email"
                  placeholder="Contoh: sarah@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="user-phone">Nomor Telepon</label>
                <input
                  id="user-phone"
                  type="tel"
                  placeholder="Contoh: +62812345678"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="user-role">Role</label>
                  <select
                    id="user-role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="EDITOR">EDITOR</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="user-status">Status</label>
                  <select
                    id="user-status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                    <option value="PENDING">PENDING</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Loader2 size={16} className="spin-animation" />
                      <span>Menyimpan...</span>
                    </>
                  ) : editingUser ? (
                    'Simpan Perubahan'
                  ) : (
                    'Simpan User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG: DELETE USER */}
      {userToDelete && (
        <div className="modal-backdrop" onClick={() => !deleting && setUserToDelete(null)}>
          <div className="modal-box modal-box-sm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Konfirmasi Hapus</h2>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => !deleting && setUserToDelete(null)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                Apakah kamu yakin ingin menghapus user <strong>{userToDelete.name}</strong>?
                Data ini akan dihapus permanen dari database.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setUserToDelete(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <Loader2 size={16} className="spin-animation" />
                    <span>Menghapus...</span>
                  </>
                ) : (
                  'Ya, Hapus'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Users;