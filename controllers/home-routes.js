//this will contain all the user-facing routes (homepage, login page)
const sequelize = require('../config/connection');
const { Group, User, Comment, Task } = require('../models');

const router = require('express').Router();

//get then render all the groups
router.get('/', (req, res) => {
    console.log(req.session);
    Group.findAll({
      attributes: [
        'id',
        'name'
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'group_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username', [sequelize.literal('(SELECT COUNT(*) FROM point WHERE user.id = point.user_id)'), 'point_count']]
        },
        {
          model: Task,
          attributes: ['task_name', 'task_description', 'created_at']
        }
      ]
    })
      .then(dbGroupData => {
        // check out a single post
        console.log(dbGroupData[0]);
        //this will loop over and map each sequelize obj into the nice version and make a new posts aray
        const groups = dbGroupData.map(group => group.get({plain: true}));
        //render writes it into main.handlebars, this writes homepage using that post data
        res.render('homepage', {
            groups, //put that array u made in
            loggedIn: req.session.loggedIn //for the if statement in template re: login/logout button/points
        }); 
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  //render the login page
  router.get('/login', (req, res) => { //no second arg bc no variables needed
    if (req.session.loggedIn) { //if you're already logged in bc session knows
        res.redirect('/');
        return;
    }
    
    res.render('login');
  });



//render a single group
router.get('/group/:id', (req, res) => {
    Group.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'name'
        ],
        include: [
            {
                model: Comment, //get stuff from the comment model
                attributes: ['id','comment_text','group_id','user_id','created_at'],
                include: {
                    model: User, //get stuff from user for comment model
                    attributes: ['username']
                }
            },
            {
                model: User,//get stuff from user model for group model
                attributes: ['username', [sequelize.literal('(SELECT COUNT(*) FROM point WHERE user.id = point.user_id)'), 'point_count']]
            },
            {
              model: Task,
              attributes: ['task_name', 'task_description', 'created_at']
            }
        ]
    })
    .then(dbGroupData => {
        if (!dbGroupData) {
            res.status(404).json({message: 'No group found with this id!' });
            return;
        }

        //serialize (make readable) the data
        const group = dbGroupData.get({plain: true});

        //pass data to template
        res.render('single-group', {
            group,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;