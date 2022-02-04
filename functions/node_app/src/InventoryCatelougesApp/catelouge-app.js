const { catelougeRouter  } = require("./catelouge-router")

const {addCatelougeMiddelware} = require("./catelouge-listener")
module.exports.CatelougeApp = function (app) {
  app.use('/catelouge',catelougeRouter )

  addCatelougeMiddelware()
}