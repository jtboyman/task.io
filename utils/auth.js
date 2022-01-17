const withAuth = (req, res, next) => {
    if (!req.session.user_id || !req.session.admin_id) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = withAuth;