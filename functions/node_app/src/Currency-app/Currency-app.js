const { currencyRouter } = require("./Currency-Router")

module.exports.CurrencysApp = function (app) {
  app.use('/currency', currencyRouter)
}