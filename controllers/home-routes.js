//this will contain all the user-facing routes (homepage, login page)
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

const router = require('express').Router();

//get then render all the posts
router.get('/', (req, res) => {
    console.log(req.session);
    Post.findAll({
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
      .then(dbPostData => {
        // check out a single post
        console.log(dbPostData[0]);
        //this will loop over and map each sequelize obj into the nice version and make a new posts aray
        const posts = dbPostData.map(post => post.get({plain: true}));
        //render writes it into main.handlebars, this writes homepage using that post data
        res.render('homepage', {
            posts, //put that array u made in
            loggedIn: req.session.loggedIn //for the if statement in template re: login/logout button
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



//render a single post
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment, //get stuff from the comment model
                attributes: ['id','comment_text','post_id','user_id','created_at'],
                include: {
                    model: User, //get stuff from user for comment model
                    attributes: ['username']
                }
            },
            {
                model: User,//get stuff from user model for post model
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id' });
            return;
        }

        //serialize (make readable) the data
        const post = dbPostData.get({plain: true});

        //pass data to template
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


module.exports = router;