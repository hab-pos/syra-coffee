"use strict";

var express = require('express');

var _require = require('./modifer-controller'),
    addModifier = _require.addModifier,
    getModifiers = _require.getModifiers,
    getActiveModifiers = _require.getActiveModifiers,
    updateModifiers = _require.updateModifiers,
    updateOnlineStatus = _require.updateOnlineStatus,
    deleteModifiers = _require.deleteModifiers;

var router = express.Router();
router.post('/add_modifier', addModifier);
router.post('/get_modifer', getModifiers);
router.post('/update_modifier', updateModifiers);
router.post('/update_online_status', updateOnlineStatus);
router.post('/delete_modifers', deleteModifiers);
router.post('/get_active_modifiers', getActiveModifiers);
module.exports.ModifiersRouter = router;