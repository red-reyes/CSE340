// account routes
const express = require('express');
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation');

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
router.get(
    '/', 
    utilities.checkLogin,
    utilities.handleErrors(accountController.buildManage)
);

// Deliver account update view
router.get(
    '/update/:account_id', 
    utilities.checkLogin, 
    utilities.handleErrors(accountController.buildUpdateAccount)
);

// Process account update
router.post(
    '/update/:account_id', 
    utilities.checkLogin, 
    regValidate.updateAccountRules(),
    regValidate.checkUpdateAccountData,
    utilities.handleErrors(accountController.updateAccount)
);

// Process password change
router.post(
    '/change-password/:account_id', 
    utilities.checkLogin, 
    regValidate.passwordChangeRules(),
    regValidate.checkPasswordChangeData,
    utilities.handleErrors(accountController.changePassword)
);

// Process logout
router.get('/logout', utilities.handleErrors(accountController.logoutAccount));

// Delete Account
router.post('/delete/:account_id', accountController.deleteAccount);

module.exports = router;