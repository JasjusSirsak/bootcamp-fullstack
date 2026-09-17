const express = require('express');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Parser Input
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Logging Sederhana
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve Static Files dari folder 'src'
app.use(express.static(path.join(__dirname, 'src'), { extensions: ['html'] }));

// Halaman Utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'src', 'home.html'));
});

// --- API ROUTES ---
app.use('/', userRoutes);

// Middleware 404 Not Found
app.use((req, res) => {
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(404).json({
      status: 'fail',
      message: 'Endpoint API tidak ditemukan!'
    });
  }
  
  res.status(404).sendFile(path.join(__dirname, 'src', '404.html'));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan internal pada server!'
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});