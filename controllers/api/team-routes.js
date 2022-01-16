const router = require('express').Router();
const sequelize = require('../../config/connection');
const withAdminAuth = require('../../utils/adminAuth');
const { Team, User, Admin, Point, Task } = require('../../models');

//GET all teams
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
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbTeamData => res.json(dbTeamData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//GET a single team
router.get('/:id', (req, res) => {
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
            }, //check and see if u need array lol
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbTeamData => {
        if (!dbTeamData) {
            res.status(404).json({ message: 'No team found with this id!' });
            return;
        }
        res.json(dbTeamData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//POST a new team
router.post('/', withAdminAuth, (req, res) => {
    //expects {team_name: "name", team_description: "my team", admin_id: 1}
    Team.create({
        team_name: req.body.team_name,
        team_description: req.body.team_description,
        admin_id: req.session.admin_id
    })
    .then(dbTeamData => res.json(dbTeamData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//PUT add a point to a team /api/teams/addPoint
router.put('/addPoint', withAdminAuth, (req, res) => {
    if (req.session) {
        Team.addPoint({...req.body, admin_id: req.session.admin_id}, {Point, Task, Admin})
        .then(updatedTeamData => res.json(updatedTeamData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    }
});

//PUT edit team_name
router.put('/:id', withAdminAuth, (req, res) => {
    Team.update(
      {
        team_name: req.body.team_name
      },
      {
        where: {
          id: req.params.id
        }
      }
    )
      .then(dbTeamData => {
        if (!dbTeamData) {
          res.status(404).json({ message: 'No team found with this id!' });
          return;
        }
        res.json(dbTeamData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

//DELETE delete a team
router.delete('/:id', withAdminAuth, (req, res) => {
    Team.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbTeamData => {
        if(!dbTeamData) {
            res.status(404).json({ message: 'No team found with this id!' });
            return;
          }
          res.json(dbTeamData);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json(err);
        });
})

module.exports = router;