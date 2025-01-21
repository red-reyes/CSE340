// utilities.js
async function getNav() {
    // Simulate fetching navigation data
    return [
        { name: 'Home', link: '/' },
        { name: 'About', link: '/about' },
        { name: 'Contact', link: '/contact' }
    ]
}

module.exports = { getNav }