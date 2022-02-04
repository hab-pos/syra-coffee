"use strict";

var _require = require('./transaction-out-repository'),
    transactionOutRepository = _require.transactionOutRepository;

module.exports.create_txn = function _callee(req, res, _) {
  var _req$body, date_of_transaction, reason, type, barista_id, iva_id, total_amount, mode_of_payment, invoice_number;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, date_of_transaction = _req$body.date_of_transaction, reason = _req$body.reason, type = _req$body.type, barista_id = _req$body.barista_id, iva_id = _req$body.iva_id, total_amount = _req$body.total_amount, mode_of_payment = _req$body.mode_of_payment, invoice_number = _req$body.invoice_number;
          transactionOutRepository.addTxn(date_of_transaction, reason, type, barista_id, iva_id, total_amount, mode_of_payment, invoice_number).then(function (transaction) {
            res.api(200, "transaction stored successfully", {
              transaction: transaction
            }, true);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.get_txn = function _callee2(req, res, _) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          transactionOutRepository.getTxns().then(function (transaction) {
            res.api(200, "transaction retrived successfully", {
              transaction: transaction
            }, true);
          });

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.delete_txn = function _callee3(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.body.id;
          transactionOutRepository.deleteTxn(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "transaction deleted successfully", null, true) : res.api(404, "No transaction found", null, false);
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.filterAPI = function _callee4(req, res, _) {
  var _req$body2, branch, dates, transaction;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, branch = _req$body2.branch, dates = _req$body2.dates;
          _context4.next = 3;
          return regeneratorRuntime.awrap(transactionOutRepository.filterHelper(branch, dates));

        case 3:
          transaction = _context4.sent;
          res.api(200, "transaction retrived successfully", transaction, true);

        case 5:
        case "end":
          return _context4.stop();
      }
    }
  });
};