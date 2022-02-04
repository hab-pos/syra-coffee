"use strict";

var _require = require("./modifier-router"),
    ModifiersRouter = _require.ModifiersRouter;

module.exports.ModifiersApp = function (app) {
  app.use('/modifiers', ModifiersRouter);
};