/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
// Unit 4, Require the Session package and DB connection

const session = require("express-session");
const pool = require('./database/');

const baseController = require("./controllers/baseController");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
dotenv.config();
const utilities = require("./utilities/");
const app = express();
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

/* ***********************
 * Middleware
 ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Unit 4, Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());

// Unit 5 *****THIS IS GIVING ME ISSUE AS WELL**********************
app.use(utilities.checkJWTToken);

app.use((req, res, next) => {
  res.locals.loggedIn = req.session.user ? true : false;
  res.locals.account_firstname = req.session.user ? req.session.user.account_firstname : null;
  res.locals.account_type = req.session.user ? req.session.user.account_type : null;
  next();
});

// Logout route
app.get('/account/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/');
    }
    res.clearCookie('sessionId');
    res.redirect('/account/login');
  });
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Path to layout file

// Static file serving middleware
app.use(express.static("public")); // Serve static files

/* ***********************
 * Routes
 *************************/
// Index Routes
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes with login and account type check middleware
app.use('/inv', utilities.handleErrors(require("./routes/inventoryRoute")));

// Account routes
app.use('/account', utilities.handleErrors(require("./routes/accountRoute")));

// File Not Found Route - must be last route in list
app.use(async(req, res, next) => {
  next({status: 404, message: "Sorry, we appear to have lost that page. 😔"});
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  
  const message = err.status === 404 
    ? err.message
    : 'Oh no! There was a crash. Maybe try a different route?';
  
  res.status(err.status || 500).render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav,
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});