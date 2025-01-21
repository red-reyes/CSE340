module.exports.buildHome = async (req, res, next) => {
    try {
        let nav = await utilities.getNav(); // Fetch the nav data
        res.render("index", { title: "Home", nav });  // Pass nav to the view
    } catch (error) {
        next(error); // If there's an error, pass it to the next middleware
    }
};