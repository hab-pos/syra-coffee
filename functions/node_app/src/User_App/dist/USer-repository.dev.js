"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./User-model'),
    UserModel = _require.UserModel,
    UserCreditCards = _require.UserCreditCards;

var UserRepository =
/*#__PURE__*/
function () {
  function UserRepository() {
    _classCallCheck(this, UserRepository);
  }

  _createClass(UserRepository, [{
    key: "addUser",
    value: function addUser(first_name, last_name, birth_day, email, password, default_store) {
      var count, color, colorString, unique_ref;
      return regeneratorRuntime.async(function addUser$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(UserModel.count());

            case 2:
              count = _context.sent;
              color = Math.floor(0x1000000 * (Math.random() + count)).toString(16);
              colorString = '#' + ('000000' + color).slice(-6);
              unique_ref = "SY_" + Math.floor(Math.random() * 1000 + count).toString();
              return _context.abrupt("return", UserModel.create({
                first_name: first_name,
                last_name: last_name,
                birth_day: birth_day,
                email: email,
                password: password,
                default_store: default_store,
                color: colorString,
                user_reference_number: unique_ref
              }));

            case 7:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "loginStatus",
    value: function loginStatus(id, status) {
      return UserModel.update({
        is_logged_in: status
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "deleteUser",
    value: function deleteUser(id) {
      return UserModel.update({
        is_deleted: true
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "updateUser",
    value: function updateUser(request) {
      return UserModel.update(request, {
        where: {
          _id: request.id
        }
      });
    }
  }, {
    key: "addCard",
    value: function addCard(data) {
      return UserCreditCards.create({
        user_id: data.user_id,
        holder_name: data.holder_name,
        card_number: data.card_number,
        tokenUser: data.tokenUser,
        idUser: data.idUser,
        cardHash: data.cardHash,
        expiry_date: data.expiry_date,
        is_default: data.is_default || false
      });
    }
  }, {
    key: "getCard",
    value: function getCard(user_id) {
      return user_id ? UserCreditCards.findAll({
        where: {
          user_id: user_id,
          is_deleted: false
        }
      }) : UserCreditCards.findAll({
        where: {
          is_deleted: false
        }
      });
    }
  }, {
    key: "updateCard",
    value: function updateCard(request) {
      console.log(request);
      return UserCreditCards.update(request, {
        where: {
          _id: request._id
        }
      });
    }
  }, {
    key: "deleteCard",
    value: function deleteCard(id) {
      return UserCreditCards.update({
        is_deleted: true
      }, {
        where: {
          _id: id
        }
      });
    }
  }]);

  return UserRepository;
}();

module.exports.userRepository = new UserRepository();