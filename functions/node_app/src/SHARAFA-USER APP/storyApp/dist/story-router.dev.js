"use strict";

var express = require('express');

var _require = require('./story-controller'),
    addStory = _require.addStory,
    getStories = _require.getStories,
    updateSotry = _require.updateSotry,
    reorderStories = _require.reorderStories,
    deleteStory = _require.deleteStory,
    uploadPhoto = _require.uploadPhoto;

var router = express.Router();
router.post('/add_story', addStory);
router.post('/upload_image', uploadPhoto);
router.post('/re_order', reorderStories);
router.post('/get_story', getStories);
router.post('/update_story', updateSotry);
router.post('/delete_story', deleteStory);
module.exports.storyRouter = router;