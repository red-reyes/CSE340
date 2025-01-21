async function getNav() {
    // Simulate fetching navigation data
    return [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/about' },
        { name: 'Contact', link: '/contact' }
    ];
}

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
module.exports.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports.getNav = getNav;