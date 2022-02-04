const { adminRouter } = require("./Admin-router")
const {admin_login_listener} = require('./Admin-listener')

module.exports.AdminApp = function (app) {
  app.use('/admin', adminRouter)

  admin_login_listener()
}