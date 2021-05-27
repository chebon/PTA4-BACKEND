const db_connection = require("../db-connection").promise();

// INSERTING DIAGNOSIS
exports.insert = async (req, res, next) => {

  if (!req.body.patient_id || !req.body.location_id || !req.body.encounter_datetime || !req.body.htn_status || !req.body.dm_status) {
    return res.status(400).json({
      message: "Please fill in all the required fields.",
      fields: ["diagnosis"],
    });
  }

  try {

    const [rows] = await db_connection.execute(
      "INSERT INTO `flat_cdm_summary`(`patient_id`, `location_id`, `encounter_datetime`, `htn_status`, `dm_status`) VALUES(?, ?, ?, ?, ?)",
      [req.body.patient_id, req.body.location_id, req.body.encounter_datetime, req.body.htn_status, req.body.dm_status]
    );

    if (rows.affectedRows === 1) {
      return res.status(201).json({
        message: "The Flat CDM SUMMARY has been successfully inserted.",
        cdmId: rows.insertId,
      });
    }

  } catch (err) {
    next(err);
  }

};

// FETCHING monthly report for patients
exports.reportMonthly = async (req, res, next) => {
  try {

    const [rows] = await db_connection.execute("SELECT * FROM `flat_cdm_summary`");

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

exports.report = async (req, res, next) => {
  try {

    const [rows] = await db_connection.execute("SELECT * FROM `flat_cdm_summary` GROUP BY 'location_id'");

    if (rows.length === 0) {
      return res.status(200).json({
        message:
          "There are no patient in the database, please insert some patient.",
      });
    }

    let data = [];

    for (const val of rows) {
      if (data.includes(val.location_id)) {
        data[val.location_id].newHypertensitive = data[val.location_id].newHypertensitive + 1

      } else {
        obj = {}
        if (val.htn_status === 0) {
          obj.newHypertensitive = 0
          obj.knownHypertensitive = 1
        } else if (val.htn_status === 7285) {
          obj.newHypertensitive = 1
          obj.knownHypertensitive = 0
        } else if (val.htn_status === 7285) {
          obj.newHypertensitive = 0
          obj.knownHypertensitive = 1
        }
        data[val.location_id] = obj

      }

    }

    res.status(200).json(data);

  } catch (err) {
    next(err);
  }

};


