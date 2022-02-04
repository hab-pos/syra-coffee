"use strict";

var _require = require("./transaction-out-router"),
    txnOut = _require.txnOut;

module.exports.TxnOutApp = function (app) {
  app.use('/transactionOut', txnOut);
};