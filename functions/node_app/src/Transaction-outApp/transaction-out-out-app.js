const { txnOut  } = require("./transaction-out-router")

module.exports.TxnOutApp = function (app) {
  app.use('/transactionOut',txnOut )

}