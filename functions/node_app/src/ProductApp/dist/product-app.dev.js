"use strict";

var _require = require("./product-router"),
    productsRouter = _require.productsRouter;

module.exports.ProductsApp = function (app) {
  app.use('/products', productsRouter);
};