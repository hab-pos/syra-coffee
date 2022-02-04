"use strict";

var express = require('express');

var _require = require('./category-controller'),
    add_Category = _require.add_Category,
    uploadPhoto = _require.uploadPhoto,
    get_category = _require.get_category,
    update_category = _require.update_category,
    reorderCategory = _require.reorderCategory,
    updateOnlineStatus = _require.updateOnlineStatus,
    delete_category = _require.delete_category,
    update_order = _require.update_order,
    getBranchCategories = _require.getBranchCategories,
    test_order = _require.test_order;

var _require2 = require('./category-validator'),
    _id = _require2._id,
    category_name = _require2.category_name,
    image_name = _require2.image_name,
    image_url = _require2.image_url,
    is_Active = _require2.is_Active,
    order = _require2.order,
    is_deleted = _require2.is_deleted;

var _require3 = require('../../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_category', add_Category);
router.post('/upload_image', uploadPhoto);
router.post('/re_order', reorderCategory);
router.post('/get_categories', get_category);
router.post('/update_category', update_category);
router.post('/updateOnlineStatus', updateOnlineStatus);
router.post('/delete_category', [_id], validate, delete_category); // router.post('/update_order' ,update_order)
// router.post("/branch_category",getBranchCategories)
// router.post("/test",test_order)

module.exports.UsercategoryRouter = router;