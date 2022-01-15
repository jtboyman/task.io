const router = require('express').Router();
const { Admin, Team, Comment, Point } = require('../../models');

// get all admins
router.get('/', (req, res) => {
    Admin.findAll({
      attributes: { exclude: ['password'] }
    })
      .then(dbAdminData => res.json(dbAdminData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // GET /api/admins/1
router.get('/:id', (req, res) => {
    Admin.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Team,
                attributes: ['id', 'team_name', 'team_description', 'created_at',]
            }
        ]
    })
      .then(dbAdminData => {
        if (!dbAdminData) {
          res.status(404).json({ message: 'No admin found with this id' });
          return;
        }
        res.json(dbAdminData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  // POST /api/admins
  router.post('/', (req, res) => {
    // expects {admin_name: 'admin_name', email: 'email@gmail.com', password: 'password1234'}
    Admin.create({
      admin_name: req.body.admin_name,
      email: req.body.email,
      password: req.body.password
    })
    .then(dbAdminData => res.json(dbAdminData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//login to the site bruh
router.post('/login', (req, res) => {
    // expects {email: 'email@gmail.com', password: 'password1234'}
    Admin.findOne({
      where: {
        email: req.body.email
      }
    }).then(dbAdminData => {
      if (!dbAdminData) {
        res.status(400).json({ message: 'No admin with that email address!' });
        return;
      }
  
      const validPassword = dbAdminData.checkPassword(req.body.password);
      if (!validPassword) {
        res.status(400).json({ message: 'Incorrect password!' });
        return;
      }
  
      res.json({ admin: dbAdminData, message: 'You are now logged in!' });
    });
  });

// PUT /api/admins/1
router.put('/:id', (req, res) => {
// expects {admin_name: 'admin_name', email: 'email@gmail.com', password: 'password1234'}

  // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
  Admin.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbAdminData => {
      if (!dbAdminData[0]) {
        res.status(404).json({ message: 'No admin found with this id' });
        return;
      }
      res.json(dbAdminData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE /api/admins/1
router.delete('/:id', (req, res) => {
    Admin.destroy({
      where: {
        id: req.params.id
      }
    })
      .then(dbAdminData => {
        if (!dbAdminData) {
          res.status(404).json({ message: 'No admin found with this id' });
          return;
        }
        res.json(dbAdminData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  module.exports = router;