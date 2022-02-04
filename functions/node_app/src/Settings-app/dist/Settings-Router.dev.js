"use strict";

var express = require('express');

var _require = require('./Settings-controller'),
    add_setting = _require.add_setting,
    get_settings = _require.get_settings,
    update_Settings = _require.update_Settings,
    delete_settings = _require.delete_settings,
    upload_logo_image = _require.upload_logo_image,
    get_logo = _require.get_logo;

var _require2 = require('./Settings-Validator'),
    code = _require2.code,
    value = _require2.value,
    _id = _require2._id;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_settings', [code, value], validate, add_setting);
router.post('/get_settings', get_settings);
router.post('/update_settings', update_Settings);
router.post('/delete_settings', [_id], validate, delete_settings);
router.post('/upload_logo', upload_logo_image);
router.post('/get_logo', get_logo);
module.exports.SettingsRouter = router;