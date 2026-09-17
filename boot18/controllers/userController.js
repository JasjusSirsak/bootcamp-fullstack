const db = require('../db');
const { validateUserData } = require('../utils/userValidator');

// GET /users
const getUsers = (req, res) => {
  const users = db.loadUsers();
  res.json({
    status: 'success',
    total: users.length,
    data: users
  });
};

// POST /add-user
const addUser = (req, res) => {
  const { nama, phone, email } = req.body;

  // Jalankan validasi dari utils
  const validation = validateUserData({ nama, phone, email });
  if (!validation.isValid) {
    return res.status(validation.statusCode).json({
      status: 'fail',
      message: validation.message
    });
  }

  const newUser = {
    name: nama,
    phone,
    email: email || null,
    created_at: new Date().toISOString()
  };

  db.addUser(newUser);

  res.status(201).json({
    status: 'success',
    message: `Terima kasih ${nama}, data kamu berhasil dicatat!`,
    data: newUser
  });
};

module.exports = {
  getUsers,
  addUser
};