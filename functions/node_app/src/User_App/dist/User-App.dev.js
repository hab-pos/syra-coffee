"use strict";

var _require = require("./User-router"),
    UserRouter = _require.UserRouter;

module.exports.UserApp = function (app) {
  app.use('/user', UserRouter);
};