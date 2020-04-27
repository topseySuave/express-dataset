var express = require('express');
var router = express.Router();
const ActorsController = require('../controllers/actors');

// Routes related to actor.
router.get('/actors', ActorsController.getAllActors);
router.put('/actors', ActorsController.updateActor);
router.get('/actors/streak', ActorsController.getStreak);

module.exports = router;