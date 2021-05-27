const db_connection = require("../db-connection").promise();

// INSERTING LOCATION
exports.insert = async (req, res, next) => {

  if (!req.body.name) {
    return res.status(400).json({
      message: "Please fill in all the required fields.",
      fields: ["name"],
    });
  }

  try {
      
    const [rows] = await db_connection.execute(
      "INSERT INTO `location`(`name`) VALUES(?)",
      [req.body.name]
    );

    if (rows.affectedRows === 1) {
      return res.status(201).json({
        message: "The location has been successfully inserted.",
        LocationID: rows.insertId,
      });
    }

  } catch (err) {
    next(err);
  }
  
};

// FETCHING ALL LOCATIONS
exports.fetch = async (req, res, next) => {
  try {

    const [rows] = await db_connection.execute("SELECT * FROM `location`");

    if (rows.length === 0) {
      return res.status(200).json({
        message:
          "There are no locations in the database, please insert some location.",
      });
    }

    res.status(200).json(rows);

  } catch (err) {
    next(err);
  }

};


// FETCHING SINGLE USER
exports.getUserByID = async (req, res, next) => {

  try {

    const [row] = await db_connection.execute(
        "SELECT * FROM `users` WHERE `id`=?",
        [req.params.id]
    );

    if (row.length === 0) {
      return res.status(404).json({
        message: "No User Found!",
      });
    }

    res.status(200).json(row[0]);

  } catch (err) {
    next(err);
  }

};


