"use strict";

var express = require('express');

var _require = require('./inventory-order-controller'),
    add_order = _require.add_order,
    get_orders = _require.get_orders,
    update_order = _require.update_order,
    delete_order = _require.delete_order,
    get_brach_orders = _require.get_brach_orders,
    printOrder = _require.printOrder,
    reorder = _require.reorder;

var _require2 = require('./inventory-order-validator'),
    _id = _require2._id,
    order_date = _require2.order_date,
    device_id = _require2.device_id,
    received_by = _require2.received_by,
    ordered_by = _require2.ordered_by,
    delivery_date = _require2.delivery_date,
    number_of_products = _require2.number_of_products,
    status = _require2.status,
    comment_by_barista = _require2.comment_by_barista,
    admin_msg = _require2.admin_msg,
    ordered_items = _require2.ordered_items;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/create_order', [device_id, ordered_by, number_of_products, comment_by_barista, ordered_items], validate, add_order); //3

router.post('/get_orders', get_orders); // 1

router.post('/update_order', [_id], validate, update_order); //2

router.post('/delete_order', [_id], validate, delete_order);
router.post('/branch_orders', get_brach_orders);
router.post('/print', printOrder);
router.post('/reorder', reorder);
module.exports.inventory_order_router = router;