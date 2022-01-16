const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes')
const adminHomeRoutes = require('./admin-home-routes')

router.use('/', homeRoutes);
router.use('/api', apiRoutes);
router.use('/adminHome', adminHomeRoutes);

router.use((req, res) => {
  res.status(404).end();
});

module.exports = router;