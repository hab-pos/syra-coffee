const { colorRouter } = require("./Color-Router")

module.exports.ColorsApp = function (app) {
  app.use('/colors', colorRouter)
}