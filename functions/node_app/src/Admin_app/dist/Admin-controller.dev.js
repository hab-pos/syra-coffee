"use strict";

var _require = require('./Admin-repository'),
    adminRepository = _require.adminRepository;

var _require2 = require('../../Utils/Common/crypto'),
    encryptPassword = _require2.encryptPassword,
    comparePassword = _require2.comparePassword;

var _require3 = require('./Admin-emitter'),
    admin_logged_in = _require3.admin_logged_in;

var _require4 = require('jimp'),
    hash = _require4.hash;

var _require5 = require('../Settings-app/Settings-model'),
    SettingsModel = _require5.SettingsModel;

module.exports.add_admin = function _callee(req, res, _) {
  var _req$body, password, user_name, email_id, admin_recipt_message;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, password = _req$body.password, user_name = _req$body.user_name, email_id = _req$body.email_id, admin_recipt_message = _req$body.admin_recipt_message;
          _context.next = 3;
          return regeneratorRuntime.awrap(encryptPassword(password, function (err, hash) {
            if (err) {
              return res.api(500, "Internel server Error!,Could not generate password hash", null, false);
            }

            adminRepository.addAdmin(user_name, email_id, admin_recipt_message, hash).then(function (get_admin_message) {
              return res.api(200, 'Admin created successfullty', {
                get_admin_message: get_admin_message
              }, true);
            });
          }));

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.admin_login = function _callee2(req, res, _) {
  var _req$body2, email_id, password, result;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          console.log(req.body);
          _req$body2 = req.body, email_id = _req$body2.email_id, password = _req$body2.password;
          _context2.next = 4;
          return regeneratorRuntime.awrap(adminRepository.compare_password(email_id, password));

        case 4:
          result = _context2.sent;

          if (!(result.admin_details != null)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", result.status ? admin_logged_in(result.admin_details, res) : res.api(422, "invalid password", null, false));

        case 9:
          return _context2.abrupt("return", res.api(404, "Not registered Admin, please contact admin", null, false));

        case 10:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.get_admin_details_by_id = function _callee3(req, res) {
  var id;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.body.id;
          _context3.next = 3;
          return regeneratorRuntime.awrap(adminRepository.get_admin_details({
            "_id": id
          }).then(function (admin_details) {
            return admin_details ? res.api(200, "admin detail retrived successfully", {
              admin_details: admin_details
            }, true) : res.api(200, "No admin found", {
              admin_details: admin_details
            }, false);
          }));

        case 3:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.logout = function _callee4(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.body.id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(adminRepository.update_login_status(id, false).then(function (update_data) {
            return update_data[0] > 0 ? res.api(200, "logged out successfully", {
              is_logged_in: false
            }, true) : res.api(200, "No admin found", null, false);
          }));

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.delete_admin = function _callee5(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.body.id;
          _context5.next = 3;
          return regeneratorRuntime.awrap(adminRepository.delete_admin(id).then(function (deleteData) {
            return deleteData > 0 ? res.api(200, "deleted successfully", null, true) : res.api(200, "No admin found", null, false);
          }));

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.update_admin_details = function _callee6(req, res, _) {
  var _req$body3, id, user_name, password, admin_recipt_message, admin_details;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body3 = req.body, id = _req$body3.id, user_name = _req$body3.user_name, password = _req$body3.password, admin_recipt_message = _req$body3.admin_recipt_message;
          _context6.next = 3;
          return regeneratorRuntime.awrap(adminRepository.get_admin_details({
            "_id": id
          }));

        case 3:
          admin_details = _context6.sent;

          if (!(password != null && password != undefined)) {
            _context6.next = 12;
            break;
          }

          if (!admin_details) {
            _context6.next = 9;
            break;
          }

          encryptPassword(password, function (err, hash) {
            adminRepository.update_user_name_and_pwd(id, user_name, hash).then(function (_) {
              res.api(200, "updated successfully", {
                admin_details: admin_details
              }, true);
            });
          });
          _context6.next = 10;
          break;

        case 9:
          return _context6.abrupt("return", res.api(200, "No admin found", {
            admin_details: admin_details
          }, false));

        case 10:
          _context6.next = 19;
          break;

        case 12:
          if (!(user_name != null || user_name != undefined)) {
            _context6.next = 17;
            break;
          }

          _context6.next = 15;
          return regeneratorRuntime.awrap(adminRepository.update_user_name(id, user_name).then(function (update_count) {
            return update_count[0] > 0 ? res.api(200, "updated successfully", {
              admin_recipt_message: admin_recipt_message
            }, true) : res.api(200, "No admin found", null, false);
          }));

        case 15:
          _context6.next = 19;
          break;

        case 17:
          _context6.next = 19;
          return regeneratorRuntime.awrap(SettingsModel.update({
            value: admin_recipt_message
          }, {
            where: {
              "code": 'admin_message'
            }
          }).then(function (update_count) {
            return update_count[0] > 0 ? res.api(200, "updated successfully", {
              admin_recipt_message: admin_recipt_message
            }, true) : res.api(200, "No admin found", null, false);
          }));

        case 19:
        case "end":
          return _context6.stop();
      }
    }
  });
};