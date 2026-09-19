const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

// RENDER HALAMAN EJS
router.get('/', userController.getUserPage);

// Jika butuh API JSON
router.get('/api', userController.getUsers);

// POST TAMBAH USER
router.post('/add-user', userController.addUser);

module.exports = router;