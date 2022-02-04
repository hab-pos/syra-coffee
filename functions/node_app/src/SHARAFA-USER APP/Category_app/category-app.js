const { UsercategoryRouter  } = require("./category-router")

module.exports.UserCategoryApp = function (app) {
  app.use('/user_categories', UsercategoryRouter)
}