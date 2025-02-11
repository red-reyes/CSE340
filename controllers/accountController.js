const utilities = require('../utilities')
const accountModel = require('../models/account-model');
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config();

// deliver login view
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

// deliver register view
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

// deliver manage view
async function buildManage(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/manage", {
    title: "Account Management",
    nav,
    errors: null,
  })
}

// deliver update view
async function buildUpdateAccount(req, res, next) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(req.params.account_id)
  res.render("account/update", {
    title: "Update Account Information",
    nav,
    userData: accountData,
    errors: null,
  })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function loginAccount(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 });
      if (process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      // Set session data
      req.session.user = {
        account_firstname: accountData.account_firstname,
        account_type: accountData.account_type,
      };
      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden');
  }
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
  } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }


  try {
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
} catch (error) {
  req.flash("notice", "Sorry, the registration failed.")
  res.status(501).render("account/register", {
    title: "Registration",
    nav,
    errors: null,
  });
}
}

/* ****************************************
 *  Process account management view
 * ************************************ */
async function manageAccount(req, res) {
  let nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(req.user.account_id)
  if (!accountData) {
    req.flash("notice", "Account not found.")
    return res.status(404).redirect("/account/login")
  }
  res.render("account/manage", {
    title: "Manage Account",
    nav,
    accountData,
    errors: null,
  })
}

/* ****************************************
 *  Process account update
 * ************************************ */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email } = req.body
  const account_id = req.user.account_id

  // Server-side validation
  if (!account_firstname || !account_lastname || !account_email) {
    req.flash('error', 'All fields are required.');
    return res.redirect(`/account/update/${account_id}`);
  }

  const updateResult = await accountModel.updateAccount(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process change password
 * ************************************ */
async function changePassword(req, res) {
  const userId = req.params.account_id;
  const { current_password, new_password, confirm_password } = req.body;

  if (new_password !== confirm_password) {
    req.flash('error', 'New password and confirm password do not match.');
    return res.redirect(`/account/update/${userId}`);
  }

  try {
    // Verify current password and update to new password in the database
    const accountData = await accountModel.getAccountById(userId);
    if (!accountData || !await bcrypt.compare(current_password, accountData.account_password)) {
      req.flash('error', 'Current password is incorrect.');
      return res.redirect(`/account/update/${userId}`);
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);
    await accountModel.updatePassword(userId, hashedPassword);
    req.flash('message', 'Password changed successfully.');
    res.redirect(`/account/update/${userId}`);
  } catch (error) {
    req.flash('error', 'Failed to change password.');
    res.redirect(`/account/update/${userId}`);
  }
}

/* ****************************************
 *  Process logout
 * ************************************ */
async function logoutAccount(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out.")
  res.redirect("/account/login")
}

module.exports = { 
  buildLogin,
  buildRegister,
  registerAccount,
  loginAccount,
  buildManage,
  manageAccount,
  updateAccount,
  logoutAccount,
  buildUpdateAccount,
  changePassword
}