const mysql = require("mysql2");

const db_connection = mysql
  .createConnection({
    host: "localhost", // HOST NAME
    user: "admin", // USER NAME
    database: "ampath", // DATABASE NAME
    password: "admins_password", // DATABASE PASSWORD
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

module.exports = db_connection;
