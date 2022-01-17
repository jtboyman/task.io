const router = require('express').Router();
const sequelize = require('../config/connection');
const withAdminAuth = require('../utils/adminAuth')
const { Team, Admin, Task, User } = require('../models');

//GET all the teams you made and make ur admin profile
router.get('/', withAdminAuth, (req, res) => {
    Team.findAll({
        where: {
            admin_id: req.session.admin_id
        },
        attributes: ['id', 'team_name', 'team_description','created_at', [sequelize.literal('(SELECT COUNT(*) FROM point WHERE team.id = point.team_id)'), 'point_count']],
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
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbTeamData => {
        const teams = dbTeamData.map(team => team.get({plain:true}));
        res.render('admin-home', {teams, loggedInAdmin: true, loggedIn: true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET to the edit page
router.get('/edit/:id', withAdminAuth, (req, res) => {
    Team.findOne({
        where: {
            id: req.params.id
        },
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
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbTeamData => {
        if (dbTeamData) {
            const team = dbTeamData.get({plain:true});

            res.render('edit-team', {team, loggedInAdmin: true, loggedIn:true});
        } else {
            res.status(404).end();
        }
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;