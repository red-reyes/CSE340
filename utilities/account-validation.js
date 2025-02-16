const accountModel = require("../models/account-model");
const utilities = require(".");
const { body, validationResult } = require("express-validator");

const validate = {};

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
  
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),
  
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email");
        }
      }),
  
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

// Login Validation Rules
validate.loginRules = () => {
  return [
    body('account_email')
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage('A valid email is required.'),
    
    body('account_password')
      .trim()
      .notEmpty()
      .withMessage('Password is required.'),
  ];
};

// Update Account Validation Rules
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),
    
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isString()
      .isLength({ min: 1 })
      .withMessage("Please provide a last name."),
    
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists && account_email !== req.user.account_email) {
          throw new Error("Email exists. Please use a different email");
        }
      }),
  ];
};

// Password Change Validation Rules
validate.passwordChangeRules = () => {
  return [
    body("new_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
    
    body("confirm_password")
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.new_password) {
          throw new Error("Password confirmation does not match password");
        }
        return true;
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/register', {
      errors: errors.array(),
      title: 'Registration',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render('account/login', {
      errors,
      title: 'Login',
      nav,
      account_email,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to update account
 * ***************************** */
validate.checkUpdateAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render(`account/update/${req.params.userId}`, {
      errors: errors.array(),
      title: 'Update Account Information',
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to change password
 * ***************************** */
validate.checkPasswordChangeData = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render(`account/update/${req.params.userId}`, {
      errors,
      title: 'Update Account Information',
      nav,
    });
    return;
  }
  next();
};

module.exports = validate;