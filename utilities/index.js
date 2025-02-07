const invModel = require("../models/inventory-model")

const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + ' details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

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
}

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
}

/* **************************************
* Build the classificaction list
* ************************************ */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

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
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

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
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util
