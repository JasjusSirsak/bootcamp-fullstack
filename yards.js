const fs = require('fs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const fileName = 'user1.json';

// ngmbil data lama
let users = [];
if (fs.existsSync(fileName)) {
  try {
    const fileContent = fs.readFileSync(fileName, 'utf-8');
    // jauhin error klo json kosong
    users = fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    users = [];
  }
}

// form
const argv = yargs(hideBin(process.argv))
  .option('nama', {
    alias: 'n',
    type: 'string',
    description: 'Nama pengguna',
    demandOption: true
  })
  .option('umur', {
    alias: 'u',
    type: 'number',
    description: 'Umur pengguna'
  })
  .help()
  .argv;

// ratain tuh data jadi kek table variable di array + simpendiJSON
const newUser = {
  nama: argv.nama,
  umur: argv.umur ?? 'tidak diisi'
};

users.push(newUser);

// Tulis kembali ke user1.json
fs.writeFileSync(fileName, JSON.stringify(users, null, 2));

console.log(`Berhasil disimpan ke ${fileName}! Halo ${argv.nama}, umur: ${argv.umur ?? 'tidak diisi'}`);