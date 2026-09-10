const fs = require("fs");
const users = require('./user')
//write data untuk file
fs.writeFileSync("user.json",JSON.stringify(users,null,2))

const data = fs.readFileSync("user.json","utf-8");
console.log (data)
const parsedUser = JSON.parse(data)
console.log(parsedUser);
//console.log(parsedUser[0].name)

