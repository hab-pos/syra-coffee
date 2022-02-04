"use strict";

var _require = require("./products-router"),
    ProductRouter = _require.ProductRouter;

module.exports.UserProductApp = function (app) {
  app.use('/user-products', ProductRouter);
};