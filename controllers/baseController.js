const utilities = require("../utilities");

module.exports.buildHome = async (req, res, next) => {
  try {
    const nav = await utilities.getNav(); // Fetch navigation data
    res.render("index", { title: "Home", nav }); // Render the home view
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
};