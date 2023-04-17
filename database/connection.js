const mysql = require('mysql');
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "0505",
    database: "dbapi"
  });
  module.exports = connection;
