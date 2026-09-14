// const readline = require("readline")

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout  
// });
// rl.question("Name: ", (name) => {
//     console.log(`Hello ${name}`);
//     rl.close();
// });

const fs = require("fs");
const readline = require("readline");
const validator = require("validator");


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout

});

const fileName = "user0.json";

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

