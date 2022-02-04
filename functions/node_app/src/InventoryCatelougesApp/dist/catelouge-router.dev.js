"use strict";

var express = require('express');

var _require = require('./catelouge-controller'),
    add_inventory = _require.add_inventory,
    get_inventories = _require.get_inventories,
    update_inventory = _require.update_inventory,
    delete_inventory = _require.delete_inventory,
    search_inventory = _require.search_inventory,
    get_inventories_sorted = _require.get_inventories_sorted;

var _require2 = require('./catelouge-validator'),
    _id = _require2._id,
    inventory_name = _require2.inventory_name,
    reference = _require2.reference,
    unit = _require2.unit,
    price = _require2.price,
    category_id = _require2.category_id,
    available_branches = _require2.available_branches,
    created_by = _require2.created_by;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_catelouge', [inventory_name, reference, unit, price, category_id, available_branches, created_by], validate, add_inventory);
router.post('/get_catelouge', get_inventories);
router.post('/update_catelouge', [_id], validate, update_inventory);
router.post('/delete_catelouge', [_id], validate, delete_inventory);
router.post('/search_catelouge', search_inventory);
router.post('/get_inventories_sorted', get_inventories_sorted);
module.exports.catelougeRouter = router;