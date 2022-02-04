"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./transaction-out-model'),
    TransactionOutModel = _require.TransactionOutModel;

var _require2 = require("../SetupApp/setup-model"),
    IVAModel = _require2.IVAModel;

var _require3 = require("../BaristaApp/Barista-model"),
    BaristaModel = _require3.BaristaModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var moment = require('moment');

var _require4 = require('../../Utils/constants'),
    constants = _require4.constants;

var TransactionOutRepository =
/*#__PURE__*/
function () {
  function TransactionOutRepository() {
    _classCallCheck(this, TransactionOutRepository);
  }

  _createClass(TransactionOutRepository, [{
    key: "addTxn",
    value: function addTxn(date_of_transaction, reason, type, barista_id, iva_id, total_amount, mode_of_payment, invoice_number, branch_id, expense_id) {
      return TransactionOutModel.create({
        date_of_transaction: date_of_transaction,
        reason: reason,
        type: type,
        barista_id: barista_id,
        iva_id: iva_id,
        total_amount: total_amount,
        mode_of_payment: mode_of_payment,
        invoice_number: invoice_number,
        branch_id: branch_id,
        expense_id: expense_id
      });
    }
  }, {
    key: "deleteTxn",
    value: function deleteTxn(id) {
      return TransactionOutModel.update({
        is_deleted: true
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "getTxns",
    value: function getTxns() {
      return TransactionOutModel.findAll({
        where: {
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
        },
        order: [["createdAt", "DESC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "get_branch_wise_txn",
    value: function get_branch_wise_txn(branch) {
      return TransactionOutModel.findAll({
        where: {
          branch_id: _defineProperty({}, Op["in"], branch),
          date_of_transaction: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["date_of_transaction", "DESC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filter_with_start_end_branch",
    value: function filter_with_start_end_branch(start, end, branch_id) {
      console.log(branch_id, "branch_id_search");
      return TransactionOutModel.findAll({
        where: {
          branch_id: _defineProperty({}, Op["in"], branch_id),
          date_of_transaction: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(end).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["date_of_transaction", "DESC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filter_with_start_and_end",
    value: function filter_with_start_and_end(start, end) {
      return TransactionOutModel.findAll({
        where: {
          date_of_transaction: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(end).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["date_of_transaction", "DESC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filter_with_start",
    value: function filter_with_start(start) {
      console.log(moment(start).utc().tz(constants.TIME_ZONE).startOf('day'));
      return TransactionOutModel.findAll({
        where: {
          date_of_transaction: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(start).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["date_of_transaction", "DESC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filter_with_start_branch",
    value: function filter_with_start_branch(start, branch_id) {
      return TransactionOutModel.findAll({
        where: {
          branch_id: _defineProperty({}, Op["in"], branch_id),
          date_of_transaction: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(start).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["date_of_transaction", "DESC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filterHelper",
    value: function filterHelper(branch, dates) {
      return regeneratorRuntime.async(function filterHelper$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!dates) {
                _context.next = 17;
                break;
              }

              if (!(dates.start != null && dates.end != null)) {
                _context.next = 9;
                break;
              }

              if (!(branch != null)) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", this.filter_with_start_end_branch(dates.start, dates.end, branch));

            case 6:
              return _context.abrupt("return", this.filter_with_start_and_end(dates.start, dates.end));

            case 7:
              _context.next = 15;
              break;

            case 9:
              if (!(branch != null)) {
                _context.next = 13;
                break;
              }

              return _context.abrupt("return", this.filter_with_start_branch(dates.start, branch));

            case 13:
              console.log(branch, dates);
              return _context.abrupt("return", this.filter_with_start(dates.start));

            case 15:
              _context.next = 22;
              break;

            case 17:
              if (!(branch == null && dates == null)) {
                _context.next = 21;
                break;
              }

              return _context.abrupt("return", this.getTxns());

            case 21:
              return _context.abrupt("return", this.get_branch_wise_txn(branch));

            case 22:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);

  return TransactionOutRepository;
}();

module.exports.transactionOutRepository = new TransactionOutRepository();