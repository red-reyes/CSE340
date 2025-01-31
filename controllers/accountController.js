// account controller
const utilities = require('../utilities')

// deliver login view
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
    })
}


module.exports = { buildLogin}