const withAdminAuth = (req, res, next) => {
    if (!req.session.admin_id) {
        res.redirect('/login');
    } else {
        next();
    }
};

module.exports = withAdminAuth;