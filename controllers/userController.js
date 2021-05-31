const db_connection = require("../db-connection").promise();

// INSERTING PATIENT
exports.insert = async (req, res, next) => {

  if (!req.body.name) {
    return res.status(400).json({
      message: "Please fill in all the required fields.",
      fields: ["name", "email"],
    });
  }

  try {
      
    const [rows] = await db_connection.execute(
      "INSERT INTO `patient`(`name`,`gender`, `dob`, `phone_number`) VALUES(?, ?, ?, ?)",
      [req.body.name, req.body.gender, req.body.dob, req.body.phone_number]
    );

    if (rows.affectedRows === 1) {
      return res.status(201).json({
        message: "The patient has been successfully inserted.",
        userID: rows.insertId,
      });
    }

  } catch (err) {
    next(err);
  }
  
};

// FETCHING ALL PATIENT
exports.getAllUsers = async (req, res, next) => {
  try {

    const [rows] = await db_connection.execute("SELECT * FROM `patient`");

    if (rows.length === 0) {
      return res.status(200).json({
        message:
          "There are no patient in the database, please insert some patient.",
      });
    }

    res.status(200).json(rows);

  } catch (err) {
    next(err);
  }

};

// SEARCHING PATIENTS
exports.search = async (req, res, next) => {
  try {

    const [row] = await db_connection.execute(
        "SELECT * FROM `patient` WHERE `name` REGEXP?",
        [req.body.name]
    );

    if (row.length === 0) {
      return res.status(404).json({
        message: "No Patient Found!",
      });
    }

    res.status(200).json(row);

  } catch (err) {
    next(err);
  }

};


// FETCHING SINGLE PATIENT
exports.getUserByID = async (req, res, next) => {

  try {

    const [row] = await db_connection.execute(
        "SELECT * FROM `patient` WHERE `id`=?",
        [req.params.id]
    );

    if (row.length === 0) {
      return res.status(404).json({
        message: "No Patient Found!",
      });
    }

    res.status(200).json(row[0]);

  } catch (err) {
    next(err);
  }

};

// UPDATING PATIENT
exports.updateUser = async (req, res, next) => {
  try {

    const [row] = await db_connection.execute(
        "SELECT * FROM `patient` WHERE `id`=?",
        [req.params.id]
    );

    if (row.length === 0) {
      return res.status(404).json({
        message: "Invalid patient ID",
      });
    }

    if (req.body.name) row[0].name = req.body.name;

    if (req.body.email) row[0].email = req.body.email;

    const [update] = await db_connection.execute(
      "UPDATE `patient` SET `name`=?, `email`=? WHERE `id`=?",
      [row[0].name, row[0].email, req.params.id]
    );

    if (update.affectedRows === 1) {
      return res.json({
        message: "The Patient has been successfully updated.",
      });
    }

  } catch (err) {
    next(err);
  }

};

