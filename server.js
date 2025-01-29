const session = require("express-session")
const pool = require('./database/')
/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables
const utilities = require("./utilities");
const baseController = require("./controllers/baseController");
const app = express();
/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Path to layout file

// Static file serving middleware
app.use(express.static("public")); // Serve static files

// Routes
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inventory", require("./routes/inventory"));

// File Not Found Route - must be the last route in the list
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page. 😔" });
});

// Error Handling Middleware (global handler)
app.use(async (err, req, res, next) => {
  let nav;
  try {
    nav = await utilities.getNav(); // Fetch navigation data
  } catch (error) {
    nav = []; // Fallback to empty array if getNav() fails
  }

  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status === 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

// Local Server Information (environment settings)
const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

// Log statement to confirm server operation
app.listen(port, () => {
  console.log(`App listening on http://${host}:${port}`);
});