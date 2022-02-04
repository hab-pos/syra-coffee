"use strict";

var _require = require('./setup-model'),
    DiscountModel = _require.DiscountModel;

var _require2 = require('./setup-repository'),
    setupRepository = _require2.setupRepository;

module.exports.addIVA = function _callee(req, res, _) {
  var _req$body, iva_precent, created_by;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, iva_precent = _req$body.iva_precent, created_by = _req$body.created_by;
          setupRepository.check_uniquenes_iva(iva_precent).then(function (response) {
            console.log("response", response);

            if (response.length == 0) {
              setupRepository.addIva(iva_precent, created_by).then(function (info) {
                res.api(200, "IVA saved successfully", {
                  info: info
                }, true);
              });
            } else {
              res.api(200, "IVA Already available", null, false);
            }
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.getIVA = function _callee2(req, res, _) {
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          setupRepository.get_iva().then(function (ivalist) {
            res.api(200, "IVA retrived successfully", {
              ivalist: ivalist
            }, true);
          });

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.deleteIVA = function _callee3(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.body.id;
          setupRepository.deleteIVA(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "IVA deleted successfully", null, true) : res.api(404, "No IVA found", null, false);
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.addExpense = function _callee4(req, res, _) {
  var _req$body2, expense_name, created_by;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, expense_name = _req$body2.expense_name, created_by = _req$body2.created_by;
          setupRepository.check_uniquenes_Expense(expense_name).then(function (response) {
            if (response.length == 0) {
              setupRepository.addExpense(expense_name, created_by).then(function (info) {
                res.api(200, "Expense saved successfully", {
                  info: info
                }, true);
              });
            } else {
              res.api(200, "Expense Already available", null, false);
            }
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.getExpense = function _callee5(req, res, _) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          setupRepository.get_Expense().then(function (expense_list) {
            res.api(200, "Expense retrived successfully", {
              expense_list: expense_list
            }, true);
          });

        case 1:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.deleteExpense = function _callee6(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.body.id;
          setupRepository.deleteExpense(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "Expense deleted successfully", null, true) : res.api(404, "No Expense found", null, false);
          });

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.update_order = function _callee7(req, res, _) {
  var order, index, element;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          order = req.body.order;
          index = 0;

        case 2:
          if (!(index < order.length)) {
            _context7.next = 9;
            break;
          }

          element = order[index];
          _context7.next = 6;
          return regeneratorRuntime.awrap(DiscountModel.update({
            position: element.order
          }, {
            where: {
              _id: element.id
            }
          }));

        case 6:
          index++;
          _context7.next = 2;
          break;

        case 9:
          res.api(200, "success", "success", true);

        case 10:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports.addDiscount = function _callee8(req, res, _) {
  var _req$body3, discount_name, amount, type, created_by;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body3 = req.body, discount_name = _req$body3.discount_name, amount = _req$body3.amount, type = _req$body3.type, created_by = _req$body3.created_by;
          setupRepository.check_uniquenes_discount(discount_name).then(function (response) {
            if (response.length == 0) {
              setupRepository.addDiscount(discount_name, amount, type, created_by).then(function (info) {
                res.api(200, "Discount saved successfully", {
                  info: info
                }, true);
              });
            } else {
              res.api(200, "Discount Already available", null, false);
            }
          });

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports.getDiscounts = function _callee9(req, res, _) {
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          setupRepository.get_Discounts().then(function (discount_list) {
            res.api(200, "Discount retrived successfully", {
              discount_list: discount_list
            }, true);
          });

        case 1:
        case "end":
          return _context9.stop();
      }
    }
  });
};

module.exports.deleteDiscounts = function _callee10(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          id = req.body.id;
          setupRepository.deleteDiscount(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "Discount deleted successfully", null, true) : res.api(404, "No Discount found", null, false);
          });

        case 2:
        case "end":
          return _context10.stop();
      }
    }
  });
};

module.exports.getExpenseAndIva = function _callee11(req, res, _) {
  var response;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          response = new Object();
          setupRepository.get_iva().then(function (ivalist) {
            response.iva_list = ivalist;
            setupRepository.get_Expense().then(function (expense_list) {
              response.expense_list = expense_list;
              res.api(200, "Expense retrived successfully", response, true);
            });
          });

        case 2:
        case "end":
          return _context11.stop();
      }
    }
  });
};