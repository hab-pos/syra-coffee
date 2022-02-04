const { ModifiersRouter  } = require("./modifier-router")

module.exports.ModifiersApp = function (app) {
  app.use('/modifiers', ModifiersRouter)
}