const router = require('express').Router();
const sequelize = require('../config/connection');
const {Team, Admin, Task, User} = require('../models')

//GET all teams for the homepage
router.get('/', (req, res) => {
    Team.findAll({
        attributes: ['id', 'team_name', 'team_description', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM point WHERE team.id = point.team_id)'), 'point_count']],
        include: [
            {
                model: Task,
                attributes: ['id', 'task_text', 'admin_id', 'team_id', 'created_at'],
                include: {
                    model: Admin,
                    attributes: ['admin_name']
                }
            },
            {
                model: Admin,
                attributes: ['admin_name']
            }
        ]
    })
    .then(dbTeamData => {
        const teams = dbTeamData.map(team => team.get({plain: true}));

        res.render('homepage', {
            teams
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET render login page
router.get('/login', (req, res) => {
    res.render('login');
  });

module.exports = router;