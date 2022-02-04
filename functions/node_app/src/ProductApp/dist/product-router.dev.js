"use strict";

var express = require('express');

var _require = require('./product-controller'),
    add_Product = _require.add_Product,
    get_products = _require.get_products,
    update_products = _require.update_products,
    delete_products = _require.delete_products,
    update_order = _require.update_order,
    get_all_products = _require.get_all_products,
    getBranchProducts = _require.getBranchProducts,
    test_order = _require.test_order;

var _require2 = require('./product-validator'),
    _id = _require2._id,
    product_name = _require2.product_name,
    price = _require2.price,
    iva = _require2.iva,
    categories = _require2.categories,
    color = _require2.color,
    available_branches = _require2.available_branches,
    created_by = _require2.created_by;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_product', [product_name, price, iva, categories, color, available_branches, created_by], validate, add_Product);
router.post('/get_products', get_products);
router.post('/update_product', [_id], validate, update_products);
router.post('/delete_product', [_id], validate, delete_products);
router.post('/update_order', update_order);
router.post("/branch_products", getBranchProducts);
router.post('/get_all_products', get_all_products);
router.post('/test', test_order);
module.exports.productsRouter = router;