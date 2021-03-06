const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const adminRoutes = require('./admin-routes.js');
const teamRoutes = require('./team-routes');
const taskRoutes = require('./task-routes.js');

router.use('/users', userRoutes);
router.use('/admins', adminRoutes);
router.use('/teams', teamRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;