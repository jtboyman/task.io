const router = require('express').Router();
const { Team, User, Admin } = require('../../models');

//GET all teams
router.get('/', (req, res) => {
    Team.findAll({
        attributes: ['id', 'team_name', 'team_description', 'created_at'],
        order: ['created_at', 'DESC'],
        include: [
            {
                model: Admin,
                attributes: ['admin_name']
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
        attributes: ['id', 'team_name', 'team_description', 'created_at'],
        include: [
            {
                model: Admin,
                attributes: ['admin_name']
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
router.post('/', (req, res) => {
    //expects {team_name: "name", team_description: "my team", admin_id: 1}
    Team.create({
        team_name: req.body.team_name,
        team_description: req.body.team_description,
        admin_id: req.body.admin_id
    })
    .then(dbTeamData => res.json(dbTeamData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//PUT edit team_name
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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