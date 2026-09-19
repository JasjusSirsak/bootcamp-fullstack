const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// Ambil semua user dari database PostgreSQL
async function loadUsers() {
  try {
    const res = await pool.query('SELECT * FROM users ORDER BY id DESC');
    return res.rows;
  } catch (error) {
    console.error('Error fetching users from DB:', error);
    return [];
  }
}

// Tambah user baru ke database PostgreSQL
async function addUser({ name, phone, email, role, status }) {
  const query = `
    INSERT INTO users (name, phone, email, role, status, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *;
  `;
  const values = [
    name,
    phone,
    email || null,
    role || 'User',
    status || 'Aktif'
  ];

  const res = await pool.query(query, values);
  return res.rows[0];
}

// Cari user berdasarkan nomor telepon
async function findUserByPhone(phone) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    return res.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by phone:', error);
    return null;
  }
}

// Cari user berdasarkan nama
async function findUserByName(name) {
  try {
    const res = await pool.query('SELECT * FROM users WHERE name = $1', [name]);
    return res.rows[0] || null;
  } catch (error) {
    console.error('Error finding user by name:', error);
    return null;
  }
}

module.exports = {
  pool,
  loadUsers,
  addUser,
  findUserByPhone,
  findUserByName
};