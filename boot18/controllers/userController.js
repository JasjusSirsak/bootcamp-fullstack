const db = require('../db');
const { validateUserData } = require('../utils/userValidator');

// 1. Khusus RENDER Halaman EJS (GET /user)
const getUserPage = async (req, res, next) => {
  try {
    const users = await db.loadUsers();
    console.log('=== DATA USERS DARI DB ===', users);
    res.render('user', { users });
  } catch (error) {
    next(error);
  }
};

// 2. Khusus API JSON Daftar User (GET /user/api)
const getUsers = async (req, res, next) => {
  try {
    const users = await db.loadUsers();
    res.json({
      status: 'success',
      total: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// 3. POST Tambah User (POST /user/add-user)
const addUser = async (req, res, next) => {
  try {
    const { name, phone, email, role, status } = req.body;

    const validation = await validateUserData({ name, phone, email });
    if (!validation.isValid) {
      return res.status(validation.statusCode).json({
        status: 'fail',
        message: validation.message
      });
    }

    // Default aman kalau field role/status tidak dikirim dari form
    const allowedRoles = ['User', 'Admin'];
    const allowedStatus = ['Aktif', 'Nonaktif'];

    const newUser = await db.addUser({
      name,
      phone,
      email: email || null,
      role: allowedRoles.includes(role) ? role : 'User',
      status: allowedStatus.includes(status) ? status : 'Aktif'
    });

    res.status(201).json({
      status: 'success',
      message: `Terima kasih ${name}, data kamu berhasil dicatat!`,
      data: newUser
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserPage,
  getUsers,
  addUser
};