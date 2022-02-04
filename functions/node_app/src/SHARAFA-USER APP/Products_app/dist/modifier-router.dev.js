"use strict";

var express = require('express');

var _require = require('./modifer-controller'),
    addModifier = _require.addModifier,
    getModifiers = _require.getModifiers,
    updateModifiers = _require.updateModifiers,
    updateOnlineStatus = _require.updateOnlineStatus,
    deleteModifiers = _require.deleteModifiers;

var router = express.Router();
router.post('/add_modifier', addModifier);
router.post('/get_modifer', getModifiers);
router.post('/update_modifier', updateModifiers);
router.post('/update_online_status', updateOnlineStatus);
router.post('/delete_modifers', deleteModifiers);
module.exports.ModifiersRouter = router;