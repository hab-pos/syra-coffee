"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./setup-model'),
    IVAModel = _require.IVAModel,
    DiscountModel = _require.DiscountModel,
    ExpenseModel = _require.ExpenseModel;

var SetupRepository =
/*#__PURE__*/
function () {
  function SetupRepository() {
    _classCallCheck(this, SetupRepository);
  }

  _createClass(SetupRepository, [{
    key: "addIva",
    value: function addIva(iva_precent, created_by) {
      var count, color, colorString;
      return regeneratorRuntime.async(function addIva$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(IVAModel.count());

            case 2:
              count = _context.sent;
              color = Math.floor(0x1000000 * (Math.random() + count)).toString(16);
              colorString = '#' + ('000000' + color).slice(-6);
              return _context.abrupt("return", IVAModel.create({
                iva_percent: iva_precent,
                created_by: created_by,
                color: colorString
              }));

            case 6:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "check_uniquenes_iva",
    value: function check_uniquenes_iva(iva_precent) {
      return IVAModel.findAll({
        where: {
          iva_percent: iva_precent,
          is_deleted: false
        }
      });
    }
  }, {
    key: "deleteIVA",
    value: function deleteIVA(id) {
      return IVAModel.update({
        is_deleted: true
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "get_iva",
    value: function get_iva() {
      return IVAModel.findAll({
        where: {
          is_deleted: false
        },
        order: [["createdAt", "DESC"]]
      });
    }
  }, {
    key: "addExpense",
    value: function addExpense(expense_name, created_by) {
      return ExpenseModel.create({
        expense_name: expense_name,
        created_by: created_by
      });
    }
  }, {
    key: "check_uniquenes_Expense",
    value: function check_uniquenes_Expense(expense_name) {
      return ExpenseModel.findAll({
        where: {
          expense_name: expense_name,
          is_deleted: false
        }
      });
    }
  }, {
    key: "deleteExpense",
    value: function deleteExpense(_id) {
      return ExpenseModel.update({
        is_deleted: true
      }, {
        where: {
          _id: _id
        }
      });
    }
  }, {
    key: "get_Expense",
    value: function get_Expense() {
      return ExpenseModel.findAll({
        where: {
          is_deleted: false
        },
        order: [["createdAt", "DESC"]]
      });
    }
  }, {
    key: "addDiscount",
    value: function addDiscount(discount_name, amount, type, created_by) {
      var count, color, colorString;
      return regeneratorRuntime.async(function addDiscount$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(DiscountModel.count());

            case 2:
              count = _context2.sent;
              color = Math.floor(0x1000000 * (Math.random() + count)).toString(16);
              colorString = '#' + ('000000' + color).slice(-6);
              return _context2.abrupt("return", DiscountModel.create({
                discount_name: discount_name,
                amount: amount,
                type: type,
                created_by: created_by,
                color: colorString
              }));

            case 6:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "check_uniquenes_discount",
    value: function check_uniquenes_discount(discount_name) {
      return DiscountModel.findAll({
        where: {
          discount_name: discount_name,
          is_deleted: false
        }
      });
    }
  }, {
    key: "deleteDiscount",
    value: function deleteDiscount(_id) {
      console.log(_id);
      return DiscountModel.update({
        is_deleted: true
      }, {
        where: {
          _id: _id
        }
      });
    }
  }, {
    key: "get_Discounts",
    value: function get_Discounts() {
      return regeneratorRuntime.async(function get_Discounts$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", DiscountModel.findAll({
                where: {
                  is_deleted: false
                },
                order: [["position", "ASC"]]
              }));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }]);

  return SetupRepository;
}();

module.exports.setupRepository = new SetupRepository();