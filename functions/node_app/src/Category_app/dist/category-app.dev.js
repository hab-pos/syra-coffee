"use strict";

var _require = require("./category-router"),
    categoryRouter = _require.categoryRouter;

module.exports.CategoryApp = function (app) {
  app.use('/categories', categoryRouter);
};