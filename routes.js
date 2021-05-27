const router = require('express').Router();
const validators = require('./validators');
const userController = require('./controllers/userController');
const locationController = require('./controllers/locationController');
const summaryController = require('./controllers/summaryController');

// Inserting User
router.post(
    '/insert-user',
    validators.userInfo,
    validators.result,
    userController.insert
);

// Inserting Location
router.post(
    '/insert-location',
    validators.locationInfo,
    validators.result,
    locationController.insert
);

// Fetch All Location
router.get(
    '/locations',
    validators.locationInfo,
    validators.result,
    locationController.fetch
);

//Search
router.post(
    '/search',
    validators.searchInfo,
    validators.result,
    userController.search
);

//Search
router.post(
    '/summary',
    validators.searchInfo,
    validators.result,
    summaryController.report
);
router.post(
    '/report/monthly',
    validators.searchInfo,
    validators.result,
    summaryController.reportMonthly
);


// Inserting CDM
router.post(
    '/insert-cdm',
    validators.cdmInfo,
    validators.result,
    summaryController.insert
);

// Fetching all users
router.get(
    '/get-all-patients',
    userController.getAllUsers
);

// Fetching Single User By ID
router.get(
    '/get-user/:id',
    validators.userID,
    validators.result,
    userController.getUserByID
);

// Updating User
router.patch(
    '/update-user/:id',
    [...validators.userID, ...validators.userInfo],
    validators.result,
    userController.updateUser
);

module.exports = router;
