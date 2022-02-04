"use strict";

var _require = require("./events-router"),
    EventRouter = _require.EventRouter;

module.exports.EventApp = function (app) {
  app.use('/events', EventRouter);
};