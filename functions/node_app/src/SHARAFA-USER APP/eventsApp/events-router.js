const express = require('express')
const {addEvent,uploadPhoto,reorderEvent,updateEvent,deleteEvent,getEvents,getUserEvent} = require('./events-controller')
const router = express.Router()

router.post('/add_event',addEvent)
router.post('/upload_event',uploadPhoto)
router.post('/re_order',reorderEvent)
router.post('/get_events' , getEvents)
router.post('/update_events',updateEvent)
router.post('/delete_event',deleteEvent)
router.post('/get_user_event',getUserEvent)

module.exports.EventRouter = router