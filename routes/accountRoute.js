// account routes
const express = require('express');
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities");
const regValidate = require('../utilities/account-validation')

// Deliver login view
router.get('/login', utilities.handleErrors(accountController.buildLogin));

// Deliver register view
router.get('/register', utilities.handleErrors(accountController.buildRegister))

// Process Registration
router.post(
    '/register',
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;