"use strict";

var _require = require("./Branch-router"),
    branchRouter = _require.branchRouter;

module.exports.BranchApp = function (app) {
  app.use('/branches', branchRouter);
};