"use strict";

var _require = require("./inventory-report-router"),
    inventory_report_router = _require.inventory_report_router;

module.exports.InventoryReportApp = function (app) {
  app.use('/inventory-report', inventory_report_router);
};