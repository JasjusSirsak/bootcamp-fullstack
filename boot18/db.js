//dia yang ngambil kunci env buat ke database
require('dotenv').config(); 
const { Pool } = require('pg')
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

//ini teh fungsi
async function getUsers() {
  const result = await pool.query('SELECT * FROM users ORDER BY id');
  return result.rows;
}
//coba ini teh buat manggil data
// async function jalanin() {
//   try {
//     console.log("berhasil tersambung, data table;")
//     console.table(getUsers());
//       } catch (error) {
//             console.error("Waduh, ada error nih ❌ :", error.message);
//   } finally {
//       }
// }

getUsers()
  .then(data => console.log(data))
  .catch(err => console.error ('error fetching user',err));

    