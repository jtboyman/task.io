//authguard the route to make sure people who arent logged in cant reach dashboard page
//this is cool middleware uwu

const withAuth = (req, res, next) => {
    if (!req.session.user_id) {
        res.redirect('/login'); //if you arent logged in u get sent to login page
    } else {
        next(); //could be middleware or final function to render the template
        //the routes can take like a lot of arguments
    }
};

module.exports = withAuth;