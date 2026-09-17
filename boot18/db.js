const fs = require('fs');
const path = require('path');

const fileName = path.join(__dirname, 'users.json');

function loadUsers() {
  if (!fs.existsSync(fileName)) return [];
  try {
    const fileContent = fs.readFileSync(fileName, 'utf-8');
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    return [];
  }
}

function saveUsers(users) {
  fs.writeFileSync(fileName, JSON.stringify(users, null, 2));
}

function addUser(user) {
  const users = loadUsers();
  users.unshift(user);
  saveUsers(users);
  return user;
}

function findUserByName(name) {
  const users = loadUsers();
  return users.find(u => u.name === name);
}

//find user by phone biar unik karena email takut ada yang duplikasi dan nama pula sama
function findUserByPhone(phone) {
  const users = loadUsers();
  return users.find(u => u.phone === phone);
}

module.exports = {
  loadUsers,
  saveUsers,
  addUser,
  findUserByName,
  findUserByPhone
};