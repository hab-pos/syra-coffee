"use strict";

var _require = require('./Expense-repository'),
    expenseRepository = _require.expenseRepository;

var moment = require('moment');

var _require2 = require("../OrdersApp/orders-model"),
    CashFlowModel = _require2.CashFlowModel;

var _require3 = require("../Transaction-outApp/transaction-out-model"),
    TransactionOutModel = _require3.TransactionOutModel;

module.exports.createExpense = function _callee(req, res, _) {
  var _req$body, motive_name, expense_date, motive, iva_id, price, payment, device_id, barista_id, mode_of_payment, invoice_number, requestObj, date_of_expense;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, motive_name = _req$body.motive_name, expense_date = _req$body.expense_date, motive = _req$body.motive, iva_id = _req$body.iva_id, price = _req$body.price, payment = _req$body.payment, device_id = _req$body.device_id, barista_id = _req$body.barista_id, mode_of_payment = _req$body.mode_of_payment, invoice_number = _req$body.invoice_number;
          requestObj = Object();
          date_of_expense = moment(expense_date, 'MM/DD/YYYY');
          console.log(req.body, date_of_expense);
          expenseRepository.get_branchInfo(device_id).then(function (branch) {
            if (branch) {
              requestObj.expense_date = date_of_expense;
              requestObj.motive = motive;
              requestObj.iva_id = iva_id;
              requestObj.price = price;
              requestObj.branch_id = branch._id;
              requestObj.payment = payment;
              requestObj.barista_id = barista_id;
              expenseRepository.createExpense(requestObj).then(function (info) {
                var txn = new Object();
                txn.date_of_transaction = date_of_expense;
                txn.type = "expense";
                txn.barista_id = barista_id;
                txn.iva_id = iva_id;
                txn.total_amount = price;
                txn.mode_of_payment = mode_of_payment || "CASH";
                txn.invoice_number = invoice_number || "-";
                txn.reason = motive_name;
                txn.branch_id = branch._id;
                txn.expense_id = info._id;
                expenseRepository.createTxn(txn).then(function (transaction) {
                  expenseRepository.getExpenses(info._id, branch._id).then(function (Expense_info) {
                    res.api(200, "Expense added successfully", Expense_info, true);
                  });
                });
              });
            } else {
              res.api(200, "IPAD Not registered to Branch", null, false);
            }
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.getExpenses = function _callee2(req, res, _) {
  var _req$body2, id, device_id, branch, cashFlow, openTime;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, id = _req$body2.id, device_id = _req$body2.device_id;
          console.log(device_id);
          _context2.next = 4;
          return regeneratorRuntime.awrap(expenseRepository.get_branchInfo(device_id));

        case 4:
          branch = _context2.sent;

          if (!branch) {
            _context2.next = 12;
            break;
          }

          _context2.next = 8;
          return regeneratorRuntime.awrap(CashFlowModel.findAll({
            where: {
              branch_id: branch._id,
              close_time: null
            },
            order: [["createdAt", "DESC"]],
            limit: 1
          }));

        case 8:
          cashFlow = _context2.sent;

          if (cashFlow.length > 0) {
            openTime = moment(cashFlow[0].open_time);
            expenseRepository.getExpenses(id, branch._id, openTime).then(function (expense_details) {
              res.api(200, "Expense retrived successfully", expense_details, true);
            });
          } else {
            res.api(200, "Expense retrived successfully", [], true);
          }

          _context2.next = 13;
          break;

        case 12:
          res.api(200, "IPAD Not registered to Branch", null, false);

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.updateExpense = function _callee3(req, res, _) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          expenseRepository.updateExpense(req.body).then(function (update_success) {
            update_success[0] > 0 ? res.api(200, "updated successfully", null, true) : res.api(404, "no expense found", null, false);
          });

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.deleteExpense = function _callee4(req, res, _) {
  var _req$body3, id, expense_name, created_at, device_id, branch, response;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, id = _req$body3.id, expense_name = _req$body3.expense_name, created_at = _req$body3.created_at, device_id = _req$body3.device_id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(expenseRepository.get_branchInfo(device_id));

        case 3:
          branch = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(expenseRepository.deleteExpense(id));

        case 6:
          response = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(TransactionOutModel.destroy({
            where: {
              reason: expense_name,
              type: "expense",
              expense_id: id,
              branch_id: branch._id
            }
          }));

        case 9:
          response > 0 ? res.api(200, "expense info deleted successfully", null, true) : res.api(404, "No expense found", null, false);

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
};