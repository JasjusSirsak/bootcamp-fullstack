const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// Global Middleware
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server berjalan dengan baik!' });
});

// Routes
app.use('/api/users', userRoutes);

// 404 untuk endpoint yang tidak ada
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Kami tidak menemukan endpoint ${req.method} ${req.originalUrl}`,
  });
});

// Kendala tak terduga di server
app.use((err, req, res, _next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: 'Aplikasi sedang dalam kendala. Silakan coba lagi nanti.',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});