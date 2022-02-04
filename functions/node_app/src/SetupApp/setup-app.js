const { setupRouter  } = require("./setup-router")

module.exports.setupApp = function (app) {
  app.use('/setup',setupRouter )

}