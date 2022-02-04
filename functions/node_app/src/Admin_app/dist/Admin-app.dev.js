"use strict";

var _require = require("./Admin-router"),
    adminRouter = _require.adminRouter;

var _require2 = require('./Admin-listener'),
    admin_login_listener = _require2.admin_login_listener;

module.exports.AdminApp = function (app) {
  app.use('/admin', adminRouter);
  admin_login_listener();
};