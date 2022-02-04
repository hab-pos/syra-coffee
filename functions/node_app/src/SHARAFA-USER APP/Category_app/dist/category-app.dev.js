"use strict";

var _require = require("./category-router"),
    UsercategoryRouter = _require.UsercategoryRouter;

module.exports.UserCategoryApp = function (app) {
  app.use('/user_categories', UsercategoryRouter);
};