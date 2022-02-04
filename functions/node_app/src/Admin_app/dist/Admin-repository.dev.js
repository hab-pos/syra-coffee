"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./Admin-model'),
    AdminModel = _require.AdminModel;

var _require2 = require('../../Utils/Common/crypto'),
    comparePassword = _require2.comparePassword;

var _require3 = require('jimp'),
    hasAlpha = _require3.hasAlpha;

var AdminRepository =
/*#__PURE__*/
function () {
  function AdminRepository() {
    _classCallCheck(this, AdminRepository);
  }

  _createClass(AdminRepository, [{
    key: "addAdmin",
    value: function addAdmin(name, email, message, password) {
      return AdminModel.create({
        user_name: name,
        email_id: email,
        admin_recipt_message: message,
        password: password
      });
    }
  }, {
    key: "get_admin_details",
    value: function get_admin_details(query) {
      console.log(query);
      return AdminModel.findOne({
        where: query
      });
    }
  }, {
    key: "update_login_status",
    value: function update_login_status(user_id, status) {
      return AdminModel.update({
        is_logged_in: status
      }, {
        where: {
          _id: user_id
        }
      });
    }
  }, {
    key: "update_password",
    value: function update_password(id, hash) {
      return AdminModel.update({
        password: hash
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "update_user_name",
    value: function update_user_name(id, user_name) {
      return AdminModel.update({
        user_name: user_name,
        email_id: user_name
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "update_user_name_and_pwd",
    value: function update_user_name_and_pwd(id, user_name, hash) {
      return AdminModel.update({
        user_name: user_name,
        email_id: user_name,
        password: hash
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "update_admin_messages",
    value: function update_admin_messages(id, admin_recipt_message) {
      return AdminModel.update({
        admin_recipt_message: admin_recipt_message
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "delete_admin",
    value: function delete_admin(_id) {
      return AdminModel.destroy({
        where: {
          "_id": _id
        }
      });
    }
  }, {
    key: "isUniqueEmail",
    value: function isUniqueEmail(email) {
      return AdminModel.findOne({
        where: {
          "email_id": email
        }
      });
    }
  }, {
    key: "isUniqueName",
    value: function isUniqueName(name) {
      return AdminModel.findOne({
        where: {
          "user_name": name
        }
      });
    }
  }, {
    key: "compare_password",
    value: function compare_password(email_id, password) {
      var admin_details;
      return regeneratorRuntime.async(function compare_password$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(this.get_admin_details({
                "email_id": email_id
              }));

            case 2:
              admin_details = _context.sent;

              if (!admin_details) {
                _context.next = 9;
                break;
              }

              _context.next = 6;
              return regeneratorRuntime.awrap(comparePassword(password, admin_details.password).then(function (status) {
                return {
                  status: status,
                  admin_details: admin_details
                };
              }));

            case 6:
              return _context.abrupt("return", _context.sent);

            case 9:
              return _context.abrupt("return", {
                status: false,
                admin_details: null
              });

            case 10:
            case "end":
              return _context.stop();
          }
        }
      }, null, this);
    }
  }]);

  return AdminRepository;
}();

module.exports.adminRepository = new AdminRepository();