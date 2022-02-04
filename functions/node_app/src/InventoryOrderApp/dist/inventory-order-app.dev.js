"use strict";

var _require = require("./inventory-order-router"),
    inventory_order_router = _require.inventory_order_router;

module.exports.InventoryOrdersApp = function (app) {
  app.use('/inventory-order', inventory_order_router);
};