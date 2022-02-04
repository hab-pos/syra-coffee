const { ordersRouter  } = require("./orders-router")

module.exports.OrdersApp = function (app) {
  app.use('/orders', ordersRouter)
}