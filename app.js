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

rl.question("Nama: ", (name) => {
    rl.question("Email: ", (email) => {
        rl.question("No HP: ", (phone) => {

            // ini buat organisasiin variable mentah
            const newUser = {
                name,
                email,
                phone,
                isActive: true
            };

            // lempar ke array di json
            users.push(newUser);
            fs.writeFileSync(fileName, JSON.stringify(users, null, 2));

            console.log(`Data milik ${name} berhasil di tambahkan`);
            rl.close();
        });
    });
});