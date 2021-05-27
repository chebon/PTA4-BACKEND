const db_connection = require("./db-connection").promise();
const { body, param, validationResult } = require("express-validator");

module.exports = {
  // Patient info Validation
  userInfo: [
    body("name", "The name must be of minimum 3 characters length")
      .optional()
      .isLength({ min: 3 })
      .trim()
      .unescape()
      .escape(),

    body("dob", "Invalid date for DOB")
      .optional()
      .trim()
      .isDate()
      .unescape()
      .escape(),
  ],

  //Location Validation
  locationInfo: [
    body("name", "The name must be of minimum 3 characters length")
      .optional()
      .isLength({ min: 3 })
      .trim()
      .unescape()
      .escape(),
  ],

 //Search Validation
  searchInfo: [
    body("name", "The name must be of minimum 3 characters length")
      .optional()
      .isLength({ min: 2 })
      .trim()
      .unescape()
      .escape(),
  ],

    // diagnosis Validation
    cdmInfo: [
        body("htn_status", "The name must be of minimum 3 characters length")
          .optional()
          .isLength({ min: 3 })
          .trim()
          .unescape()
          .escape(),
      ],
    

  // User ID Validation
  userID: [param("id", "Invalid User ID").trim().isInt()],

  // Checking Validation Result
  result: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  },
};
