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
      + 'details"><img src="' + vehicle.inv_thumbnail 
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
    <form id="loginForm" action="/account/login" method="POST">
      <label for="username">Username:</label>
      <input type="text" id="username" name="username" required>
      
      <label for="password">Password:</label>
      <input type="password" id="password" name="password" required>
      
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
      <label for="classificationName">Classification Name:</label>
      <input type="text" id="classificationName" name="classificationName" required>
      
      <button type="submit">Add Classification</button>
    </form>
  `;
  return addClassificationView;
}

// 
/* **************************************
* Build the add inventory view HTML
* ************************************ */
Util.buildAddInventoryView = function() {
  let addInventoryView = `
    <form id="addInventoryForm" action="/inventory/add" method="POST">
      <label for="invMake">Make:</label>
      <input type="text" id="invMake" name="invMake" required>
      
      <label for="invModel">Model:</label>
      <input type="text" id="invModel" name="invModel" required>
      
      <label for="invYear">Year:</label>
      <input type="number" id="invYear" name="invYear" required>
      
      <label for="invDescription">Description:</label>
      <textarea id="invDescription" name="invDescription" required></textarea>
      
      <label for="invPrice">Price:</label>
      <input type="number" id="invPrice" name="invPrice" required>
      
      <label for="invMiles">Miles:</label>
      <input type="number" id="invMiles" name="invMiles" required>
      
      <label for="invColor">Color:</label>
      <input type="text" id="invColor" name="invColor" required>
      
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

module.exports = Util