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
async function buildRegister(req, res,) {
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
      req.flash("message notice", "Please check your credentials and try again.");
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
  const { account_firstname, account_lastname, account_email, account_password } = req.body;
  let hashedPassword;
  try {
    // Hash the password
    hashedPassword = await bcrypt.hash(account_password, 10);
  } catch (error) {
    req.flash('error', 'Error hashing password.');
    return res.redirect('/account/register');
  }

  try {
    const result = await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword);
    if (result.rowCount > 0) {
      req.flash('success', 'Account successfully created. Please log in.');
      res.redirect('/account/login');
    } else {
      req.flash('error', 'Account creation failed.');
      res.redirect('/account/register');
    }
  } catch (error) {
    req.flash('error', 'An error occurred while creating the account.');
    res.redirect('/account/register');
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
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email } = req.body;
  const account_id = req.user.account_id;

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
  );

  if (updateResult) {
    req.flash("notice", "Account updated successfully.");
    res.redirect("/account/update/${account_id}");
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

/* ****************************************
 *  Delete Account
 * ************************************ */
async function deleteAccount(req, res) {
  const account_id = req.params.account_id;
  try {
    const deleteResult = await accountModel.deleteAccountById(account_id);
    if (deleteResult) {
      req.session.destroy((err) => {
        if (err) {
          req.flash('error', 'Error logging out after account deletion.');
          return res.redirect(`/account/update/${account_id}`);
        }
        res.clearCookie('jwt');
        req.flash('success', 'Account successfully deleted.');
        res.redirect('/account/login');
      });
    } else {
      req.flash('error', 'Deletion unsuccessful, try again.');
      res.redirect(`/account/update/${account_id}`);
    }
  } catch (error) {
    req.flash('error', 'An error occurred while deleting the account.');
    res.redirect(`/account/update/${account_id}`);
  }
}

// Manage Others for 'Admin'
// deliver manage others view
async function buildManageOthers(req, res, next) {
  let nav = await utilities.getNav();
  const clients = await accountModel.getAllClients(); // Assuming you have a function to get all clients
  res.render("account/manageothers", {
    title: "Manage Clients",
    nav,
    clients,
    errors: null,
  });
}
/* ****************************************
 *  Suspend Client
 * ************************************ */
async function suspendClient(req, res) {
  try {
    await accountModel.updateAccountStatus(account_id, 'suspended');
    req.flash('success', 'Client account suspended successfully.');
  } catch (error) {
    req.flash('error', 'Error suspending client account.');
  }
  res.redirect('/account/manageothers');
}

/* ****************************************
 *  Activate Client
 * ************************************ */
async function activateClient(req, res) {
  try {
    await accountModel.updateAccountStatus(req.body.account_id, 'active');
    req.flash('success', 'Client account activated successfully.');
  } catch (error) {
    req.flash('error', 'Error activating client account.');
  }
  res.redirect('/account/manageothers');
}

/* ****************************************
 *  Delete Client
 * ************************************ */
async function deleteClient(req, res) {
  try {
    await accountModel.deleteAccount(req.body.account_id);
    req.flash('success', 'Client account deleted successfully.');
  } catch (error) {
    req.flash('error', 'Error deleting client account.');
  }
  res.redirect('/account/manageothers');
}

/* ****************************************
 *  Reset Client Password
 * ************************************ */
async function resetClientPassword(req, res) {
  const newPassword = 'newPassword123';
  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await accountModel.updateAccountPassword(req.body.account_id, hashedPassword);
    req.flash('success', 'Client password reset successfully.');
  } catch (error) {
    req.flash('error', 'Error resetting client password.');
  }
  res.redirect('/account/manageothers');
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
  changePassword,
  deleteAccount
}