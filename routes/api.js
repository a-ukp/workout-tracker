const db = require('../models');
const router = require('express').Router();

// get workouts
router.get('/api/workouts', (req, res) => {
    db.Workout.find({}).then(dbWorkout => {
        dbWorkout.forEach(workout => {
            var total = 0;
            workout.exercises.forEach(e => {
                total += e.duration;
            });

            workout.totalDuration = total;
        });

        res.json(dbWorkout);
    }).catch(err => {{
        res.json(err);
    }});
});

// add exercise
router.put('/api/workouts/:id', (req, res) => {
    db.Workout.findOneAndUpdate(
        { _id: req.params.id },
        {
            $inc: { totalDuration: req.body.duration },
            $push: { exercises: req.body }
        },
        { new: true }).then(dbWorkout => {
            res.json(dbWorkout);
        }).catch(err => {
            res.json(err);
        });
});

// create workout
router.post('/api/workouts', (req, res) => {
    db.Workout.create({}).then((dbWorkout => {
        res.json(dbWorkout);
    })).catch(err => {
        res.json(err);
    });
});

// get workout in range
router.get('/api/workouts/range', (req, res) => {
    db.Workout.aggregate([
        {
            $addFields: { totalDuration: { $sum: '$exercises.duration'} },
        }
    ]).sort({ _id: -1 }).limit(7).then(dbWorkout => {
        res.json(dbWorkout);
    }).catch(err => {
        res.json(err);
    }); // sort descending
});

module.exports = router;