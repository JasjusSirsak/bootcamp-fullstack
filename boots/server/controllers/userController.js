const db = require('../db');

// 1. Ambil semua user
const getUsers = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ error: 'Gagal mengambil data user: ' + err.message });
  }
};

// 2. Ambil user per ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching user by ID:', err.message);
    res.status(500).json({ error: 'Gagal mengambil detail user: ' + err.message });
  }
};

// 3. Tambah user baru (Create)
const createUser = async (req, res) => {
  const { name, email, phone, role, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nama dan Email wajib diisi!' });
  }

  try {
    const query = `
      INSERT INTO users (name, email, phone, role, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      role ? role.trim() : 'USER',
      status ? status.trim() : 'ACTIVE',
    ];

    const result = await db.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating user:', err.message);
    res.status(500).json({ error: 'Gagal menambahkan user: ' + err.message });
  }
};

// 4. Perbarui data user (Update)
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, role, status } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nama dan Email wajib diisi!' });
  }

  try {
    const query = `
      UPDATE users
      SET name = $1, email = $2, phone = $3, role = $4, status = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [
      name.trim(),
      email.trim(),
      phone ? phone.trim() : null,
      role ? role.trim() : 'USER',
      status ? status.trim() : 'ACTIVE',
      id,
    ];

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ error: 'Gagal memperbarui user: ' + err.message });
  }
};

// 5. Hapus user (Delete)
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }
    res.json({ message: 'User berhasil dihapus', user: result.rows[0] });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ error: 'Gagal menghapus user: ' + err.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};