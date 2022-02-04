const { categoryRouter  } = require("./category-router")

module.exports.CategoryApp = function (app) {
  app.use('/categories', categoryRouter)
}