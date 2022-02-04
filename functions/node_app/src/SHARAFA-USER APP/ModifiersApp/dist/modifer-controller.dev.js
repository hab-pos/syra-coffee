"use strict";

var _require = require('./modifier-repository'),
    ModifiersRepository = _require.ModifiersRepository;

var _require2 = require('./modifier-model'),
    ModifiersModel = _require2.ModifiersModel;

module.exports.addModifier = function _callee(req, res, _) {
  var _req$body, modifier_name, price, iva, beans_value, iva_value, result;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, modifier_name = _req$body.modifier_name, price = _req$body.price, iva = _req$body.iva, beans_value = _req$body.beans_value, iva_value = _req$body.iva_value;
          _context.next = 3;
          return regeneratorRuntime.awrap(ModifiersRepository.addModifier(modifier_name, price, iva, iva_value, beans_value, true));

        case 3:
          result = _context.sent;
          return _context.abrupt("return", res.api(200, "Modifier Added Successfully", result, true));

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.getModifiers = function _callee2(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.body.id;
          ModifiersRepository.getModifiers(id).then(function (modifiers) {
            res.api(200, "Modifiers retrived successfully", modifiers, true);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.getActiveModifiers = function _callee3(req, res, _) {
  var modifiers;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(ModifiersModel.findAll({
            where: {
              is_deleted: false,
              is_Active: true
            },
            order: [["createdAt", "DESC"]]
          }));

        case 2:
          modifiers = _context3.sent;
          return _context3.abrupt("return", res.api(200, "Modifiers retrived successfully", modifiers, true));

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.updateModifiers = function _callee4(req, res, _) {
  var category, result;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(ModifiersRepository.getModifiers(req.body._id));

        case 2:
          category = _context4.sent;

          if (!category) {
            _context4.next = 10;
            break;
          }

          _context4.next = 6;
          return regeneratorRuntime.awrap(ModifiersRepository.updateModifier(req.body));

        case 6:
          result = _context4.sent;
          return _context4.abrupt("return", res.api(200, "Modifier Updated", result, true));

        case 10:
          return _context4.abrupt("return", res.api(200, "Modifier Not available", null, false));

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.updateOnlineStatus = function _callee5(req, res, _) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(ModifiersModel.update({
            is_Active: req.body.is_Active
          }, {
            where: {
              _id: req.body._id
            }
          }));

        case 2:
          return _context5.abrupt("return", res.api(200, "Status updated Successfully", null, false));

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.deleteModifiers = function _callee6(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          id = req.body.id;
          ModifiersRepository.deleteModifier(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "category deleted successfully", null, true) : res.api(404, "No category found", null, false);
          });

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
};