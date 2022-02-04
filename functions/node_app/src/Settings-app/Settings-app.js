const { SettingsRouter } = require("./Settings-Router")

module.exports.SettingsApp = function (app) {
  app.use('/settings', SettingsRouter)
}