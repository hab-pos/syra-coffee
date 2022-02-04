"use strict";

var express = require('express');

var _require = require('./products-controller'),
    addProduct = _require.addProduct,
    uploadPhoto = _require.uploadPhoto,
    reorderCategory = _require.reorderCategory,
    getProducts = _require.getProducts,
    deleteProduct = _require.deleteProduct,
    updateProduct = _require.updateProduct,
    updateOnlineStatus = _require.updateOnlineStatus,
    getFeaturedProducts = _require.getFeaturedProducts,
    get_all_products = _require.get_all_products;

var router = express.Router();
router.post('/add_product', addProduct);
router.post('/upload_image', uploadPhoto);
router.post('/re_order', reorderCategory);
router.post('/get_product', getProducts);
router.post('/update_product', updateProduct);
router.post('/updateOnlineStatus', updateOnlineStatus);
router.post('/delete_product', deleteProduct);
router.post('/get_featured', getFeaturedProducts);
router.post('/get-all-products', get_all_products);
module.exports.ProductRouter = router;