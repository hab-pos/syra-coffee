"use strict";

var express = require('express');

var _require = require('./Admin-controller'),
    add_admin = _require.add_admin,
    admin_login = _require.admin_login,
    get_admin_details_by_id = _require.get_admin_details_by_id,
    logout = _require.logout,
    delete_admin = _require.delete_admin,
    update_admin_details = _require.update_admin_details;

var _require2 = require('./Admin-validator'),
    validEmail = _require2.validEmail,
    email_id = _require2.email_id,
    user_name = _require2.user_name,
    admin_recipt_message = _require2.admin_recipt_message,
    password = _require2.password,
    _id = _require2._id;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_Admin', [email_id, user_name, validEmail, admin_recipt_message, password], validate, add_admin);
router.post('/login', [validEmail, password], validate, admin_login);
router.post('/logout', [_id], validate, logout);
router.post('/get_admin_details', [_id], validate, get_admin_details_by_id);
router.post('/delete_admin', [_id], validate, delete_admin);
router.post('/update_admin_details', [_id], validate, update_admin_details);
module.exports.adminRouter = router;