"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./Expense-model'),
    ExpenseTableModel = _require.ExpenseTableModel;

var _require2 = require('../Branch-app/Branch-model'),
    BrancheModel = _require2.BrancheModel;

var _require3 = require("../BaristaApp/Barista-model"),
    BaristaModel = _require3.BaristaModel;

var _require4 = require("../SetupApp/setup-model"),
    IVAModel = _require4.IVAModel,
    ExpenseModel = _require4.ExpenseModel;

var _require5 = require("../Transaction-outApp/transaction-out-repository"),
    transactionOutRepository = _require5.transactionOutRepository;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var ExpenseRepository =
/*#__PURE__*/
function () {
  function ExpenseRepository() {
    _classCallCheck(this, ExpenseRepository);
  }

  _createClass(ExpenseRepository, [{
    key: "createTxn",
    value: function createTxn(req) {
      return transactionOutRepository.addTxn(req.date_of_transaction, req.reason, req.type, req.barista_id, req.iva_id, req.total_amount, req.mode_of_payment, req.invoice_number, req.branch_id, req.expense_id);
    }
  }, {
    key: "createExpense",
    value: function createExpense(requestObj) {
      return ExpenseTableModel.create({
        expense_date: requestObj.expense_date,
        motive: requestObj.motive,
        iva_id: requestObj.iva_id,
        price: requestObj.price,
        payment: requestObj.payment,
        branch_id: requestObj.branch_id,
        barista_id: requestObj.barista_id
      });
    }
  }, {
    key: "getExpenses",
    value: function getExpenses(id, branch_id, openTime) {
      console.log(openTime);
      return id ? ExpenseTableModel.findOne({
        where: {
          _id: id,
          is_deleted: false
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }, {
          model: IVAModel,
          as: "iva_info"
        }, {
          model: ExpenseModel,
          as: "expense_info"
        }]
      }) : ExpenseTableModel.findAll({
        where: {
          is_deleted: false,
          branch_id: branch_id,
          createdAt: _defineProperty({}, Op.gte, openTime)
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }, {
          model: IVAModel,
          as: "iva_info"
        }, {
          model: ExpenseModel,
          as: "expense_info"
        }],
        order: [["createdAt", "DESC"]]
      });
    }
  }, {
    key: "deleteExpense",
    value: function deleteExpense(id) {
      return ExpenseTableModel.update({
        is_deleted: true
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "updateExpense",
    value: function updateExpense(query) {
      return ExpenseTableModel.update(query, {
        where: {
          _id: query.id
        }
      });
    }
  }, {
    key: "get_branchInfo",
    value: function get_branchInfo(device_id) {
      return BrancheModel.findOne({
        where: {
          device_id: device_id
        }
      });
    }
  }]);

  return ExpenseRepository;
}();

module.exports.expenseRepository = new ExpenseRepository();