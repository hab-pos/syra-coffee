const { expenseRouter  } = require("./Expense-router")

module.exports.ExpenseApp = function (app) {
  app.use('/expense', expenseRouter)
}