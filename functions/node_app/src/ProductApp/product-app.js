const { productsRouter  } = require("./product-router")

module.exports.ProductsApp = function (app) {
  app.use('/products', productsRouter)
}