const fs = require('fs');
const validator = require('validator');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const fileName = 'user1.json';

// buat baca data kama, darai app.js
let users = [];
if (fs.existsSync(fileName)) {
  try {
    const fileContent = fs.readFileSync(fileName, 'utf-8');
    users = fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    users = [];
  }
}

// Inisialisasi Yargs Form
yargs(hideBin(process.argv))
  .command({
    command: 'tambah',
    describe: 'Menambahkan data pengguna baru',
    builder: {
      nama: {
        alias: 'n',
        type: 'string',
        demandOption: true,
        describe: 'Nama pengguna'
      },
      email: {
        alias: 'e',
        type: 'string',
        demandOption: true,
        describe: 'Email pengguna'
      },
      phone: {
        alias: 'p',
        type: 'string',
        demandOption: true,
        describe: 'Nomor HP Indonesia'
      }
    },
    handler(argv) {
      // Validasi Format Email
      if (!validator.isEmail(argv.email)) {
        console.log('Error: Format email tidak valid!');
        return;
      }

      // Validasi Format Nomor HP
      if (!validator.isMobilePhone(argv.phone, 'id-ID')) {
        console.log('Error: Nomor HP tidak valid untuk wilayah Indonesia!');
        return;
      }

      // VALIDASI TAMBAHAN: Cek Duplikasi (Email harus unik)
      const isDuplicate = users.some(user => user.email === argv.email);
      if (isDuplicate) {
        console.log('Error: Email ini sudah terdaftar!');
        return;
      }

      // Jika lolos semua validasi -> Simpan ke JSON
      const newUser = {
        name: argv.nama,
        email: argv.email,
        phone: argv.phone,
        isActive: true
      };

      users.push(newUser);
      fs.writeFileSync(fileName, JSON.stringify(users, null, 2));

      console.log(`\nTerima kasih ${argv.nama}, data kamu berhasil dicatat secara valid!`);
    }
  })
  .help()
  .parse(); //standar terbaru Yargs untuk mengeksekusi perintah
