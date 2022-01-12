const router = require('express').Router();
const sequelize = require('../config/connection');
const {Group, User, Comment} = require('../models');
const withAuth = require('../utils/auth');

//get the dashboard
router.get('/', withAuth, (req, res) => { //that's where the qt withAuth goes
   Group.findAll({
       where: {
           //use ID from the session
           user_id: req.session.user_id
       },
       attributes: [
           'id',
           'name'
       ],
       include: [
           {
               model: Comment,
               attributes: ['id','comment_text','group_id','user_id','created_at'],
               include: {
                   model: User,
                   attributes: ['username']
               }
           },
           {
               model: User,
               attributes: ['username', [sequelize.literal('(SELECT COUNT(*) FROM point WHERE user_id = user.id)'), 'point_count']]
           }
       ]
   })
   .then(dbGroupData => {
       //serialize data before passing to template
       const groups = dbGroupData.map(group => group.get({plain: true}));
       res.render('dashboard', {groups, loggedIn:true});
   })
   .catch(err => {
       console.log(err);
       res.status(500).json(err);
   });
  });

  //edit a group
router.get('/edit/:id', withAuth, (req, res) => {
    Group.findOne({
        where: {id: req.params.id},
        attributes: [
            'id',
            'name'
        ],
        include: [
            //for getting comments:
            {
                model: Comment,
                attributes: ['id','comment_text','group_id','user_id','created_at'],
                include: { //comment model includes User model too so it can attach username to comment
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username', [sequelize.literal('(SELECT COUNT(*) FROM point WHERE user_id = user.id)'), 'point_count']]
            }
        ]
    })
    .then(dbGroupData => {
        //serialize it!
        const post = dbGroupData.get({plain: true}); //just getting one here unlike above

        res.render('edit-group', {post, loggedIn:true});
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;