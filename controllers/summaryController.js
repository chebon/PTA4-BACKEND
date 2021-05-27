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

    const [rows] = await db_connection.execute(
      //"SELECT * FROM `flat_cdm_summary` WHERE `location_id` = ?", [req.params.location_id]
      "SELECT * FROM `flat_cdm_summary` WHERE `location_id` = ?",
      [req.body.location_id]
      );

    if (rows.length === 0) {
      return res.status(200).json({
        message:
          "There are no patient in the database, please insert some patient.",
      });
    }

    let data = [];
    
    for (const val of rows) {
      let user = await db_connection.execute(
        "SELECT * FROM `patient` WHERE `patient_id` = ?",
        [val.patient_id]
        
    );
    val.user = user[0]
      
    }

    res.status(200).json({rows});

  } catch (err) {
    next(err);
  }

};

exports.report = async (req, res, next) => {
  try {

    const [rows] = await db_connection.execute("SELECT * FROM `flat_cdm_summary`");

    if (rows.length === 0) {
      return res.status(200).json({
        message:
          "There are no patient in the database, please insert some patient.",
      });
    }

    let data = [];
    let indexVal = 0

    for (const val of rows) {
     indexval = indexVal + 1
      obj = { newHypertensitive: 0, knownHypertensitive: 0, newDiabetic: 0, knownDiabetic:0 }
      dataperser = { location: val.location_id, info: obj }
   

      if (data.includes(val.location_id)) {

        if (typeof (data[val.location_id].newHypertensitive) === 'undefined') {
          obj.newHypertensitive = 1
          obj.knownHypertensitive = 1
        } else {
          obj.newHypertensitive = data[val.location_id].newHypertensitive + 1
          obj.knownHypertensitive = data[val.location_id].knownHypertensitive + 1
        }


        if (typeof (data[val.location_id].newDiabetic) === 'undefined') {
          obj.newDiabetic = 1
          obj.knownDiabetic = 1
        } else {
          obj.newDiabetic = data[val.location_id].newDiabetic + 1
          obj.knownDiabetic = data[val.location_id].knownDiabetic + 1
        }


        for (const dataval of data) {
                   if(typeof(dataval) !== 'object'){
data.splice(dataval, 1);
continue
}

          if (dataval.location && dataval.location === val.location_id && data.length > 0) {

            obj.newHypertensitive = dataval.info.newHypertensitive + 1;
            obj.knownHypertensitive = dataval.info.knownHypertensitive + 1;
          }

          if (dataval.location && dataval.location === val.location_id && data.length > 0) {
            obj.newDiabetic = dataval.info.newDiabetic + 1;
            obj.knownDiabetic = dataval.info.knownDiabetic + 1;
          }

        }

      } else {
        data.push(val.location_id)
        data[val.location_id] = dataperser
        if (val.htn_status === 0) {
          obj.newHypertensitive = 0
          obj.knownHypertensitive = 0
        } else if (val.htn_status === 7285) {
          obj.newHypertensitive = 1
          obj.knownHypertensitive = 0
        } else if (val.htn_status === 7286) {
          obj.newHypertensitive = 0
          obj.knownHypertensitive = 1
        } else {
          obj.newHypertensitive = 0
          obj.knownHypertensitive = 0
        }

        if (val.dm_status === 0) {
          obj.newDiabetic = 0
          obj.knownDiabetic = 0
        } else if (val.dm_status === 7281) {
          obj.newDiabetic = 1
          obj.knownDiabetic = 0
        } else if (val.dm_status === 7282) {
          obj.newDiabetic = 0
          obj.knownDiabetic = 1
        } else {
          obj.newDiabetic = 0
          obj.knownDiabetic = 0
        }

      }
      dataperser = { location: val.location_id, info: obj }
      data[val.location_id] = dataperser
    }

    for (const responposeData of data) {
      if(typeof(responseData) !== 'object'){
        data.splice(responposeData, 1);
      }
    }

    data.splice(-1,1)

for(const cleanData of data){
  if(typeof(cleanData) !== 'object'|| cleanData == null){
        data.splice(cleanData, 1);
}
}

 data = data.filter(function (el) {
  return el != null;
});


    res.status(200).json(data);

  } catch (err) {
    next(err);
  }

};


