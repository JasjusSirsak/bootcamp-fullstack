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

// Inisialisasi Yargs Form (komando1 untuk TAMBAH DATA ) ------------------------
yargs(hideBin(process.argv))
  .command({
    command: 'tambah',
    describe: 'tambah new user',
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
        return; //kalau ga ada ini, nanti ngelanjut bre
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

      users.push(newUser); //nambah data baru
      fs.writeFileSync(fileName, JSON.stringify(users, null, 2)); //menulis data ke json

      console.log(`\nTerima kasih ${argv.nama}, data kamu berhasil dicatat secara valid!`); //tampilin data yang berhasil
    }
  })

//komando2 (untuk tampilan data; list) -----------------
.command({
  command: 'list',
  describe: 'Menampilkan daftar semua pengguna yang terdata',
  handler() {
    const users = loadUsers(); //memanggil data user
    if (users.length === 0) { //code untuk baca "berapa banyak data gwah punya
      console.log('Belum ada data pengguna yang terdata.'); //dan ganti "kosong" jadi "ga bisa"
      return;
    }

    console.log('\n=== DAFTAR PENGGUNA TERDATA ==='); //bagian list atas, btw "\n" artinya baris baru
    users.forEach((user, index) => { 
    console.log(`${index + 1}. Nama  : ${user.name}`); //${index + 1} manggil data TAPI pake nomer urut "+1" biar ga mulai dari 0
    console.log(`   Email : ${user.email}`); //ini mah sama aja kayak diatas, bedanya ini manggil email
    console.log(`   HP    : ${user.phone}`); //ini manggil nomor hp
    console.log('---------------------------------'); //pembatas antar data, kalau pakai console.log, artinya di munculin
      });
    }
  })

//komando2 (untuk tampilan data; list) -----------------
.command({
    command: 'detail',
    describe: 'Cari detail user berdasarkan nama',
    builder:{
        name:{ alias: 'n', type: 'string', demandOption: true }
    },
    handler(argv) {
        const users = loadUsers();
        const user = users.find(user => user.name === argv.name); //cari user nya bre
        if (!user) {
            console.log(`Error: Nama ${argv.name} tidak ditemukan!`); 
            return;
        }
        console.log(`\n=== DETAIL PENGGUNA ===`);
        console.log(`Nama  : ${user.name}`);
        console.log(`Email : ${user.email}`);
        console.log(`HP    : ${user.phone}`);
        console.log(`Status: ${user.isActive ? 'Aktif' : 'Tidak Aktif'}`);
    }
})

// komando4 (untuk memperbarui data array euh) -----------------
.command({
  command: 'update',
  describe: 'Ganti data user',
  builder: {
    nama: { alias: 'n', type: 'string', demandOption: true, describe: 'Nama lama' },
    namaBaru: { alias: 'b', type: 'string', demandOption: false, describe: 'Nama baru' },
    email: { alias: 'e', type: 'string', demandOption: false },
    phone: { alias: 'p', type: 'string', demandOption: false }
  },
handler(argv) {
  const users = loadUsers(); //jan lup copas untuk panggil data dari atas
  const userIndex = users.findIndex(user => user.name.toLowerCase() === argv.nama.toLowerCase()); //kita panggil dari nama, terus nama juga bisa di hapus

if (userIndex === -1) {
  console.log(`Error: Pengguna "${argv.nama}" tidak ditemukan!`);
  return;
}

if (argv.email && !validator.isEmail(argv.email)) {
  console.log('Error: Format email baru tidak valid!');
  return;
}
    
if (argv.phone && !validator.isMobilePhone(argv.phone, 'id-ID')) {
  console.log('Error: Nomor HP baru tidak valid untuk wilayah Indonesia!');
 return;
}

//Update data (pake data baru klo diisi, ga? balik lagi ke data lama)
if (argv.namaBaru) users[userIndex].name = argv.namaBaru;
if (argv.email) users[userIndex].email = argv.email;
if (argv.phone) users[userIndex].phone = argv.phone;

fs.writeFileSync(fileName, JSON.stringify(users, null, 2));
console.log(`\nBerhasil memperbarui data pengguna "${users[userIndex].name}"!`);
}
})

// komando5 (untuk menghapus data pengguna) -----------------
.command({
  command: 'hapus',
  describe: 'Hapus user',
  builder: {
    nama: { alias: 'n', type: 'string', demandOption: true }
  },
  handler(argv) {
    const users = loadUsers();

    // Filter array: ambil SEMUA user KECUALI yang namanya sama dengan argv.nama
    const newUsers = users.filter(user => user.name.toLowerCase() !== argv.nama.toLowerCase());

    // kayak validator, ini kita harus cek apa datanya ke hapus atau kagak (aka error)
    if (users.length === newUsers.length) {
      console.log(`Error: Pengguna dengan nama "${argv.nama}" tidak ditemukan!`);
      return;
    }

    //Simpan data hasil filter yang baru ke JSON
    fs.writeFileSync(fileName, JSON.stringify(newUsers, null, 2));

    console.log(`\nBerhasil menghapus pengguna "${argv.nama}" dari data!`);
  }
})

.help()
.parse(); //standar terbaru Yargs untuk mengeksekusi perintah
