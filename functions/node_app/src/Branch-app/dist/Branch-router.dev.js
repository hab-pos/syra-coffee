"use strict";

var express = require('express');

var _require = require('./Branch-controller'),
    add_branch = _require.add_branch,
    get_branch = _require.get_branch,
    delete_branch = _require.delete_branch,
    update_branch = _require.update_branch;

var _require2 = require('./Branch-validator'),
    created_by = _require2.created_by,
    branch_name = _require2.branch_name,
    device_id = _require2.device_id,
    _id = _require2._id;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_branch', [created_by, branch_name, device_id], validate, add_branch);
router.post('/get_branches', get_branch);
router.post('/update_branch', [_id], validate, update_branch);
router.post('/delete_branch', [_id], validate, delete_branch);
module.exports.branchRouter = router;