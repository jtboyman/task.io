const router = require('express').Router();
const { Task } = require('../../models');

//GET all tasks
router.get('/', (req, res) => {
    Task.findAll()
    .then(dbTaskData => res.json(dbTaskData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});


//POST a task /api/tasks
//expects {task_text: "do a thing", admin_id: 1, team_id: 1}
router.post('/', (req, res) => {
    if (req.session) {
        Task.create({
            task_text: req.body.task_text,
            admin_id: req.session.admin_id,
            team_id: req.body.team_id
        })
        .then(dbTaskData => res.json(dbTaskData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    }
});

//DELETE a task 
router.delete('/:id', (req, res) => {
    Task.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbTaskData => {
        if (!dbTaskData) {
            res.status(404).json({message: 'Task not found with this id!'});
            return;
        }
        res.json(dbTaskData);
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

module.exports = router;