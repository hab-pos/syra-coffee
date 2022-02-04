
const { baristaRouter } = require("./Barista-router")
const {barista_login_listener} = require('./Barista-listener')

module.exports.BaristaApp = function (app) {
  app.use('/barista', baristaRouter)

  barista_login_listener()
}