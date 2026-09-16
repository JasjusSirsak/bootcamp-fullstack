const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  const publicDir = path.join(__dirname, 'src');  //kita ga usah panggil file satupersatu, folder aja
  let reqUrl = req.url;   //path URL dari browser
  if (reqUrl === '/') {   //user membuka halaman utama "/", arahkan ke "home.html"
    reqUrl = '/home.html';
  } 
  else if (!path.extname(reqUrl)) {   //user mengetik rute tanpa / (misal: /about), otomatis tambahkan ".html"
    reqUrl += '.html';
  }

  const filePath = path.join(publicDir, reqUrl);   //gababungin menjadi path file yang lengkap di komputer
  const extname = path.extname(filePath);   //Cari tahu ekstensi filenya (html, css, js, dll.) untuk menentukan Content-Type
  let contentType = 'text/html'; // Defaultnya HTML btw

  if (extname === '.css') {
    contentType = 'text/css';
  } else if (extname === '.js') {
    contentType = 'application/javascript';
  }

  // readfile artinya apa kawan-kawan? Baca filenya
  fs.readFile(filePath, (err, content) => {
    if (err) {
      // Jika file tidak ditemukan (Error ENOENT), muat halaman 404.html
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(publicDir, '404.html'), (err404, notFoundContent) => {
          res.writeHead(404, { 'Content-Type': 'text/html' });
          res.end(notFoundContent || '<h1>404 Not Found</h1>');
        });
      } else {
        // Jika ada error server lainnya
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      // Jika file ketemu, kirim ke browser dengan Content-Type yang sesuai
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000/');
});
