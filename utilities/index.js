async function getNav() {
    return [
      { text: "Home", href: "/" },
      { text: "About", href: "/about" },
    ]; // Example navigation data
  }
  /* ****************************************
 * Middleware For Handling Errors
 **************************************** */
  module.exports.handleErrors = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);
  
  module.exports.getNav = getNav;