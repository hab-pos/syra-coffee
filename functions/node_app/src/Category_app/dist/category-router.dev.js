"use strict";

var express = require('express');

var _require = require('./category-controller'),
    add_Category = _require.add_Category,
    get_category = _require.get_category,
    update_category = _require.update_category,
    delete_category = _require.delete_category,
    update_order = _require.update_order,
    getBranchCategories = _require.getBranchCategories,
    test_order = _require.test_order;

var _require2 = require('./category-validator'),
    _id = _require2._id,
    category_name = _require2.category_name,
    color = _require2.color,
    available_branches = _require2.available_branches,
    is_Active = _require2.is_Active,
    created_by = _require2.created_by;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_category', [category_name, color, available_branches, is_Active, created_by], validate, add_Category);
router.post('/get_categories', get_category);
router.post('/update_category', [_id], validate, update_category);
router.post('/delete_category', [_id], validate, delete_category);
router.post('/update_order', update_order);
router.post("/branch_category", getBranchCategories);
router.post("/test", test_order);
module.exports.categoryRouter = router;