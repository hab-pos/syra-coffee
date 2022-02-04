const { inventory_order_router  } = require("./inventory-order-router")

module.exports.InventoryOrdersApp = function (app) {
  app.use('/inventory-order', inventory_order_router)
}