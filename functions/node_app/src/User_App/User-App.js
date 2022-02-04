
const { UserRouter } = require("./User-router")

module.exports.UserApp = function (app) {
  app.use('/user', UserRouter)
}