const mysql = require("mysql2");

const db_connection = mysql
  .createConnection({
    host: "142.93.103.37", // HOST NAME
    user: "test_user", // USER NAME
    database: "testDB", // DATABASE NAME
    password: "Eek6FEuxS7Y8IGlV@2021", // DATABASE PASSWORD
  })
  .on("error", (err) => {
    console.log("Failed to connect to Database - ", err);
  });

module.exports = db_connection;
