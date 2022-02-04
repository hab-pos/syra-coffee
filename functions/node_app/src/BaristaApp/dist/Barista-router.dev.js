"use strict";

var express = require('express');

var _require = require('./Barista-controller'),
    addBarista = _require.addBarista,
    barista_login = _require.barista_login,
    logout = _require.logout,
    get_barista_details_by_id = _require.get_barista_details_by_id,
    delete_barista = _require.delete_barista,
    update_barista_password = _require.update_barista_password,
    update_test = _require.update_test,
    get_report = _require.get_report,
    get_all_barista = _require.get_all_barista,
    clockout = _require.clockout,
    switch_user = _require.switch_user,
    get_branch_logged_in_users = _require.get_branch_logged_in_users,
    get_report_graph = _require.get_report_graph;

var _require2 = require('./Barista-validator'),
    created_by = _require2.created_by,
    barista_name = _require2.barista_name,
    barista_Validation = _require2.barista_Validation,
    password = _require2.password,
    _id = _require2._id;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_barista', [created_by, barista_name, password], validate, addBarista);
router.post('/login', [barista_Validation, password], validate, barista_login);
router.post('/logout', [_id], validate, logout);
router.post('/get_barista_details', [_id], validate, get_barista_details_by_id);
router.post('/delete_barista', [_id], validate, delete_barista);
router.post('/update_password', [_id], update_barista_password);
router.post('/get_all_barista', get_all_barista);
router.post('/clockout', clockout);
router.post('/switch_user', switch_user);
router.post('/get_logged_in_baristas', get_branch_logged_in_users);
router.post('/get_report', get_report);
router.post('/get_report_graph', get_report_graph);
router.post('/update', update_test);
module.exports.baristaRouter = router;