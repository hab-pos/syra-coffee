const express = require('express')
const {addStory,getStories,updateSotry,reorderStories,deleteStory,uploadPhoto} = require('./story-controller')
const router = express.Router()

router.post('/add_story',addStory)
router.post('/upload_image',uploadPhoto)
router.post('/re_order',reorderStories)
router.post('/get_story' , getStories)
router.post('/update_story',updateSotry)
router.post('/delete_story',deleteStory)



module.exports.storyRouter = router