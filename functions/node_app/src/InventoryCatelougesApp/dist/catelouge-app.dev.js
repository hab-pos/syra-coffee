"use strict";

var _require = require("./catelouge-router"),
    catelougeRouter = _require.catelougeRouter;

var _require2 = require("./catelouge-listener"),
    addCatelougeMiddelware = _require2.addCatelougeMiddelware;

module.exports.CatelougeApp = function (app) {
  app.use('/catelouge', catelougeRouter);
  addCatelougeMiddelware();
};