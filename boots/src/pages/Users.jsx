import { useState } from 'react';
import { Search } from 'lucide-react';
import UserCard from '../components/UserCard';

// Data dummy — nantinya bisa diganti dengan hasil fetch dari backend kamu
const dataUser = [
  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Siti Aminah', email: 'siti@example.com', role: 'Editor', status: 'Active' },
  { id: 3, name: 'Andi Wijaya', email: 'andi@example.com', role: 'Member', status: 'Inactive' },
  { id: 4, name: 'Dewi Lestari', email: 'dewi@example.com', role: 'Member', status: 'Active' },
  { id: 5, name: 'Rizky Ramadhan', email: 'rizky@example.com', role: 'Editor', status: 'Inactive' },
];

function Users() {
  const [query, setQuery] = useState('');

  const filteredUsers = dataUser.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Daftar User</h1>
        <p className="page-subtitle">Kelola dan pantau seluruh user yang terdaftar.</p>
      </div>

      <div className="search-bar">
        <Search size={18} strokeWidth={2} />
        <input
          type="text"
          placeholder="Cari nama user..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {filteredUsers.length > 0 ? (
        <div className="user-grid">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              name={user.name}
              email={user.email}
              role={user.role}
              status={user.status}
            />
          ))}
        </div>
      ) : (
        <div className="hint-card">
          <p>Tidak ada user dengan nama "{query}".</p>
        </div>
      )}
    </div>
  );
}

export default Users;