const sequelize = require('../../config/connection'); //to use a special thing
const router = require('express').Router();
//we get user and post both bc we need info about User as well
//with the foreign key, user_id, can form a JOIN
const { Group, User, Task, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// get all groups
router.get('/', (req, res) => {
    console.log('======================');
    Group.findAll({
        attributes: [//choose what we want
            'id',
            'name'
        ], 
        order: [['created_at', 'DESC']], //order by newest created
        include: [ //JOINing
            //for getting comments:
            {
                model: Comment,
                attributes: ['id','comment_text','post_id','user_id','created_at'],
                include: { //comment model includes User model too so it can attach username to comment
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User, //referring to User model
                attributes: ['username'] //from the User model
            },
            {
                model: Task,
                attributes: ['task_name', 'task_description', 'created_at']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//get a single group
router.get('/:id', (req, res) => {
    Group.findOne({
        where: { //set the value of id using req.params.id
            id: req.params.id
        },
        attributes: [
            'id',
            'name'
        ],
        include: [
            //for getting comments:
            {
                model: Comment,
                attributes: ['id','comment_text','post_id','user_id','created_at'],
                include: { //comment model includes User model too so it can attach username to comment
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Task,
                attributes: ['task_name', 'task_description', 'created_at']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create a group
router.post('/', withAuth, (req, res) => {
    //expects {name: 'group name', user_id: 1(any integer)}
    Group.create({ //req.body is the request from the user and has these properties
        //req.body populates the post table
        name: req.body.name,
        // /api/posts endpoint requires user ID from the current session:
        user_id: req.session.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//update a group title
router.put('/:id', withAuth, (req, res) => {
    Group.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No group found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//delete a group
router.delete('/:id', withAuth, (req, res) => {
    Group.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({message: 'No group found with this id'});
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;