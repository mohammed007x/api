const Pool = require("pg").Pool;
//Amood123edc123edc123edc

// const pool = new Pool({
//   user: "postgres",
//   host: "localhost",
//   database: "store",
//   password: "amood123",
//   port: 5432,
// });
const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require",
});

module.exports = pool;
