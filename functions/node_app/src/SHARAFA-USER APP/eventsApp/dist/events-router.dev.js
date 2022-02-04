"use strict";

var express = require('express');

var _require = require('./events-controller'),
    addEvent = _require.addEvent,
    uploadPhoto = _require.uploadPhoto,
    reorderEvent = _require.reorderEvent,
    updateEvent = _require.updateEvent,
    deleteEvent = _require.deleteEvent,
    getEvents = _require.getEvents,
    getUserEvent = _require.getUserEvent;

var router = express.Router();
router.post('/add_event', addEvent);
router.post('/upload_event', uploadPhoto);
router.post('/re_order', reorderEvent);
router.post('/get_events', getEvents);
router.post('/update_events', updateEvent);
router.post('/delete_event', deleteEvent);
router.post('/get_user_event', getUserEvent);
module.exports.EventRouter = router;