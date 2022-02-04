"use strict";

var _require = require("./Barista-router"),
    baristaRouter = _require.baristaRouter;

var _require2 = require('./Barista-listener'),
    barista_login_listener = _require2.barista_login_listener;

module.exports.BaristaApp = function (app) {
  app.use('/barista', baristaRouter);
  barista_login_listener();
};