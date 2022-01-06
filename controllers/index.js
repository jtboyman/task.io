//collecting packaged group of api end points and prefixing them with path /api

const router = require('express').Router();

const apiRoutes = require('./api');

const homeRoutes = require('./home-routes.js');

const dashboardRoutes = require('./dashboard-routes.js');

router.use('/api', apiRoutes);

router.use('/', homeRoutes);

router.use('/dashboard', dashboardRoutes);

router.use((req, res) => { //error for when request a nonexistent endpoint
    res.status(404).end();
});

module.exports = router;