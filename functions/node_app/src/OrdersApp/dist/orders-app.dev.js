"use strict";

var _require = require("./orders-router"),
    ordersRouter = _require.ordersRouter;

module.exports.OrdersApp = function (app) {
  app.use('/orders', ordersRouter);
};