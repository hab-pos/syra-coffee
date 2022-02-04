const { ProductRouter  } = require("./products-router")

module.exports.UserProductApp = function (app) {
  app.use('/user-products', ProductRouter)
}