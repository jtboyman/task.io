const router = require('express').Router();
const { User, Post, Vote, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// GET /api/users (will select all users from user table in database and send
//it back as json)
router.get('/', (req, res) => {
    //Access our User model and run .findAll() method
    User.findAll({ //same as SELECT * FROM users;
        attributes: {exclude: ['password']} //protect passwords
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// GET /api/users/1
router.get('/:id', (req, res) =>{
    User.findOne({
        attributes: {exclude: ['password']}, //protect passwords
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Post, //see the posts the user has made
                attributes: ['id','title', 'post_url', 'created_at']
            },
            {
                model: Comment, //see the comments the user has made
                attributes: ['id','comment_text', 'created_at'],
                include: {
                    model: Post, //so you can access to show what post the comment is on
                    attributes: ['title']
                }
            },
            {
                model: Post, //see the upvoted posts
                attributes: ['title'],
                through: Vote, //goes through the vote table
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found witht his id!'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'username', email: 'email@email.com', password: 'password1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData =>{
        /*want to make sure session is created before we send response back
         so wrapping the variables in a callback, req.session.save() will 
         initiate the creation of the session and then run the callback function
          once complete*/
        req.session.save(() => {//gives server access to user's userid and username and says if logged in or not
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json(dbUserData)
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST to log in bc more secure bc request param is in req.body instead of URL
router.post('/login', (req, res) => {
    //expects {email: 'email@email.com', password:'password1234'}
    User.findOne({ //queried user table for email entered by user
        where: {
            email: req.body.email //assigned email to this
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({message: 'No user with that email address!'});
            return;
        }

        //verify user
        //returns boolean, using method from User.js
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({message: 'Incorrect password!'});
            return;
        }

        req.session.save(() => {
            // declare session variables
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
      
            res.json({ user: dbUserData, message: 'You are now logged in!' });
          });
    });
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
})

// PUT /api/users/1 (uses req.body req.params)
router.put('/:id', withAuth, (req, res) => {
    // expects {username: 'username', email: 'email@email.com', password: 'password1234'}

    //if req.body has exact key/value pairs to match the model, you can just
    //use req.body instead
    User.update(req.body, { //req.body is new data to use in update
        individualHooks: true, //needed according to docs
        where: {
            id: req.params.id //this is where we put new data
        }
    })
    .then(dbUserData => {
        if (!dbUserData[0]) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// DELETE /api/users/1
router.delete('/:id', withAuth, (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({message: 'No user found with this id'});
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;