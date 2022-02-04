"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var _require = require('../../Utils/Common/crypto'),
    encryptPassword = _require.encryptPassword,
    comparePassword = _require.comparePassword;

var _require2 = require("./User-repository"),
    userRepository = _require2.userRepository;

var moment = require("moment");

var _require3 = require('./User-model'),
    UserModel = _require3.UserModel,
    UserCreditCards = _require3.UserCreditCards,
    MyCartModel = _require3.MyCartModel,
    UserOrdersModel = _require3.UserOrdersModel,
    AppliedBeans = _require3.AppliedBeans,
    UserorderedProducts = _require3.UserorderedProducts;

var nodemailer = require('nodemailer');

var _require4 = require('../Branch-app/Branch-model'),
    BrancheModel = _require4.BrancheModel;

var _require5 = require('../SHARAFA-USER APP/ModifiersApp/modifier-model'),
    ModifiersModel = _require5.ModifiersModel;

var _require6 = require('../SHARAFA-USER APP/Products_app/products-model'),
    UserProducts = _require6.UserProducts;

var _require7 = require('../SetupApp/setup-model'),
    IVAModel = _require7.IVAModel;

var _require8 = require('../SHARAFA-USER APP/Category_app/category-model'),
    UserCategories = _require8.UserCategories;

var request = require('request');

var _require9 = require('../SHARAFA-USER APP/eventsApp/events-model'),
    SyraEvents = _require9.SyraEvents;

module.exports.checkUser = function _callee(req, res, _) {
  var email, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          email = req.body.email;
          _context.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              email: email,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 3:
          user = _context.sent;

          if (!user) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.api(200, 'Already registered user', null, false));

        case 8:
          return _context.abrupt("return", res.api(200, 'New User', null, true));

        case 9:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.create = function _callee2(req, res, _) {
  var _req$body, first_name, last_name, birth_day, email, password, default_store, date_of_birth, user;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, first_name = _req$body.first_name, last_name = _req$body.last_name, birth_day = _req$body.birth_day, email = _req$body.email, password = _req$body.password, default_store = _req$body.default_store;
          date_of_birth = moment(birth_day, 'DD-MM-YYYY');
          _context2.next = 4;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              email: email,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 4:
          user = _context2.sent;
          console.log("success", user);

          if (!user) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.api(200, 'Already registered user', null, false));

        case 10:
          _context2.next = 12;
          return regeneratorRuntime.awrap(encryptPassword(password, function (err, hash) {
            if (err) {
              return res.api(500, "Internel server Error!,Could not generate password hash", null, false);
            }

            userRepository.addUser(first_name, last_name, date_of_birth, email, hash, default_store).then(function (user_data) {
              UserModel.findOne({
                where: {
                  _id: user_data._id
                },
                include: [{
                  model: BrancheModel,
                  as: "default_store_detail"
                }]
              }).then(function (user) {
                return res.api(200, 'User created successfully', user, true);
              });
            });
          }));

        case 12:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.createCard = function _callee3(req, res, _) {
  var result, _request, user_cards, _result, card;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(UserCreditCards.findOne({
            where: {
              user_id: req.body.user_id,
              cardHash: req.body.cardHash,
              is_deleted: false
            }
          }));

        case 2:
          result = _context3.sent;

          if (!result) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.api(200, 'Card is in your list already!', result, false));

        case 7:
          _request = req.body;
          _context3.next = 10;
          return regeneratorRuntime.awrap(userRepository.getCard(req.body.user_id));

        case 10:
          user_cards = _context3.sent;

          if (user_cards.length == 0) {
            _request.is_default = 1;
          }

          _context3.next = 14;
          return regeneratorRuntime.awrap(userRepository.addCard(_request));

        case 14:
          _result = _context3.sent;
          _context3.next = 17;
          return regeneratorRuntime.awrap(UserCreditCards.findOne({
            where: {
              _id: _result._id
            }
          }));

        case 17:
          card = _context3.sent;
          return _context3.abrupt("return", res.api(200, 'Card added successfully', {
            card: card
          }, true));

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.getCard = function _callee4(req, res, _) {
  var cards;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(userRepository.getCard(req.body.user_id));

        case 2:
          cards = _context4.sent;
          return _context4.abrupt("return", res.api(200, 'Card info retrived successfully', {
            cards: cards
          }, true));

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.updateCard = function _callee5(req, res, _) {
  var card, result;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(UserCreditCards.findOne({
            where: {
              _id: req.body._id,
              is_deleted: false
            }
          }));

        case 2:
          card = _context5.sent;

          if (!card) {
            _context5.next = 17;
            break;
          }

          _context5.next = 6;
          return regeneratorRuntime.awrap(userRepository.updateCard(req.body));

        case 6:
          if (!req.body.is_default) {
            _context5.next = 11;
            break;
          }

          _context5.next = 9;
          return regeneratorRuntime.awrap(UserCreditCards.update({
            is_default: 0
          }, {
            where: {
              user_id: card.user_id,
              is_default: 1
            }
          }));

        case 9:
          _context5.next = 11;
          return regeneratorRuntime.awrap(UserCreditCards.update({
            is_default: 1
          }, {
            where: {
              _id: req.body._id
            }
          }));

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(UserCreditCards.findOne({
            where: {
              _id: req.body._id,
              is_deleted: false
            }
          }));

        case 13:
          result = _context5.sent;
          return _context5.abrupt("return", res.api(200, 'Card updated successfully', {
            card: result
          }, true));

        case 17:
          return _context5.abrupt("return", res.api(200, 'No card Data Found', null, false));

        case 18:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.deleteCard = function _callee6(req, res, _) {
  var card;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(UserCreditCards.findOne({
            where: {
              _id: req.body.id,
              is_deleted: false
            }
          }));

        case 2:
          card = _context6.sent;

          if (!card) {
            _context6.next = 9;
            break;
          }

          _context6.next = 6;
          return regeneratorRuntime.awrap(userRepository.deleteCard(req.body.id));

        case 6:
          return _context6.abrupt("return", res.api(200, 'Card Deleted successfully', null, true));

        case 9:
          return _context6.abrupt("return", res.api(200, 'No card Data Found', null, false));

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.login = function _callee7(req, res, _) {
  var _req$body2, email, password, user;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context7.t0 = JSON;
          _context7.t1 = JSON;
          _context7.next = 5;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              email: email,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 5:
          _context7.t2 = _context7.sent;
          _context7.t3 = _context7.t1.stringify.call(_context7.t1, _context7.t2);
          user = _context7.t0.parse.call(_context7.t0, _context7.t3);

          if (!user) {
            _context7.next = 13;
            break;
          }

          _context7.next = 11;
          return regeneratorRuntime.awrap(comparePassword(password, user.password).then(function (status) {
            if (status) {
              userRepository.loginStatus(user._id, true).then(function (user_data) {
                return res.api(200, 'Logged-in successfully!', user, true);
              });
            } else {
              return res.api(200, 'Invalid password!', null, false);
            }
          }));

        case 11:
          _context7.next = 14;
          break;

        case 13:
          return _context7.abrupt("return", res.api(200, 'Not a registered user!', null, false));

        case 14:
        case "end":
          return _context7.stop();
      }
    }
  });
};

function getCartPriceDetails(user_id) {
  var returnDetails,
      response,
      cartList,
      priceInfo,
      _args8 = arguments;
  return regeneratorRuntime.async(function getCartPriceDetails$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          returnDetails = _args8.length > 1 && _args8[1] !== undefined ? _args8[1] : false;
          response = {};
          _context8.next = 4;
          return regeneratorRuntime.awrap(MyCartModel.findAll({
            where: {
              user_id: user_id,
              is_deleted: false
            },
            include: [{
              model: UserModel,
              as: "user_info"
            }, {
              model: UserProducts,
              as: "product_info"
            }, {
              model: ModifiersModel,
              as: "required_modifier_detail"
            }, {
              model: ModifiersModel,
              as: "optional_modifier_detail"
            }, {
              model: SyraEvents,
              as: "event_info"
            }]
          }));

        case 4:
          cartList = _context8.sent;
          cartList = JSON.parse(JSON.stringify(cartList));
          priceInfo = calculatePrice(cartList);
          response.cart_count = priceInfo.cartList.length;

          if (returnDetails) {
            response.cart_data = priceInfo.cartList;
          }

          response.bill_list = priceInfo.price_details;
          response.total_price = "€" + priceInfo.total_price.toFixed(2);
          response.total_price_to_pay = priceInfo.total_price_to_pay;
          response.proceedToPayOnline = priceInfo.total_price_to_pay > 0;
          response.beans_earned = (priceInfo.total_price * 10).toFixed();
          return _context8.abrupt("return", response);

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  });
}

module.exports.get_user = function _callee8(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee8$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.id,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 2:
          user = _context9.sent;
          return _context9.abrupt("return", res.api(200, 'user info retrived', user, true));

        case 4:
        case "end":
          return _context9.stop();
      }
    }
  });
};

module.exports.logout = function _callee9(req, res, _) {
  var user;
  return regeneratorRuntime.async(function _callee9$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.id,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 2:
          user = _context10.sent;

          if (!user) {
            _context10.next = 7;
            break;
          }

          userRepository.loginStatus(user._id, false).then(function (user_data) {
            return res.api(200, 'Logged-out successfully!', null, true);
          });
          _context10.next = 8;
          break;

        case 7:
          return _context10.abrupt("return", res.api(200, 'Not a registered user!', null, true));

        case 8:
        case "end":
          return _context10.stop();
      }
    }
  });
};

module.exports.delete_user = function _callee10(req, res, _) {
  var user;
  return regeneratorRuntime.async(function _callee10$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.id,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 2:
          user = _context11.sent;

          if (!user) {
            _context11.next = 7;
            break;
          }

          userRepository.deleteUser(user._id).then(function (user_data) {
            return res.api(200, 'User_deleted successfully!', user_data, true);
          });
          _context11.next = 8;
          break;

        case 7:
          return _context11.abrupt("return", res.api(200, 'Not a registered user!', null, true));

        case 8:
        case "end":
          return _context11.stop();
      }
    }
  });
};

module.exports.update = function _callee11(req, res, _) {
  var request, user, _user, _user2, _user3;

  return regeneratorRuntime.async(function _callee11$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          request = JSON.parse(JSON.stringify(req.body));
          _context12.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: request.id,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 3:
          user = _context12.sent;

          if (request.birth_day) {
            request.birth_day = moment(request.birth_day, 'DD-MM-YYYY');
          }

          if (!user) {
            _context12.next = 39;
            break;
          }

          if (!request.password) {
            _context12.next = 15;
            break;
          }

          if (!(request.password.length < 5)) {
            _context12.next = 11;
            break;
          }

          return _context12.abrupt("return", res.api(200, 'Please choose minimum 5 charecters!', null, false));

        case 11:
          _context12.next = 13;
          return regeneratorRuntime.awrap(comparePassword(request.old_password, user.password).then(function (status) {
            if (status) {
              comparePassword(request.password, user.password).then(function (status) {
                if (status) {
                  return res.api(200, 'old and new password cannot be same!', null, false);
                } else {
                  encryptPassword(request.password, function (err, hash) {
                    request.password = hash;
                    userRepository.updateUser(request).then(function (result) {
                      return res.api(200, 'password changed', null, true);
                    });
                  });
                }
              });
            } else {
              return res.api(200, 'Invalid password!', null, false);
            }
          }));

        case 13:
          _context12.next = 37;
          break;

        case 15:
          if (!request.email) {
            _context12.next = 31;
            break;
          }

          _context12.next = 18;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              email: request.email,
              is_deleted: false
            }
          }));

        case 18:
          _user = _context12.sent;

          if (!_user) {
            _context12.next = 23;
            break;
          }

          return _context12.abrupt("return", res.api(200, 'Email already taken!', null, false));

        case 23:
          _context12.next = 25;
          return regeneratorRuntime.awrap(userRepository.updateUser(request));

        case 25:
          _context12.next = 27;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: request.id,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 27:
          _user2 = _context12.sent;
          return _context12.abrupt("return", res.api(200, 'Updated successfully!', _user2, true));

        case 29:
          _context12.next = 37;
          break;

        case 31:
          _context12.next = 33;
          return regeneratorRuntime.awrap(userRepository.updateUser(request));

        case 33:
          _context12.next = 35;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: request.id,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 35:
          _user3 = _context12.sent;
          return _context12.abrupt("return", res.api(200, 'Updated successfully!', _user3, true));

        case 37:
          _context12.next = 40;
          break;

        case 39:
          return _context12.abrupt("return", res.api(200, 'Not a registered user!', null, false));

        case 40:
        case "end":
          return _context12.stop();
      }
    }
  });
};

module.exports.forgotpassword = function _callee12(req, res, _) {
  var user, randomstring;
  return regeneratorRuntime.async(function _callee12$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              email: req.body.email,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 2:
          user = _context13.sent;

          if (!user) {
            _context13.next = 8;
            break;
          }

          randomstring = Math.random().toString(36).slice(-8);
          encryptPassword(randomstring, function (err, hash) {
            userRepository.updateUser({
              _id: user._id,
              password: hash,
              id: user._id
            }).then(function (result) {
              var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                requireTLS: true,
                auth: {
                  user: 'facturas@syra.coffee',
                  pass: 'qnbjgmwtxlkmezaa'
                }
              });
              var mailOptions = {
                from: 'facturas@syra.coffee',
                to: req.body.email,
                subject: 'Password change Alert',
                text: "Here is a new password for your account " + randomstring
              };
              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  return res.api(200, "cannot send Mail", error, false);
                }

                return res.api(200, 'password sent to your mail', null, true);
              });
            });
          });
          _context13.next = 9;
          break;

        case 8:
          return _context13.abrupt("return", res.api(200, 'Not a registered user!', null, true));

        case 9:
        case "end":
          return _context13.stop();
      }
    }
  });
};

module.exports.addCart = function _callee13(req, res, _) {
  var claimWalletFailed, user, product_info, cart_info, cartList, is_gift_present, quantity, predicateBean, index, _quantity, product_beans, total_bean, predicate_bean, is_claiming_gift, response, priceInfo, CartCount, price, discount_price, totalBean, _price, _discount_price, default_card;

  return regeneratorRuntime.async(function _callee13$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          console.log(req.body);
          claimWalletFailed = false;

          if (!(req.body.update_type == "multiple" && (req.body.event_id == null || req.body.event_id == "" || req.body.event_id == undefined))) {
            _context14.next = 5;
            break;
          }

          _context14.next = 5;
          return regeneratorRuntime.awrap(MyCartModel.destroy({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              event_id: req.body.event_id ? req.body.event_id : null,
              wallet_id: req.body.wallet_id ? req.body.wallet_id : null
            }
          }));

        case 5:
          _context14.next = 7;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id,
              is_deleted: false
            }
          }));

        case 7:
          user = _context14.sent;

          if (!user) {
            _context14.next = 102;
            break;
          }

          _context14.next = 11;
          return regeneratorRuntime.awrap(UserProducts.findOne({
            where: {
              _id: req.body.product_id
            }
          }));

        case 11:
          product_info = _context14.sent;
          cart_info = null;
          _context14.next = 15;
          return regeneratorRuntime.awrap(MyCartModel.findAll({
            where: {
              user_id: req.body.user_id,
              is_deleted: false
            },
            include: [{
              model: UserModel,
              as: "user_info"
            }, {
              model: UserProducts,
              as: "product_info"
            }, {
              model: ModifiersModel,
              as: "required_modifier_detail"
            }, {
              model: ModifiersModel,
              as: "optional_modifier_detail"
            }, {
              model: SyraEvents,
              as: "event_info"
            }]
          }));

        case 15:
          cartList = _context14.sent;
          is_gift_present = cartList.filter(function (data) {
            return data.is_claiming_gift;
          }).length == cartList.length;
          quantity = Number(req.body.quantity);
          predicateBean = quantity * Number(product_info.beans_value);

          if (!((req.body.is_beans_applied || req.body.is_claiming_gift) && predicateBean > Number(user.beansEarnerd) && req.body.update_type != "single")) {
            _context14.next = 23;
            break;
          }

          return _context14.abrupt("return", res.api(200, 'Earn more bean to claim more rewards!', null, false));

        case 23:
          index = 0;

        case 24:
          if (!(index < req.body.quantity)) {
            _context14.next = 67;
            break;
          }

          if (!(product_info.setup_selected == "modifiers")) {
            _context14.next = 31;
            break;
          }

          _context14.next = 28;
          return regeneratorRuntime.awrap(MyCartModel.findOne({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              required_modifiers: req.body.required_modifiers && (req.body.required_modifiers[index] == "" || req.body.required_modifiers[index] == "null" || req.body.required_modifiers[index] == undefined) ? null : req.body.required_modifiers[index],
              optional_modifiers: req.body.optional_modifiers && req.body.optional_modifiers[index] != "" && req.body.optional_modifiers[index] != "null" && req.body.optional_modifiers[index] != undefined ? req.body.optional_modifiers[index] : null,
              is_deleted: false,
              event_id: req.body.event_id ? req.body.event_id : null,
              wallet_id: req.body.wallet_id ? req.body.wallet_id : null
            }
          }));

        case 28:
          cart_info = _context14.sent;
          _context14.next = 34;
          break;

        case 31:
          _context14.next = 33;
          return regeneratorRuntime.awrap(MyCartModel.findOne({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              grains: req.body.grinds && req.body.grinds.length > 0 && req.body.grinds[index] != "" && req.body.grinds[index] != "null" && req.body.grinds[index] != undefined ? req.body.grinds[index] : null,
              is_deleted: false,
              event_id: req.body.event_id ? req.body.event_id : null,
              wallet_id: req.body.wallet_id ? req.body.wallet_id : null
            }
          }));

        case 33:
          cart_info = _context14.sent;

        case 34:
          if (!cart_info) {
            _context14.next = 61;
            break;
          }

          if (!(Number(req.body.quantity) < Number(cart_info.quantity))) {
            _context14.next = 40;
            break;
          }

          _context14.next = 38;
          return regeneratorRuntime.awrap(MyCartModel.update({
            quantity: Number(cart_info.quantity) - 1
          }, {
            where: {
              _id: cart_info._id
            }
          }));

        case 38:
          _context14.next = 59;
          break;

        case 40:
          if (!(Number(req.body.quantity) > cart_info.quantity)) {
            _context14.next = 59;
            break;
          }

          if (!(is_gift_present && req.body.update_type == "single" || req.body.is_claiming_gift && req.body.update_type == "single")) {
            _context14.next = 55;
            break;
          }

          if (cart_info.is_claim_wallet) {
            _context14.next = 53;
            break;
          }

          _quantity = Number(cart_info.quantity);
          product_beans = _quantity * Number(product_info.beans_value);
          total_bean = cartList.reduce(function (a, b) {
            return a + (Number(b.quantity) * Number(b.product_info.beans_value) || 0);
          }, 0);
          predicate_bean = total_bean - product_beans + (product_beans + Number(product_info.beans_value));

          if (!(predicate_bean > Number(user.beansEarnerd))) {
            _context14.next = 51;
            break;
          }

          return _context14.abrupt("return", res.api(200, 'Earn more bean to claim more rewards!', null, false));

        case 51:
          _context14.next = 53;
          return regeneratorRuntime.awrap(MyCartModel.update({
            quantity: Number(cart_info.quantity) + 1
          }, {
            where: {
              _id: cart_info._id
            }
          }));

        case 53:
          _context14.next = 58;
          break;

        case 55:
          if (cart_info.is_claim_wallet) {
            _context14.next = 58;
            break;
          }

          _context14.next = 58;
          return regeneratorRuntime.awrap(MyCartModel.update({
            quantity: Number(cart_info.quantity) + 1
          }, {
            where: {
              _id: cart_info._id
            }
          }));

        case 58:
          claimWalletFailed = cart_info.is_claim_wallet;

        case 59:
          _context14.next = 64;
          break;

        case 61:
          is_claiming_gift = req.body.is_claiming_gift ? req.body.is_claiming_gift : req.body.is_beans_applied;
          _context14.next = 64;
          return regeneratorRuntime.awrap(MyCartModel.create({
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            quantity: 1,
            required_modifiers: req.body.required_modifiers && req.body.required_modifiers[index] != "" && req.body.required_modifiers[index] != "null" && req.body.required_modifiers[index] != undefined ? req.body.required_modifiers[index] : null,
            optional_modifiers: req.body.optional_modifiers ? req.body.optional_modifiers[index] != "null" && req.body.optional_modifiers[index] != undefined && req.body.optional_modifiers[index] != "" ? req.body.optional_modifiers[index] : null : null,
            grains: req.body.grinds && req.body.grinds.length > 0 && req.body.grinds[index] != "" ? req.body.grinds[index] : null,
            order_status: "pending",
            is_claiming_gift: is_claiming_gift,
            is_claim_wallet: req.body.is_claim_wallet || false,
            wallet_id: req.body.wallet_id || null,
            is_reorder: req.body.is_reorder || null,
            event_id: req.body.event_id || null
          }));

        case 64:
          index++;
          _context14.next = 24;
          break;

        case 67:
          if (!(req.body.quantity == 0 && (req.body.required_modifiers && req.body.required_modifiers.length > 0 || req.body.optional_modifiers && req.body.optional_modifiers.length > 0 || req.body.grinds && req.body.grinds.length > 0))) {
            _context14.next = 77;
            break;
          }

          if (!(product_info.setup_selected == "modifiers")) {
            _context14.next = 73;
            break;
          }

          _context14.next = 71;
          return regeneratorRuntime.awrap(MyCartModel.destroy({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              required_modifiers: req.body.required_modifiers && req.body.required_modifiers[0] != "" ? req.body.required_modifiers[0] : null,
              optional_modifiers: req.body.optional_modifiers && req.body.optional_modifiers[0] != "" ? req.body.optional_modifiers[0] : null,
              is_deleted: false,
              event_id: req.body.event_id ? req.body.event_id : null,
              wallet_id: req.body.wallet_id || null
            }
          }));

        case 71:
          _context14.next = 75;
          break;

        case 73:
          _context14.next = 75;
          return regeneratorRuntime.awrap(MyCartModel.destroy({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              grains: req.body.grinds && req.body.grinds[0] != "" ? req.body.grinds[0] : null,
              is_deleted: false,
              event_id: req.body.event_id ? req.body.event_id : null,
              wallet_id: req.body.wallet_id || null
            }
          }));

        case 75:
          _context14.next = 80;
          break;

        case 77:
          if (!(req.body.quantity == 0)) {
            _context14.next = 80;
            break;
          }

          _context14.next = 80;
          return regeneratorRuntime.awrap(MyCartModel.destroy({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id
            }
          }));

        case 80:
          _context14.next = 82;
          return regeneratorRuntime.awrap(MyCartModel.findAll({
            where: {
              user_id: req.body.user_id,
              is_deleted: false
            },
            include: [{
              model: UserModel,
              as: "user_info"
            }, {
              model: UserProducts,
              as: "product_info"
            }, {
              model: ModifiersModel,
              as: "required_modifier_detail"
            }, {
              model: ModifiersModel,
              as: "optional_modifier_detail"
            }, {
              model: SyraEvents,
              as: "event_info"
            }]
          }));

        case 82:
          cartList = _context14.sent;
          response = {};
          cartList = JSON.parse(JSON.stringify(cartList));
          priceInfo = calculatePrice(cartList);
          _context14.next = 88;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id || "",
              is_deleted: false
            }
          }));

        case 88:
          CartCount = _context14.sent;
          response.cart_data = priceInfo.cartList;
          response.bill_list = priceInfo.price_details;
          is_gift_present = cartList.filter(function (data) {
            return data.is_claiming_gift;
          }).length == cartList.length;

          if (req.body.is_beans_applied) {
            if (is_gift_present) {
              response.beans_applied = Number(user.beansEarnerd) < priceInfo.total_bean ? Number(user.beansEarnerd).toFixed() : priceInfo.total_bean.toFixed(); // response.discount_price = "€" + (Number(response.beans_applied) / 10).toFixed(2)

              price = (Number(priceInfo.total_bean) - Number(response.beans_applied)) / 10; // let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)

              response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00");
              response.beans_earned = price > 0 ? (price * 10).toFixed() : "0.00";
              response.total_price_to_pay = price * 100;
              response.proceedToPayOnline = price * 100 > 0;
              response.is_all_gift = is_gift_present && price <= 0;
              discount_price = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10;
              response.discount_price = "€" + Number(discount_price).toFixed(2);
            } else {
              // let totalBean = Math.round(Number(priceInfo.total_price) * 10)
              totalBean = Number(priceInfo.total_bean);
              response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0); // response.discount_price = (Number(response.beans_applied) / 10).toFixed(2)

              _price = Number(priceInfo.total_price) - Number(response.beans_applied) / 10;
              response.total_price = "€" + (_price > 0 ? _price.toFixed(2) : "0.00");
              response.beans_earned = _price > 0 ? (_price * 10).toFixed() : "0.00";
              response.total_price_to_pay = _price * 100;
              response.proceedToPayOnline = _price * 100 > 0;
              response.is_all_gift = is_gift_present && _price <= 0;
              _discount_price = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10;
              response.discount_price = "€" + Number(_discount_price).toFixed(2);
            }
          } else {
            response.beans_applied = "0.00";
            response.discount_price = "0.00";
            response.total_price = "€" + priceInfo.total_price.toFixed(2);
            response.beans_earned = (priceInfo.total_price * 10).toFixed();
            response.total_price_to_pay = priceInfo.total_price_to_pay;
            response.proceedToPayOnline = priceInfo.total_price_to_pay > 0;
            response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0;
          } // response.total_price = "€" + (priceInfo.total_price).toFixed(2)
          // response.beans_earned = (priceInfo.total_price * 10).toFixed()


          _context14.next = 95;
          return regeneratorRuntime.awrap(UserCreditCards.findOne({
            where: {
              user_id: req.body.user_id,
              is_default: true,
              is_deleted: false
            }
          }));

        case 95:
          default_card = _context14.sent;
          response.default_branch = user.default_store_detail;
          response.default_card = default_card;
          response.cart_count = CartCount; // response.discount_price = ""
          // response.beans_applied = ""

          return _context14.abrupt("return", res.api(200, claimWalletFailed ? 'You cannot update your wallet product count!' : 'updated to cart', response, true));

        case 102:
          return _context14.abrupt("return", res.api(200, 'No user Found, Could not add to cart!', null, true));

        case 103:
        case "end":
          return _context14.stop();
      }
    }
  });
};

module.exports.updateCart = function _callee14(req, res, _) {
  var user, product_info, cart_info, index, item, _item, _index, response;

  return regeneratorRuntime.async(function _callee14$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id,
              is_deleted: false
            }
          }));

        case 2:
          user = _context15.sent;

          if (!user) {
            _context15.next = 63;
            break;
          }

          _context15.next = 6;
          return regeneratorRuntime.awrap(UserProducts.findOne({
            where: {
              _id: req.body.product_id,
              is_deleted: false
            }
          }));

        case 6:
          product_info = _context15.sent;
          cart_info = null; //explicit_delete from APP

          index = 0;

        case 9:
          if (!(index < req.body.req_modifiers_to_remove.length)) {
            _context15.next = 36;
            break;
          }

          if (!(product_info.setup_selected == "modifiers")) {
            _context15.next = 23;
            break;
          }

          _context15.next = 13;
          return regeneratorRuntime.awrap(MyCartModel.findOne({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              required_modifiers: req.body.req.body.req_modifiers_to_remove[index],
              optional_modifiers: req.body.req.body.opt_modifiers_to_remove ? req.body.req.body.opt_modifiers_to_remove[index] : null,
              is_deleted: false
            }
          }));

        case 13:
          item = _context15.sent;

          if (!(Number(item.quantity) > 1)) {
            _context15.next = 19;
            break;
          }

          _context15.next = 17;
          return regeneratorRuntime.awrap(MyCartModel.update({
            quantity: Number(item.quantity) - 1
          }, {
            where: {
              _id: item._id,
              event_id: req.body.event_id
            }
          }));

        case 17:
          _context15.next = 21;
          break;

        case 19:
          _context15.next = 21;
          return regeneratorRuntime.awrap(MyCartModel.destroy({
            where: {
              _id: item._id
            }
          }));

        case 21:
          _context15.next = 33;
          break;

        case 23:
          _context15.next = 25;
          return regeneratorRuntime.awrap(MyCartModel.findOne({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              grains: req.body.grinds_to_remove[index],
              is_deleted: false
            }
          }));

        case 25:
          _item = _context15.sent;

          if (!(Number(_item.quantity) > 1)) {
            _context15.next = 31;
            break;
          }

          _context15.next = 29;
          return regeneratorRuntime.awrap(MyCartModel.update({
            quantity: Number(_item.quantity) - 1
          }, {
            where: {
              _id: _item._id,
              event_id: req.body.event_id
            }
          }));

        case 29:
          _context15.next = 33;
          break;

        case 31:
          _context15.next = 33;
          return regeneratorRuntime.awrap(MyCartModel.destroy({
            where: {
              _id: _item._id
            }
          }));

        case 33:
          index++;
          _context15.next = 9;
          break;

        case 36:
          _index = 0;

        case 37:
          if (!(_index < req.body.quantity)) {
            _context15.next = 57;
            break;
          }

          if (!(product_info.setup_selected == "modifiers")) {
            _context15.next = 44;
            break;
          }

          _context15.next = 41;
          return regeneratorRuntime.awrap(MyCartModel.findOne({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              required_modifiers: req.body.required_modifiers[_index] || null,
              optional_modifiers: req.body.optional_modifiers ? req.body.optional_modifiers[_index] : null,
              is_deleted: false
            }
          }));

        case 41:
          cart_info = _context15.sent;
          _context15.next = 47;
          break;

        case 44:
          _context15.next = 46;
          return regeneratorRuntime.awrap(MyCartModel.findOne({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              grains: req.body.grinds ? req.body.grinds[_index] : null,
              is_deleted: false
            }
          }));

        case 46:
          cart_info = _context15.sent;

        case 47:
          if (!cart_info) {
            _context15.next = 52;
            break;
          }

          _context15.next = 50;
          return regeneratorRuntime.awrap(MyCartModel.update({
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            quantity: cart_info.quantity,
            required_modifiers: req.body.required_modifiers ? req.body.required_modifiers[_index] : null,
            optional_modifiers: req.body.optional_modifiers ? req.body.optional_modifiers[_index] != "null" ? req.body.optional_modifiers[_index] : null : null,
            grains: req.body.grinds ? req.body.grinds[_index] : null,
            order_status: "pending"
          }, {
            where: {
              _id: cart_info._id
            }
          }));

        case 50:
          _context15.next = 54;
          break;

        case 52:
          _context15.next = 54;
          return regeneratorRuntime.awrap(MyCartModel.create({
            user_id: req.body.user_id,
            product_id: req.body.product_id,
            quantity: 1,
            required_modifiers: req.body.required_modifiers ? req.body.required_modifiers[_index] : null,
            optional_modifiers: req.body.optional_modifiers ? req.body.optional_modifiers[_index] != "null" ? req.body.optional_modifiers[_index] : null : null,
            grains: req.body.grinds ? req.body.grinds[_index] : null,
            order_status: "pending",
            is_reorder: req.body.is_reorder
          }));

        case 54:
          _index++;
          _context15.next = 37;
          break;

        case 57:
          _context15.next = 59;
          return regeneratorRuntime.awrap(getCartPriceDetails(req.body.user_id, true));

        case 59:
          response = _context15.sent;
          return _context15.abrupt("return", res.api(200, 'cart updated', response, true));

        case 63:
          return _context15.abrupt("return", res.api(200, 'No user Found, Could not add to cart!', null, true));

        case 64:
        case "end":
          return _context15.stop();
      }
    }
  });
};

module.exports.getCart = function _callee15(req, res, _) {
  var user, response, cartList, priceInfo, default_card, is_gift_present, is_all_wallet, totalBean, price, discount_price;
  return regeneratorRuntime.async(function _callee15$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id,
              is_deleted: false
            },
            include: [{
              model: BrancheModel,
              as: "default_store_detail"
            }]
          }));

        case 2:
          user = _context16.sent;
          response = {};

          if (!user) {
            _context16.next = 28;
            break;
          }

          _context16.next = 7;
          return regeneratorRuntime.awrap(MyCartModel.findAll({
            where: {
              user_id: req.body.user_id,
              is_deleted: false
            },
            include: [{
              model: UserModel,
              as: "user_info"
            }, {
              model: UserProducts,
              as: "product_info"
            }, {
              model: ModifiersModel,
              as: "required_modifier_detail"
            }, {
              model: ModifiersModel,
              as: "optional_modifier_detail"
            }, {
              model: SyraEvents,
              as: "event_info"
            }]
          }));

        case 7:
          cartList = _context16.sent;
          cartList = JSON.parse(JSON.stringify(cartList));
          priceInfo = calculatePrice(cartList);
          response.cart_data = priceInfo.cartList;
          response.bill_list = priceInfo.price_details;
          response.total_price = "€" + priceInfo.total_price.toFixed(2);
          response.beans_earned = priceInfo.bean_to_earn.toFixed(0);
          _context16.next = 16;
          return regeneratorRuntime.awrap(UserCreditCards.findOne({
            where: {
              user_id: req.body.user_id,
              is_default: true,
              is_deleted: false
            }
          }));

        case 16:
          default_card = _context16.sent;
          response.default_branch = user.default_store_detail;
          response.default_card = default_card;
          response.enable_bean = priceInfo.total_bean <= user.beansEarnerd;
          is_gift_present = cartList.filter(function (data) {
            return data.is_claiming_gift;
          }).length == cartList.length;
          response.is_all_gift = is_gift_present;
          is_all_wallet = cartList.filter(function (data) {
            return data.is_claim_wallet;
          }).length == cartList.length;
          response.is_all_wallet = is_all_wallet; // if (req.body.is_beans_applied) {
          //     if (is_gift_present) {
          //         response.beans_applied = Number(user.beansEarnerd) < priceInfo.total_bean ? Number(user.beansEarnerd).toFixed() : priceInfo.total_bean.toFixed()
          //         let price = (Number(priceInfo.total_bean) - Number(response.beans_applied)) / 10
          //         // let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
          //         response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
          //         response.beans_earned =  price > 0 ? (price * 10).toFixed() : "0.00"
          //         response.total_price_to_pay = price * 100
          //         response.proceedToPayOnline = (price * 100) > 0
          //         response.is_all_gift = is_gift_present && price <= 0
          //         let discount_price =  Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
          //         response.discount_price = "€" + (Number(discount_price)).toFixed(2)
          //     }
          //     else {
          //         // let totalBean = Math.round(Number(priceInfo.total_price) * 10)
          //         let totalBean = Number(priceInfo.total_bean)
          //         response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0)
          //         // response.discount_price = "€" + (Number(response.beans_applied) / 10).toFixed(2)
          //         let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
          //         response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
          //         response.beans_earned =  price > 0 ? (price * 10).toFixed() : "0.00"
          //         response.total_price_to_pay = price * 100
          //         response.proceedToPayOnline = (price * 100) > 0
          //         response.is_all_gift = is_gift_present && price <= 0
          //         let discount_price =  Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
          //         response.discount_price = "€" + (Number(discount_price)).toFixed(2)
          //     }
          // }
          // else {

          if (is_gift_present) {
            totalBean = Number(priceInfo.total_bean);
            response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0);
            price = Number(priceInfo.total_price) - Number(response.beans_applied) / 10;
            response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00");
            response.beans_earned = price > 0 ? (price * 10).toFixed() : "0.00";
            response.total_price_to_pay = price;
            response.proceedToPayOnline = price > 0;
            response.is_all_gift = is_gift_present && price <= 0;
            discount_price = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10;
            response.discount_price = "€" + Number(discount_price).toFixed(2);
          } else {
            // response.discount_price = "0.00"
            // response.beans_applied = "0.00"
            // response.total_price_to_pay = priceInfo.total_price_to_pay
            // response.proceedToPayOnline = priceInfo.total_price_to_pay > 0
            // response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0
            response.beans_applied = "0.00";
            response.discount_price = "0.00";
            response.total_price = "€" + priceInfo.total_price.toFixed(2);
            response.beans_earned = (priceInfo.total_price * 10).toFixed();
            response.total_price_to_pay = priceInfo.total_price_to_pay;
            response.proceedToPayOnline = priceInfo.total_price_to_pay > 0;
            response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0;
          } // }


          return _context16.abrupt("return", res.api(200, 'cart data retrived successfully', response, true));

        case 28:
          return _context16.abrupt("return", res.api(200, 'No user Found', null, true));

        case 29:
        case "end":
          return _context16.stop();
      }
    }
  });
};

module.exports.apply_beans = function _callee16(req, res, _) {
  var user, response, cartList, priceInfo, is_gift_present, errorMessage, price, discount_price, totalBean, _price2, _discount_price2;

  return regeneratorRuntime.async(function _callee16$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id,
              is_deleted: false
            }
          }));

        case 2:
          user = _context17.sent;
          response = {};

          if (!user) {
            _context17.next = 29;
            break;
          }

          _context17.next = 7;
          return regeneratorRuntime.awrap(MyCartModel.findAll({
            where: {
              user_id: req.body.user_id,
              is_deleted: false
            },
            include: [{
              model: UserModel,
              as: "user_info"
            }, {
              model: UserProducts,
              as: "product_info"
            }, {
              model: ModifiersModel,
              as: "required_modifier_detail"
            }, {
              model: ModifiersModel,
              as: "optional_modifier_detail"
            }, {
              model: SyraEvents,
              as: "event_info"
            }]
          }));

        case 7:
          cartList = _context17.sent;
          cartList = JSON.parse(JSON.stringify(cartList));
          priceInfo = calculatePrice(cartList);
          is_gift_present = cartList.filter(function (data) {
            return data.is_claiming_gift;
          }).length == cartList.length;
          response.is_all_gift = is_gift_present;

          if (!(req.body.type == "apply")) {
            _context17.next = 21;
            break;
          }

          if (!(priceInfo.total_bean > user.beansEarnerd)) {
            _context17.next = 18;
            break;
          }

          errorMessage = "You should have " + priceInfo.total_bean + " to purchase through bean!, but you have only " + user.beansEarnerd + " beans";
          return _context17.abrupt("return", res.api(200, errorMessage, null, false));

        case 18:
          if (is_gift_present) {
            response.beans_applied = Number(user.beansEarnerd) < priceInfo.total_bean ? Number(user.beansEarnerd).toFixed() : priceInfo.total_bean.toFixed(); // response.discount_price = "€" + (Number(response.beans_applied) / 10).toFixed(2)

            price = (Number(priceInfo.total_bean) - Number(response.beans_applied)) / 10; // let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)

            response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00");
            response.beans_earned = price > 0 ? (price * 10).toFixed() : "0.00";
            response.total_price_to_pay = price * 100;
            response.proceedToPayOnline = price * 100 > 0;
            response.is_all_gift = is_gift_present && price <= 0;
            discount_price = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10;
            response.discount_price = "€" + Number(discount_price).toFixed(2);
          } else {
            // let totalBean = Math.round(Number(priceInfo.total_price) * 10)
            totalBean = Number(priceInfo.total_bean);
            response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0); // response.discount_price = "€" + (Number(response.beans_applied) / 10).toFixed(2)

            _price2 = Number(priceInfo.total_price) - Number(response.beans_applied) / 10;
            response.total_price = "€" + (_price2 > 0 ? _price2.toFixed(2) : "0.00");
            response.beans_earned = _price2 > 0 ? (_price2 * 10).toFixed() : "0.00";
            response.total_price_to_pay = _price2 * 100;
            response.proceedToPayOnline = _price2 * 100 > 0;
            response.is_all_gift = is_gift_present && _price2 <= 0;
            _discount_price2 = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10;
            response.discount_price = "€" + Number(_discount_price2).toFixed(2);
          }

        case 19:
          _context17.next = 26;
          break;

        case 21:
          response.total_price = "€" + priceInfo.total_price.toFixed(2);
          response.beans_earned = (priceInfo.total_price * 10).toFixed();
          response.total_price_to_pay = priceInfo.total_price_to_pay;
          response.proceedToPayOnline = priceInfo.total_price_to_pay > 0;
          response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0;

        case 26:
          return _context17.abrupt("return", res.api(200, 'cart data retrived successfully', response, true));

        case 29:
          return _context17.abrupt("return", res.api(200, 'No user Found', null, true));

        case 30:
        case "end":
          return _context17.stop();
      }
    }
  });
};

function calculatePrice(cartList) {
  var grinds_list = [{
    grind_name: "Whole Beans",
    _id: "whole_beans",
    price: "0",
    beans_value: "0"
  }, {
    grind_name: "Espresso",
    _id: "espresso",
    price: "0",
    beans_value: "0"
  }, {
    grind_name: "Moka Pot",
    _id: "moka_pot",
    price: "0",
    beans_value: "0"
  }, {
    grind_name: "French Press",
    _id: "french_press",
    price: "0",
    beans_value: "0"
  }, {
    grind_name: "Filter",
    _id: "filter",
    price: "0",
    beans_value: "0"
  }];
  var price_details = [];
  var total_price = 0.0; //to calculte overall total

  var total_price_with_out_tax = 0.0;
  var total_bean = 0;
  var selected_graind = null;
  var bean_to_earn = 0;

  for (var index = 0; index < cartList.length; index++) {
    var _element = cartList[index];
    product_total = 0;
    product_bean = 0; //to calculte indivdual product total

    product_total_wo_tax = 0;

    if (_element.product_info.setup_selected == "modifiers") {
      //to calculate over all price
      total_price += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0.00 : _element.product_info.price) + Number(_element.is_claim_wallet ? 0.00 : _element.required_modifier_detail ? _element.required_modifier_detail.price : "0") + (_element.is_claim_wallet ? 0.00 : _element.optional_modifier_detail != null ? Number(_element.is_claim_wallet ? 0.00 : _element.optional_modifier_detail.price) : 0)); //total_bean

      total_bean += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.beans_value) + Number(_element.is_claim_wallet ? 0 : _element.required_modifier_detail ? _element.required_modifier_detail.beans_value : "0") + (_element.optional_modifier_detail != null ? Number(_element.is_claim_wallet ? 0 : _element.optional_modifier_detail.beans_value || "0") : 0)); //to caluclate total_price without tax

      total_price_with_out_tax += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.price_without_tax) + Number(_element.is_claim_wallet ? 0 : _element.required_modifier_detail ? _element.required_modifier_detail.price_without_tax : "0") + (_element.optional_modifier_detail != null ? Number(_element.is_claim_wallet ? 0 : _element.optional_modifier_detail.price_without_tax || "0") : 0)); //to caluclate total_price without tax

      product_total_wo_tax += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.price_without_tax) + Number(_element.is_claim_wallet ? 0 : _element.required_modifier_detail ? _element.required_modifier_detail.price_without_tax : "0") + (_element.optional_modifier_detail != null ? Number(_element.is_claim_wallet ? 0 : _element.optional_modifier_detail.price_without_tax) : 0)); //to calculte indivdual product total

      product_total += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.price) + Number(_element.is_claim_wallet ? 0 : _element.required_modifier_detail ? _element.required_modifier_detail.price : "0") + (_element.optional_modifier_detail != null ? Number(_element.is_claim_wallet ? 0 : _element.optional_modifier_detail.price) : 0)); //to calculte indivdual product bean

      product_bean += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.beans_value) + Number(_element.is_claim_wallet ? 0 : _element.required_modifier_detail ? _element.required_modifier_detail.beans_value : "0") + (_element.optional_modifier_detail != null ? Number(_element.is_claim_wallet ? 0 : _element.optional_modifier_detail.beans_value) : 0)); //to display price list

      price_details.push({
        title: _element.quantity + "X " + _element.product_info.product_name,
        price: "€" + (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : _element.product_info.price)).toFixed(2),
        beans_value: (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : _element.product_info.beans_value)).toFixed(),
        is_bold: true
      });

      if (_element.required_modifier_detail != null && _element.required_modifier_detail != undefined) {
        price_details.push({
          title: _element.quantity + "X " + _element.required_modifier_detail.modifier_name,
          price: "€" + (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : _element.required_modifier_detail.price)).toFixed(2),
          beans_value: (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : _element.required_modifier_detail.beans_value)).toFixed(),
          is_bold: false
        });
      }

      if (_element.optional_modifier_detail != null && _element.optional_modifier_detail != undefined) {
        // //to calculate over all price
        // total_price += Number(element.optional_modifier_detail.price)
        // total_bean += Number(element.optional_modifier_detail.beans_value || "0")
        // //to caluclate total_price without tax
        // total_price_with_out_tax += Number(element.optional_modifier_detail.price_without_tax || "0")
        // //to calculte indivdual product total
        // product_total += Number(element.optional_modifier_detail.price)
        //  //to calculte indivdual product bean
        //  product_bean += Number(element.optional_modifier_detail.beans_value)
        // //to calculte indivdual product total wo tax
        // product_total_wo_tax += Number(element.optional_modifier_detail.price_without_tax)
        //to display price list
        price_details.push({
          title: _element.quantity + "X " + _element.optional_modifier_detail.modifier_name,
          price: "€" + (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : _element.optional_modifier_detail.price)).toFixed(2),
          beans_value: (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : _element.optional_modifier_detail.beans_value)).toFixed(),
          is_bold: false
        });
      } else {}
    } else {
      for (var _index2 = 0; _index2 < grinds_list.length; _index2++) {
        var item = grinds_list[_index2];

        if (item._id.toLowerCase() == _element.grains.toLowerCase().replace(' ', '_')) {
          selected_graind = item;
          break;
        }
      } //to calculate over all price


      product_total += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.price) + Number(selected_graind ? _element.is_claim_wallet ? 0 : selected_graind.price : null));
      product_total_wo_tax = product_total; //to calculate over all bean

      product_bean += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.beans_value) + Number(selected_graind ? _element.is_claim_wallet ? 0 : selected_graind.beans_value : null)); //to calculte indivdual product total

      total_price += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.price) + Number(selected_graind ? _element.is_claim_wallet ? 0 : selected_graind.price : 0));
      total_bean += Number(_element.quantity) * (Number(_element.is_claim_wallet ? 0 : _element.product_info.beans_value) + Number(selected_graind ? _element.is_claim_wallet ? 0 : selected_graind.beans_value : 0));
      total_price_with_out_tax = total_price; //to display price list

      price_details.push({
        title: _element.quantity + "X " + _element.product_info.product_name,
        price: "€" + (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : _element.product_info.price)).toFixed(2),
        beans_value: (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : _element.product_info.beans_value)).toFixed(),
        is_bold: true
      });

      if (selected_graind) {
        price_details.push({
          title: _element.quantity + "X " + selected_graind.grind_name,
          price: "€" + (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : selected_graind.price)).toFixed(2),
          beans_value: (Number(_element.quantity) * Number(_element.is_claim_wallet ? 0 : selected_graind.beans_value)).toFixed(),
          is_bold: false
        });
      }
    }

    if (_element.event_info != null && _element.event_info != undefined) {
      var reward_type = _element.event_info.reward_mode;

      if (reward_type == "discount50") {
        total_price = total_price - product_total + product_total / 2; // here total value gonna increase so remove the actual total from  total_price and add new one

        total_price_with_out_tax = total_price_with_out_tax - product_total_wo_tax + product_total_wo_tax / 2; // as mentioned above -- for total price

        product_total = product_total / 2;
        product_total_wo_tax = product_total_wo_tax / 2;
        bean_to_earn += product_total * 10;
        price_details.push({
          title: "Applied -- " + _element.event_info.reward_mode_string + " for " + _element.event_info.event_name,
          price: "€" + Number(product_total).toFixed(2),
          beans_value: "€" + Number(product_total).toFixed(2),
          is_bold: false
        });
      } else {
        console.log("product_bean", product_bean, "tit_bean", bean_to_earn, product_bean * 2);
        bean_to_earn += product_total * 10 * 2; // here bean value gonna increase so remove the actual bean from total bean and add new one

        price_details.push({
          title: "Applied -- " + _element.event_info.reward_mode_string + " for " + _element.event_info.event_name,
          price: "",
          beans_value: "",
          is_bold: false
        });
      }
    } else {
      bean_to_earn += product_total * 10;
    }

    cartList[index].product_total = "€" + product_total.toFixed(2);
    cartList[index].product_bean = product_bean.toFixed(0);
    cartList[index].product_total_wo_tax = "€" + product_total_wo_tax.toFixed(2);
    cartList[index].grinds_price = selected_graind ? selected_graind.price : 0;
    cartList[index].grinds_beans = selected_graind ? selected_graind.beans_value : 0;
    cartList[index].grinds_name = selected_graind ? selected_graind.grind_name : 0; // cartList[index].modifiers_list = element.product_info.setup_selected == "modifiers" ? element.optional_modifiers ? [element.required_modifier_detail ? element.required_modifier_detail.modifier_name : "", element.optional_modifier_detail ? element.optional_modifier_detail.modifier_name : ""].join(',') : element.required_modifier_detail ? [element.required_modifier_detail.modifier_name].join(',') : "" : selected_graind ? [selected_graind.grind_name].join(',') : ""

    console.log(_element.required_modifier_detail, _element.required_modifier_detail);

    if (_element.product_info.setup_selected == "modifiers") {
      if (_element.optional_modifiers != null && _element.optional_modifiers != "" && _element.required_modifier_detail != null && _element.required_modifier_detail != "") {
        cartList[index].modifiers_list = [_element.required_modifier_detail.modifier_name, _element.optional_modifier_detail.modifier_name].join(',');
      } else {
        if (_element.required_modifier_detail != null && _element.required_modifier_detail != "") {
          cartList[index].modifiers_list = [_element.required_modifier_detail.modifier_name].join(",");
        }

        if (_element.optional_modifier_detail != null && _element.optional_modifier_detail != "") {
          cartList[index].modifiers_list = [_element.optional_modifier_detail.modifier_name].join(",");
        }
      }
    } else {
      cartList[index].modifiers_list = selected_graind ? [selected_graind.grind_name].join(',') : "";
    }

    if (cartList[index].event_id != null && cartList[index].event_id != "") {
      var eventName = "(" + cartList[index].event_info.event_name + ")";
      cartList[index].modifiers_list = cartList[index].modifiers_list ? cartList[index].modifiers_list.concat(eventName) : eventName;
    }

    if (cartList[index].wallet_id != null && cartList[index].wallet_id != "") {
      cartList[index].modifiers_list = "(Wallet Gift)";
    }
  }

  console.log({
    cartList: cartList,
    price_details: price_details,
    total_price: total_price,
    total_price_with_out_tax: total_price_with_out_tax,
    total_bean: total_bean,
    total_price_to_pay: total_price * 100,
    bean_to_earn: bean_to_earn
  });
  return {
    cartList: cartList,
    price_details: price_details,
    total_price: total_price,
    total_price_with_out_tax: total_price_with_out_tax,
    total_bean: total_bean,
    total_price_to_pay: total_price * 100,
    bean_to_earn: bean_to_earn
  };
}

module.exports.deleteCart = function _callee17(req, res, _) {
  var user, cart_info, CartCount;
  return regeneratorRuntime.async(function _callee17$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id,
              is_deleted: false
            }
          }));

        case 2:
          user = _context18.sent;

          if (!user) {
            _context18.next = 24;
            break;
          }

          _context18.next = 6;
          return regeneratorRuntime.awrap(MyCartModel.findAll({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              is_deleted: false
            }
          }));

        case 6:
          cart_info = _context18.sent;

          if (!(cart_info.length > 0)) {
            _context18.next = 21;
            break;
          }

          if (!req.body.is_wallet) {
            _context18.next = 13;
            break;
          }

          _context18.next = 11;
          return regeneratorRuntime.awrap(MyCartModel.destroy({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              required_modifiers: req.body.required_modifier || null,
              optional_modifiers: req.body.optional_modifier || null,
              grains: req.body.grind || null,
              wallet_id: req.body.wallet_id,
              is_deleted: false
            }
          }));

        case 11:
          _context18.next = 15;
          break;

        case 13:
          _context18.next = 15;
          return regeneratorRuntime.awrap(MyCartModel.destroy({
            where: {
              user_id: req.body.user_id,
              product_id: req.body.product_id,
              is_deleted: false
            }
          }));

        case 15:
          _context18.next = 17;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id || "",
              is_deleted: false
            }
          }));

        case 17:
          CartCount = _context18.sent;
          return _context18.abrupt("return", res.api(200, 'Removed from cart', {
            cart_count: CartCount
          }, true));

        case 21:
          return _context18.abrupt("return", res.api(200, 'No matching entry found', null, true));

        case 22:
          _context18.next = 25;
          break;

        case 24:
          return _context18.abrupt("return", res.api(200, 'No user Found, Could not delete from cart!', null, true));

        case 25:
        case "end":
          return _context18.stop();
      }
    }
  });
};

module.exports.cancellOrder = function _callee18(req, res, _) {
  var order, user, cart_count, collect_count, beansEarnerd, _cart_count, _collect_count;

  return regeneratorRuntime.async(function _callee18$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.next = 2;
          return regeneratorRuntime.awrap(UserOrdersModel.findOne({
            where: {
              _id: req.body.order_id
            }
          }));

        case 2:
          order = _context19.sent;
          _context19.next = 5;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id
            }
          }));

        case 5:
          user = _context19.sent;

          if (!(req.body.type == "wallet")) {
            _context19.next = 17;
            break;
          }

          UserOrdersModel.update({
            checkout_method: "wallet"
          }, {
            where: {
              _id: req.body.order_id
            }
          });
          _context19.next = 10;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id || "",
              is_deleted: false
            }
          }));

        case 10:
          cart_count = _context19.sent;
          _context19.next = 13;
          return regeneratorRuntime.awrap(UserOrdersModel.count({
            where: {
              user_id: req.body.user_id || "",
              order_status: "pending",
              checkout_method: "collect"
            }
          }));

        case 13:
          collect_count = _context19.sent;
          return _context19.abrupt("return", res.api(200, 'Order stored in wallet', {
            cart_count: cart_count,
            collect_count: collect_count
          }, true));

        case 17:
          UserOrdersModel.update({
            order_status: "cancelled"
          }, {
            where: {
              _id: req.body.order_id
            }
          });
          AppliedBeans.destroy({
            where: {
              order_id: req.body.order_id
            }
          });
          beansEarnerd = Number(user.beansEarnerd) - Number(order.bean_generated);
          _context19.next = 22;
          return regeneratorRuntime.awrap(UserModel.update({
            beansEarnerd: beansEarnerd <= 0 ? 0 : beansEarnerd
          }, {
            where: {
              _id: req.body.user_id
            }
          }));

        case 22:
          _context19.next = 24;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id || "",
              is_deleted: false
            }
          }));

        case 24:
          _cart_count = _context19.sent;
          _context19.next = 27;
          return regeneratorRuntime.awrap(UserOrdersModel.count({
            where: {
              user_id: req.body.user_id || "",
              order_status: "pending",
              checkout_method: "collect"
            }
          }));

        case 27:
          _collect_count = _context19.sent;
          return _context19.abrupt("return", res.api(200, 'Order cancelled successfully', {
            cart_count: _cart_count,
            collect_count: _collect_count
          }, true));

        case 29:
        case "end":
          return _context19.stop();
      }
    }
  });
};

module.exports.placeOrder = function _callee19(req, res, _) {
  var user, cart_info, orderCount, reqObject, order, _loop, index, item_index, bean_spent, amount_user_paid, beans_earned, _beans_earned, orderInfo;

  return regeneratorRuntime.async(function _callee19$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _context21.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id,
              is_deleted: false
            }
          }));

        case 2:
          user = _context21.sent;

          if (!user) {
            _context21.next = 49;
            break;
          }

          _context21.next = 6;
          return regeneratorRuntime.awrap(MyCartModel.findAll({
            where: {
              user_id: req.body.user_id,
              is_deleted: false
            },
            include: [{
              model: UserModel,
              as: "user_info"
            }, {
              model: UserProducts,
              as: "product_info",
              include: [{
                model: IVAModel,
                as: "iva_info"
              }, {
                model: ModifiersModel,
                as: "required_modifier_list"
              }, {
                model: ModifiersModel,
                as: "optional_modifier_list"
              }]
            }, {
              model: ModifiersModel,
              as: "required_modifier_detail"
            }, {
              model: ModifiersModel,
              as: "optional_modifier_detail"
            }, {
              model: SyraEvents,
              as: "event_info"
            }]
          }));

        case 6:
          cart_info = _context21.sent;
          _context21.next = 9;
          return regeneratorRuntime.awrap(UserOrdersModel.count({
            where: {
              user_id: req.body.user_id || "",
              order_status: "pending",
              checkout_method: "collect"
            }
          }));

        case 9:
          orderCount = _context21.sent;

          if (!(cart_info.length > 0)) {
            _context21.next = 46;
            break;
          }

          // replace the condition with "cart_info.length > 0 && orderCount == 0" once fixed
          reqObject = generateRequest(req.body, JSON.parse(JSON.stringify(cart_info)), user.beansEarnerd);
          _context21.next = 14;
          return regeneratorRuntime.awrap(UserOrdersModel.create(reqObject));

        case 14:
          order = _context21.sent;

          if (!order) {
            _context21.next = 43;
            break;
          }

          _loop = function _loop(index) {
            var element, order_data;
            return regeneratorRuntime.async(function _loop$(_context20) {
              while (1) {
                switch (_context20.prev = _context20.next) {
                  case 0:
                    element = cart_info[index];

                    if (!(element.wallet_id != null && element.wallet_id != "" && element.wallet_id != undefined)) {
                      _context20.next = 9;
                      break;
                    }

                    _context20.next = 4;
                    return regeneratorRuntime.awrap(UserorderedProducts.destroy({
                      where: {
                        UserProductId: element.product_id,
                        order_id: element.wallet_id
                      }
                    }));

                  case 4:
                    _context20.next = 6;
                    return regeneratorRuntime.awrap(UserOrdersModel.findOne({
                      where: {
                        _id: element.wallet_id
                      }
                    }));

                  case 6:
                    order_data = _context20.sent.order_data;
                    item_index = order_data.findIndex(function (i) {
                      return i.product_id == element.product_id && i.required_modifiers == element.required_modifiers && i.optional_modifiers == element.optional_modifiers && i.grains == element.grains;
                    });
                    order_data.splice(item_index, 1);

                  case 9:
                    _context20.next = 11;
                    return regeneratorRuntime.awrap(UserorderedProducts.create({
                      date_of_order: order.date_of_order,
                      order_id: order._id,
                      UserProductId: element.product_id,
                      category_id: element.product_info.category,
                      required_modifier_id: element.required_modifiers,
                      required_modifier_iva: element.required_modifier_detail ? element.required_modifier_detail.iva : null,
                      optional_modifier_id: element.optional_modifiers,
                      optional_modifier_iva: element.optional_modifiers ? element.optional_modifier_detail.iva : null,
                      grind_id: element.grains,
                      user_id: element.user_id,
                      store_id: order.store_id,
                      quantity: element.quantity,
                      product_iva: element.product_info.iva,
                      total_price: order.total_price,
                      Payment_method: order.Payment_method,
                      total_price_with_out_tax: order.total_price_with_out_tax
                    }));

                  case 11:
                  case "end":
                    return _context20.stop();
                }
              }
            });
          };

          index = 0;

        case 18:
          if (!(index < cart_info.length)) {
            _context21.next = 24;
            break;
          }

          _context21.next = 21;
          return regeneratorRuntime.awrap(_loop(index));

        case 21:
          index++;
          _context21.next = 18;
          break;

        case 24:
          if (!(reqObject.is_beans_applied == true)) {
            _context21.next = 33;
            break;
          }

          bean_spent = Number(user.beansSpent) + Number(order.bean_applied);
          amount_user_paid = Number(order.total_price_to_pay);
          beans_earned = Number(user.beansEarnerd) - Number(order.bean_applied) <= 0 ? amount_user_paid > 0 ? Number(order.bean_generated) : 0 : amount_user_paid > 0 ? Number(user.beansEarnerd) - Number(order.bean_applied) + Number(order.bean_generated) : Number(user.beansEarnerd) - Number(order.bean_applied);
          _context21.next = 30;
          return regeneratorRuntime.awrap(UserModel.update({
            beansSpent: bean_spent,
            beansEarnerd: beans_earned <= 0 ? 0 : beans_earned.toFixed(0)
          }, {
            where: {
              _id: user._id
            }
          }));

        case 30:
          AppliedBeans.create({
            order_id: order._id,
            beans_used: order.bean_applied,
            beans_genrated: order.bean_generated.toFixed(0)
          });
          _context21.next = 36;
          break;

        case 33:
          _beans_earned = (Number(user.beansEarnerd) <= 0 ? 0 : Number(user.beansEarnerd)) + Number(order.bean_generated);
          _context21.next = 36;
          return regeneratorRuntime.awrap(UserModel.update({
            beansEarnerd: _beans_earned.toFixed(0)
          }, {
            where: {
              _id: user._id
            }
          }));

        case 36:
          MyCartModel.destroy({
            where: {
              user_id: user._id
            }
          });
          _context21.next = 39;
          return regeneratorRuntime.awrap(UserOrdersModel.findOne({
            where: {
              _id: order._id
            },
            include: [{
              model: BrancheModel,
              as: "branch_info"
            }]
          }));

        case 39:
          orderInfo = _context21.sent;
          return _context21.abrupt("return", res.api(200, 'order placed successfully', {
            orderInfo: orderInfo
          }, true));

        case 43:
          return _context21.abrupt("return", res.api(200, 'Could not place order', null, false));

        case 44:
          _context21.next = 47;
          break;

        case 46:
          return _context21.abrupt("return", res.api(200, orderCount > 0 ? 'Please Collect your order before placing new order!' : 'No products in cart', null, false));

        case 47:
          _context21.next = 50;
          break;

        case 49:
          return _context21.abrupt("return", res.api(200, 'No user Found, Could not add to cart!', null, false));

        case 50:
        case "end":
          return _context21.stop();
      }
    }
  });
};

module.exports.getOrder = function _callee20(req, res, _) {
  var user, orderInfo;
  return regeneratorRuntime.async(function _callee20$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id,
              is_deleted: false
            }
          }));

        case 2:
          user = _context22.sent;

          if (!user) {
            _context22.next = 10;
            break;
          }

          _context22.next = 6;
          return regeneratorRuntime.awrap(UserOrdersModel.findOne({
            where: {
              user_id: req.body.user_id || "",
              order_status: "pending",
              checkout_method: "collect"
            },
            include: [{
              model: BrancheModel,
              as: "branch_info"
            }]
          }));

        case 6:
          orderInfo = _context22.sent;
          return _context22.abrupt("return", res.api(200, 'order details', {
            orderInfo: orderInfo
          }, true));

        case 10:
          return _context22.abrupt("return", res.api(200, 'No user Found, Could not get orders!', null, false));

        case 11:
        case "end":
          return _context22.stop();
      }
    }
  });
};

module.exports.getWallet = function _callee21(req, res, _) {
  var user, _ref, orderInfo, wallet, orderArraySorted, _cart_info, index, ordered_products, required_modifier_info, optional_modifier_info, grind_info, index_cart, cart_count;

  return regeneratorRuntime.async(function _callee21$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.next = 2;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id,
              is_deleted: false
            }
          }));

        case 2:
          user = _context23.sent;

          if (!user) {
            _context23.next = 18;
            break;
          }

          _context23.next = 6;
          return regeneratorRuntime.awrap(UserorderedProducts.findAll({
            where: {
              user_id: req.body.user_id
            },
            include: [{
              model: UserOrdersModel,
              as: "order_info",
              where: {
                checkout_method: "wallet"
              }
            }, {
              model: UserProducts,
              as: "product_info",
              include: [{
                model: ModifiersModel,
                as: "required_modifier_list",
                through: {
                  attributes: []
                }
              }, {
                model: ModifiersModel,
                as: "optional_modifier_list",
                through: {
                  attributes: []
                }
              }, {
                model: MyCartModel,
                as: "cart_info",
                where: {
                  "user_id": req.body.user_id,
                  "is_claim_wallet": true
                },
                required: false,
                include: [{
                  model: ModifiersModel,
                  as: "required_modifier_detail"
                }, {
                  model: ModifiersModel,
                  as: "optional_modifier_detail"
                }]
              }]
            }]
          }));

        case 6:
          orderInfo = _context23.sent;
          wallet = JSON.parse(JSON.stringify(orderInfo.map(function (data) {
            return data.product_info;
          }).sort(function (a, b) {
            var keyA = a.product_name,
                keyB = b.product_name;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          })));
          orderArraySorted = orderInfo.sort(function (a, b) {
            var keyA = a.product_info.product_name,
                keyB = b.product_info.product_name;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          }); //get product_wise cart_info without replication

          _cart_info = orderArraySorted.map(function (data, index) {
            var inde_pdt = data.order_info.order_data.findIndex(function (i) {
              return i.product_id == wallet[index]._id && i.required_modifiers == orderArraySorted[index].required_modifier_id && i.optional_modifiers == orderArraySorted[index].optional_modifier_id && i.grains == orderArraySorted[index].grind_id;
            });
            return data.order_info.order_data[inde_pdt];
          }); //filterout all null values 

          _cart_info = (_ref = []).concat.apply(_ref, _toConsumableArray(_cart_info.filter(function (data) {
            return data != null;
          })));

          for (index = 0; index < _cart_info.length; index++) {
            element = _cart_info[index];
            ordered_products = [];
            required_modifier_info = null;
            optional_modifier_info = null;
            grind_info = null;
            ordered_products.push(element.quantity + "X " + element.product_info.product_name);

            if (element.product_info.setup_selected == "modifiers") {
              if (element.required_modifier_detail) {
                ordered_products.push(1 + "X " + element.required_modifier_detail.modifier_name);
                required_modifier_info = {
                  _id: element.required_modifier_detail._id,
                  price: element.required_modifier_detail.price,
                  beans_value: element.required_modifier_detail.beans_value
                };
              }

              if (element.optional_modifier_detail != null) {
                optional_modifier_info = {
                  _id: element.optional_modifier_detail._id,
                  price: element.optional_modifier_detail.price,
                  beans_value: element.optional_modifier_detail.beans_value
                };
                ordered_products.push(1 + "X " + element.optional_modifier_detail.modifier_name);
              }
            } else {
              if (orderInfo[index].grind_id) {
                grind_info = {
                  _id: orderInfo[index].grind_id,
                  price: "0.0",
                  beans_value: "0.0"
                };
                ordered_products.push(element.quantity + "X" + element.grinds_name);
              }
            }

            wallet[index].wallet_id = orderInfo[index].order_info._id;
            wallet[index].required_modifier_detail = required_modifier_info;
            wallet[index].optional_modifier_detail = optional_modifier_info;
            wallet[index].grind_detail = grind_info;
            wallet[index].is_gift = false;
            wallet[index].order_list = ordered_products;
            wallet[index].price = "0.00";
            wallet[index].total_price = "0.00";
            wallet[index].product_total = "€0.00";
            wallet[index].quantity = Number(element.quantity);

            if (wallet[index].cart_info.length > 0) {
              console.log(wallet[index], "test");

              for (index_cart = 0; index_cart < wallet[index].cart_info.length; index_cart++) {
                if (!(wallet[index].cart_info[index_cart].grains == (wallet[index].grind_detail ? wallet[index].grind_detail._id : "") && wallet[index].cart_info[0].optional_modifiers == (wallet[index].optional_modifier_detail ? wallet[index].optional_modifier_detail._id : "") && wallet[index].cart_info[0].required_modifiers == (wallet[index].required_modifier_detail ? wallet[index].required_modifier_detail._id : "") && wallet[index].cart_info[index_cart].wallet_id == wallet[index].wallet_id)) {
                  wallet[index].cart_info.splice(index_cart, 1);
                }
              }
            }
          }

          _context23.next = 14;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id || "",
              is_deleted: false
            }
          }));

        case 14:
          cart_count = _context23.sent;
          return _context23.abrupt("return", res.api(200, 'products', {
            wallet: wallet,
            cart_count: cart_count,
            cart_info: _cart_info
          }, true));

        case 18:
          return _context23.abrupt("return", res.api(200, 'No user Found, Could not get orders!', null, false));

        case 19:
        case "end":
          return _context23.stop();
      }
    }
  });
};

function generateRequest(data, cart_data, user_beans) {
  var reqObject = {};
  reqObject.date_of_order = moment().toDate();
  reqObject.user_id = data.user_id;
  reqObject.store_id = data.store_id;
  reqObject.checkout_method = data.checkout_method;
  reqObject.barista_delivers_order = null;
  var priceInfo = calculatePrice(cart_data);
  reqObject.order_data = JSON.stringify(priceInfo.cartList);
  reqObject.total_price = priceInfo.total_price;
  reqObject.Payment_method = data.use_beans ? "beans" : "card";
  reqObject.products = cart_data.map(function (data) {
    return data.product_id;
  }).join(',');
  reqObject.card_id = data.card_id;
  reqObject.txn_id = data.txn_id;
  reqObject.total_price_with_out_tax = priceInfo.total_price_with_out_tax;
  reqObject.total_price_to_pay = priceInfo.total_price_to_pay;
  reqObject.proceedToPayOnline = priceInfo.total_price_to_pay > 0;
  reqObject.price_data = JSON.stringify(priceInfo.price_details);
  reqObject.is_claiming_gift = data.is_claiming_gift || false;
  reqObject.bean_applied = priceInfo.total_bean;
  reqObject.bean_generated = priceInfo.bean_to_earn;
  reqObject.remaining_to_pay = Number(user_beans) >= priceInfo.total_bean ? 0 : priceInfo.total_bean - Number(user_beans);
  reqObject.order_status = "pending";
  reqObject.is_beans_applied = data.use_beans;
  reqObject.tax_amount = priceInfo.total_price - reqObject.total_price_with_out_tax;
  return reqObject;
}

module.exports.getGifts = function _callee22(req, res, _) {
  var user_id, user, gifts, available_gifts, upcoming_gifts, cart_count;
  return regeneratorRuntime.async(function _callee22$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          user_id = req.body.user_id;
          _context24.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: user_id
            }
          }));

        case 3:
          user = _context24.sent;
          _context24.t0 = JSON;
          _context24.t1 = JSON;
          _context24.next = 8;
          return regeneratorRuntime.awrap(UserProducts.findAll({
            where: {
              is_deleted: false
            },
            include: [{
              model: IVAModel,
              as: "iva_info"
            }, {
              model: UserCategories,
              as: "category_details"
            }, {
              model: ModifiersModel,
              as: "required_modifier_list",
              through: {
                attributes: []
              }
            }, {
              model: ModifiersModel,
              as: "optional_modifier_list",
              through: {
                attributes: []
              }
            }, {
              model: MyCartModel,
              as: "cart_info",
              where: {
                "user_id": req.body.user_id,
                "is_claiming_gift": true
              },
              required: false,
              include: [{
                model: ModifiersModel,
                as: "required_modifier_detail"
              }, {
                model: ModifiersModel,
                as: "optional_modifier_detail"
              }]
            }]
          }));

        case 8:
          _context24.t2 = _context24.sent;
          _context24.t3 = _context24.t1.stringify.call(_context24.t1, _context24.t2);
          gifts = _context24.t0.parse.call(_context24.t0, _context24.t3);
          // gifts = gifts.map(v => ({...v, is_locked: Number(v.beans_value) > Number(user.beansEarnerd), beans_to_unlock :  Number(v.beans_value) > Number(user.beansEarnerd) ? (Number(v.beans_value) - Number(user.beansEarnerd)).toFixed() : 0 }))
          available_gifts = gifts.filter(function (data) {
            return Number(data.beans_value) <= Number(user.beansEarnerd);
          }).sort(function (a, b) {
            var keyA = Number(a.beans_value),
                keyB = Number(b.beans_value);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          upcoming_gifts = gifts.filter(function (data) {
            return Number(data.beans_value) > Number(user.beansEarnerd);
          }).sort(function (a, b) {
            var keyA = Number(a.beans_value),
                keyB = Number(b.beans_value);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          _context24.next = 15;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id || "",
              is_deleted: false
            }
          }));

        case 15:
          cart_count = _context24.sent;
          return _context24.abrupt("return", res.api(200, "Gifts retrived Successfully", {
            available_gifts: available_gifts,
            upcoming_gifts: upcoming_gifts,
            cart_count: cart_count
          }, true));

        case 17:
        case "end":
          return _context24.stop();
      }
    }
  });
}; ////////For Check 123 of GetWallet CartManagement