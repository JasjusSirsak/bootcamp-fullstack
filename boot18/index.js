const fs = require('fs');
const path = require('path'); // buat jalan
const validator = require('validator');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const fileName = path.join(__dirname, 'user1.json'); //pakai path.join biar aman di semua OS

function loadUsers() { //buat memanggil data user
  if (!fs.existsSync(fileName)) return [];
  try {
    const fileContent = fs.readFileSync(fileName, 'utf-8');
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    return [];
  }
}

// Inisialisasi Yargs Form (komando1 untuk TAMBAH DATA )
yargs(hideBin(process.argv))
  .command({
    command: 'tambah',
    describe: 'Menambahkan data pengguna baru',
    builder: {
      nama: { alias: 'n', type: 'string', demandOption: true },
      email: { alias: 'e', type: 'string', demandOption: true },
      phone: { alias: 'p', type: 'string', demandOption: true }
    },
    handler(argv) {
      // Kita panggil loadUsers() di sini agar datanya selalu sinkron dengan user1.json
      const users = loadUsers();

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

//komando2 (untuk tampilan data; list)
.command({
    command: 'list',
    describe: 'Menampilkan daftar semua pengguna yang terdata',
    handler() {
      const users = loadUsers();
      if (users.length === 0) { //code untuk baca "berapa banyak unit kamu punya"
        console.log('Belum ada data pengguna yang terdata.'); //dan ganti "kosong" jadi "ga bisa"
        return;
      }

      console.log('\n=== DAFTAR PENGGUNA TERDATA ==='); //bagian list atas
      users.forEach((user, index) => {
        console.log(`${index + 1}. Nama  : ${user.name}`); //${index + 1} manggil data TAPI pake nomer urut "+1" biar ga mulai dari 0
        console.log(`   Email : ${user.email}`);
        console.log(`   HP    : ${user.phone}`);
        console.log('---------------------------------');
      });
    }
  })

  .help()
  .parse(); //standar terbaru Yargs untuk mengeksekusi perintah
