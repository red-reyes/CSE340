// account routes
const express = require('express');
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

// Deliver login view
router.get('/login', utilities.handleErrors(accountController.buildLogin));
// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.loginAccount)
);

// Deliver register view
router.get('/register', utilities.handleErrors(accountController.buildRegister));
// Process Registration
router.post(
    '/register',
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Unit 5 Deliver account management view *******************
// JWT Authorization Activity
// router.get(
//     '/', 
//     utilities.checkLogin,
//     utilities.handleErrors(accountController.buildManage)
// );


module.exports = router;