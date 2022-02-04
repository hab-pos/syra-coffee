"use strict";

var _require = require("./setup-router"),
    setupRouter = _require.setupRouter;

module.exports.setupApp = function (app) {
  app.use('/setup', setupRouter);
};