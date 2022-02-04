const { inventory_report_router  } = require("./inventory-report-router")

module.exports.InventoryReportApp = function (app) {
  app.use('/inventory-report', inventory_report_router)
}