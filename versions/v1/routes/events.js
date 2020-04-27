var express = require('express');
var router = express.Router();
const EventsController = require('../controllers/events');

// Routes related to event
router.get('/events', EventsController.getAllEvents);
router.post('/events', EventsController.addEvent);
router.get('/events/actors/:id', EventsController.getByActors);
router.delete('/erase', EventsController.eraseEvents);

module.exports = router;