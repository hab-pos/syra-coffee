"use strict";

var express = require('express');

var _require = require('./inventory-report-controller'),
    add_order = _require.add_order,
    get_orders = _require.get_orders,
    filter_reports = _require.filter_reports,
    update = _require.update,
    deleteAct = _require.deleteAct;

var _require2 = require('./inventory-report-validator'),
    device_id = _require2.device_id,
    final_remaining = _require2.final_remaining;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_coffee_count', [device_id, final_remaining], validate, add_order);
router.post('/get_reports', get_orders);
router.post('/filter_reports', filter_reports);
router.post('/update', update);
router.post('/delete', deleteAct);
module.exports.inventory_report_router = router;