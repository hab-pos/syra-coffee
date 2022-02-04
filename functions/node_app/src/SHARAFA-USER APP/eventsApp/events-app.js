const { EventRouter  } = require("./events-router")

module.exports.EventApp = function (app) {
  app.use('/events', EventRouter)
}