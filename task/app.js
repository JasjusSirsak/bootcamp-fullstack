// const fs = require("fs");
// const users = require('./user')
// //write data untuk file
// fs.writeFileSync("user.json",JSON.stringify(users,null,2))

// const data = fs.readFileSync("user.json","utf-8");
// console.log (data)
// const parsedUser = JSON.parse(data)
// console.log(parsedUser);
// //console.log(parsedUser[0].name)

const fs = require("fs");
const readline = require("readline");
const validator = require("validator");


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});

const fileName = "user.json";

// cegahin data loss
let users = [];
if (fs.existsSync(fileName)) {
    const fileContent = fs.readFileSync(fileName, "utf-8");
    users = JSON.parse(fileContent);
}

const question = (pertanyaan) => {
    return new Promise((resolve) => {
        rl.question(pertanyaan, (jawaban) => {
            resolve(jawaban);
        });
    });
};

const main = async () => {
    let name = "";
    while (!name.trim()) {
        name = await question("Nama: ");
        if (!name.trim()) {
          console.log("Nama tidak boleh kosong!");
        }
    }

    // Paksa ulang kalo format salah
    let email = "";
    while (!validator.isEmail(email)) {
        email = await question("Email: ");
        if (!validator.isEmail(email)) {
            console.log("Format email tidak valid! Silakan masukkan email yang benar.\n");
        }
    }

    let phone = "";
    while (!validator.isMobilePhone(phone, "id-ID")) {
        phone = await question("No HP: ");
        if (!validator.isMobilePhone(phone, "id-ID")) {
            console.log("Nomor HP tidak valid untuk wilayah Indonesia ('id-ID')! Contoh: 081234567890\n");
        }
    }

    // kalau semua nya bener -> baru simpan ke JSON
    const newUser = { name, email, phone, isActive: true };
    users.push(newUser);
    fs.writeFileSync(fileName, JSON.stringify(users, null, 2));

    console.log(`\nTerima kasih ${name}, data kamu berhasil dicatat secara valid!`);
    
    rl.close();
};

main()

// const main = async () => {
//     const name = await question("Nama: ");
//     const email = await question("Email: ");
//     const phone = await question("No HP: ");

//     if (!validator.isEmail(email)) {
//         console.log("Format email tidak valid");
//         // return; // Hentiin fungsi utama
//     }
    
//     if (!validator.isMobilePhone(phone, 'id-ID')) {
//         console.log("Nomor HP tidak valid");
//         // rl.close();
//     }
    
//     rl.close();
//     // lolos validasi > langsung jadi json
//     const newUser = { name, email, phone, isActive: true };
//     users.push(newUser);
//     fs.writeFileSync(fileName, JSON.stringify(users, null, 2));

//     console.log(`Terima kasih ${name}, data kamu berhasil dicatat!`);
//     rl.close();
// };

// main();

// module.exports = { question, rl };

// rl.question("Nama: ", (name) => {
//     rl.question("Email: ", (email) => {
//         rl.question("No HP: ", (phone) => {

//             // ini buat organisasiin variable mentah
//             const newUser = {
//                 name,
//                 email,
//                 phone,
//                 isActive: true
//             };

//             // lempar ke array di json
//             users.push(newUser);
//             fs.writeFileSync(fileName, JSON.stringify(users, null, 2));

//             console.log(`Data milik ${name} berhasil di tambahkan`);
//             rl.close();
//         });
//     });
// });