"use strict";

var _require = require("./Expense-router"),
    expenseRouter = _require.expenseRouter;

module.exports.ExpenseApp = function (app) {
  app.use('/expense', expenseRouter);
};