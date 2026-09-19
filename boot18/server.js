const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// EJS Setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src'));

// parser (aka data yang di terima untuk input, INGAT ITU)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

//Static files
app.use(express.static(path.join(__dirname, 'public')));

// Helper
const isApiRequest = (req) =>
  req.xhr ||
  req.headers.accept?.includes('application/json') ||
  req.is('application/json') ||
  req.path.startsWith('/user/add-user') ||
  req.path.includes('/api');

// Halaman Utama (spesifik — harus di atas dynamic route)
app.get('/', (req, res) => {
  res.render('home', { title: 'Halaman Utama' });
});

// API & USER ROUTES
app.use('/user', userRoutes);

// app.get('/', (req, res) => {
//   res.render('home', { title: 'Halaman Utama' });
// });

// app.get('/about', (req, res) => {
//   res.render('about', { title: 'About Us' });
// });

// app.get('/contact', (req, res) => {
//   res.render('contact', { title: 'Contact' });
// });

//DYNAMIC ROUTE (render otomatis berdasarkan URL), jadi kita ga usah manual satu persatu
app.get('/:page', (req, res, next) => {
  const page = req.params.page;

  // Lewati file statis atau request dengan ekstensi (misal favicon.ico)
  if (page.includes('.')) {
    return next();
  }

  res.render(page, { title: page }, (err, html) => {
    if (err) {
      if (err.message.includes('Failed to lookup view')) {
        return next();
      }
      return next(err); // error lain → global error handler
    }
    res.send(html);
  });
});


app.use((req, res) => {
  if (isApiRequest(req)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Endpoint API tidak ditemukan!'
    });
  }
  res.status(404).render('404', { title: '404 - Not Found' });
});

//Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  if (isApiRequest(req)) {
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan internal pada server!'
    });
  }
  res.status(500).render('500', { title: '500 - Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});