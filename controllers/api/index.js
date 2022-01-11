//collect and package api routes

const router = require('express').Router();

const userRoutes = require('./user-routes');
const groupRoutes = require('./group-routes');
const commentRoutes = require('./comment-routes');

router.use('/users', userRoutes);
router.use('/groups', groupRoutes);
router.use('/comments', commentRoutes); //all routes defined in comment routes will have /comments prefix - scale the API by adding new endpoint

module.exports = router;