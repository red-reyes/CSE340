const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid;
  if(data.length > 0){
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => { 
      grid += '<li>';
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
* Build the account login view HTML
* ************************************ */
Util.buildLoginView = function() {
  let loginView = `
    <form id= "loginForm" action="/account/login" method="post">

        <label for="email">Email:</label>
        <input type="email" id="email" name="account_email" required>

        <label for="password">Password:</label>
        <input type="password" id="password" name="account_password" required>

        <button type="submit">Login</button>
    </form>
  `;
  return loginView;
};

/* **************************************
* Build the account registration view HTML
* ************************************ */
Util.buildRegisterView = function() {
  let registerView = `
    <form id="registerForm" action="/account/register" method="post">

        <label for="first_name">First Name:</label>
        <input type="text" id="firstname" name="account_firstname" required>

        <label for="last_name">Last Name:</label>
        <input type="text" id="lastname" name="account_lastname" required>

        <label for="email">Email:</label>
        <input type="email" id="email" name="account_email" required>

        <label for="password">Password:</label>
        <input type="password" id="password" name="account_password" required>

        <button type="submit">Register</button>
    </form>
  `;
  return registerView;
};

/* **************************************
* Build the add classification view HTML
* ************************************ */
Util.buildAddClassificationView = function() {
  let addClassificationView = `
    <form id="addClassificationForm" action="/classification/add" method="POST">
      <label for="classification_name">Classification Name:</label>
      <input type="text" id="classification_name" name="classification_name" required>
      
      <button type="submit">Add Classification</button>
    </form>
  `;
  return addClassificationView;
};

/* **************************************
* Build the classification list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
};

/* **************************************
* Build the add inventory view HTML
* ************************************ */
Util.buildAddInventoryView = function() {
  let addInventoryView = `
    <form id="addInventoryForm" action="/inventory/add" method="POST">
      <label for="inv_make">Make:</label>
      <input type="text" id="inv_make" name="inv_make" required>
      
      <label for="inv_model">Model:</label>
      <input type="text" id="inv_model" name="inv_model" required>
      
      <label for="inv_year">Year:</label>
      <input type="number" id="inv_year" name="inv_year" required>
      
      <label for="inv_description">Description:</label>
      <textarea id="inv_description" name="inv_description" required></textarea>
      
      <label for="inv_price">Price:</label>
      <input type="number" id="inv_price" name="inv_price" required>
      
      <label for="inv_miles">Miles:</label>
      <input type="number" id="inv_miles" name="inv_miles" required>
      
      <label for="inv_color">Color:</label>
      <input type="text" id="inv_color" name="inv_color" required>
      
      <button type="submit">Add Inventory</button>
    </form>
  `;
  return addInventoryView;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in");
      res.clearCookie("jwt");
      return res.redirect("/account/login");
     }
     res.locals.accountData = accountData;
     res.locals.loggedin = 1;
     next();
    });
  } else {
   next();
  }
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 *  Check Account Type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  const accountType = res.locals.accountData.account_type;
  if (accountType === 'Employee' || accountType === 'Admin') {
    next();
  } else if (accountType === 'Client') {
    req.flash("notice", "Clients do not have the required permissions to access this resource.");
    return res.redirect("/account/login");
  } else {
    req.flash("notice", "You do not have the required permissions to access this resource.");
    return res.redirect("/account/login");
  }
};

/* **************************************
* Build the edit inventory item view HTML
* ************************************ */
Util.buildEditInventoryItemView = function(vehicle) {
  let editInventoryView = `
    <form id="editInventoryForm" action="/inventory/edit/${vehicle.inv_id}" method="POST">
      <label for="inv_make">Make:</label>
      <input type="text" id="inv_make" name="inv_make" value="${vehicle.inv_make}" required>
      
      <label for="inv_model">Model:</label>
      <input type="text" id="inv_model" name="inv_model" value="${vehicle.inv_model}" required>
      
      <label for="inv_year">Year:</label>
      <input type="number" id="inv_year" name="inv_year" value="${vehicle.inv_year}" required>
      
      <label for="inv_description">Description:</label>
      <textarea id="inv_description" name="inv_description" required>${vehicle.inv_description}</textarea>
      
      <label for="inv_price">Price:</label>
      <input type="number" id="inv_price" name="inv_price" value="${vehicle.inv_price}" required>
      
      <label for="inv_miles">Miles:</label>
      <input type="number" id="inv_miles" name="inv_miles" value="${vehicle.inv_miles}" required>
      
      <label for="inv_color">Color:</label>
      <input type="text" id="inv_color" name="inv_color" value="${vehicle.inv_color}" required>
      
      <button type="submit">Update Inventory</button>
    </form>
  `;
  return editInventoryView;
};

/* **************************************
* Build the management view HTML
* ************************************ */
Util.buildManagementView = async function() {
  let data = await invModel.getClassifications();
  let managementView = `
    <h1>Management View</h1>
    <div>
      <h2>Classifications</h2>
      <ul>
  `;
  data.rows.forEach((row) => {
    managementView += `<li>${row.classification_name}</li>`;
  });
  managementView += `
      </ul>
    </div>
  `;
  return managementView;
};

/* **************************************
* Build the add classification view
* ************************************ */
Util.buildAddClassification = function() {
  let addClassificationView = `
    <form id="addClassificationForm" action="/classification/add" method="POST">
      <label for="classification_name">Classification Name:</label>
      <input type="text" id="classification_name" name="classification_name" required>
      
      <button type="submit">Add Classification</button>
    </form>
  `;
  return addClassificationView;
};

/* **************************************
* Build the add inventory view
* ************************************ */
Util.buildAddInventory = function() {
  let addInventoryView = `
    <form id="addInventoryForm" action="/inventory/add" method="POST">
      <label for="inv_make">Make:</label>
      <input type="text" id="inv_make" name="inv_make" required>
      
      <label for="inv_model">Model:</label>
      <input type="text" id="inv_model" name="inv_model" required>
      
      <label for="inv_year">Year:</label>
      <input type="number" id="inv_year" name="inv_year" required>
      
      <label for="inv_description">Description:</label>
      <textarea id="inv_description" name="inv_description" required></textarea>
      
      <label for="inv_price">Price:</label>
      <input type="number" id="inv_price" name="inv_price" required>
      
      <label for="inv_miles">Miles:</label>
      <input type="number" id="inv_miles" name="inv_miles" required>
      
      <label for="inv_color">Color:</label>
      <input type="text" id="inv_color" name="inv_color" required>
      
      <button type="submit">Add Inventory</button>
    </form>
  `;
  return addInventoryView;
};

/* **************************************
* Add classification
* ************************************ */
Util.addClassification = async function(req, res) {
  const { classification_name } = req.body;
  await invModel.addClassification(classification_name);
  res.redirect('/management');
};

/* **************************************
* Add inventory
* ************************************ */
Util.addInventory = async function(req, res) {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body;
  await invModel.addInventory(inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color);
  res.redirect('/management');
};

/* **************************************
* Build the edit inventory view
* ************************************ */
Util.editInventoryView = async function(req, res) {
  const vehicle = await invModel.getInventoryById(req.params.id);
  const editInventoryView = Util.buildEditInventoryItemView(vehicle);
  res.send(editInventoryView);
};

/* **************************************
* Update inventory item
* ************************************ */
Util.updateInventoryItem = async function(req, res) {
  const { inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color } = req.body;
  await invModel.updateInventory(req.params.id, inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color);
  res.redirect('/management');
};

module.exports = Util;