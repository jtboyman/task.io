const router = require('express').Router();
const sequelize = require('../config/connection');
const withAuth = require('../utils/auth');
const {Team, Admin, Task, User} = require('../models')

//GET all teams for the homepage
router.get('/', (req, res) => {
    console.log(req.session);
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
            },
            {
                model: User,
                attributes: ['username', 'team_id']
            }
        ]
    })
    .then(dbTeamData => {
        const teams = dbTeamData.map(team => team.get({plain: true}));

        res.render('homepage', {teams, loggedIn: req.session.loggedIn, loggedInAdmin: req.session.loggedInAdmin, loggedInUser: req.session.loggedInUser, team_id: req.session.team_id});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET single team page
router.get('/team/:id', (req, res) => {
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
                attributes: ['username', 'team_id']
            }
        ]
    })
    .then(dbTeamData => {
        if (!dbTeamData) {
            res.status(404).json({message: 'No team found with this id!'});
            return;
        }

        const team = dbTeamData.get({plain:true});

        res.render('single-team', {team, loggedIn: req.session.loggedIn, loggedInAdmin: req.session.loggedInAdmin, loggedInUser: req.session.loggedInUser, team_id: req.session.team_id});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET render login page
router.get('/login', (req, res) => {

    if (req.session.loggedInAdmin) {
        res.redirect('/adminHome/'); //admin will want to go to dashboard
        return;
      } else if (req.session.loggedInUser) {
          res.redirect('/'); //user will want to go to group page
          return;
      }
    
    res.render('login');
  });

module.exports = router;