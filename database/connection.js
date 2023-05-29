const mysql = require('mysql'); 
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: "",
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
  });
module.exports = connection;
