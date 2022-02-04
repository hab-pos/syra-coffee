"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('./products-repository'),
    ProductRepository = _require.ProductRepository;

var _require2 = require('./products-model'),
    UserProducts = _require2.UserProducts,
    RequiredModifierProducts = _require2.RequiredModifierProducts,
    optionalModifierProducts = _require2.optionalModifierProducts;

var commonHelper = require('../../helpers/commonHelper');

var _require3 = require('googleapis'),
    google = _require3.google;

var moment = require('moment');

var fs = require('fs');

var os = require('os');

var _ = require('lodash');

var _require4 = require('../ModifiersApp/modifier-model'),
    ModifiersModel = _require4.ModifiersModel;

var _require5 = require('../../User_App/User-model'),
    UserModel = _require5.UserModel,
    MyCartModel = _require5.MyCartModel,
    UserOrdersModel = _require5.UserOrdersModel,
    UserorderedProducts = _require5.UserorderedProducts;

var _require6 = require('../eventsApp/events-model'),
    SyraEvents = _require6.SyraEvents;

var Sequelize = require('sequelize');

var _require7 = require('../storyApp/story-model'),
    StoryModel = _require7.StoryModel;

var _require8 = require('../../SetupApp/setup-model'),
    IVAModel = _require8.IVAModel;

var _require9 = require('../Category_app/category-model'),
    UserCategories = _require9.UserCategories;

var _require10 = require('../../../Utils/constants'),
    constants = _require10.constants;

var Op = Sequelize.Op;

module.exports.addProduct = function _callee(req, res, _) {
  var request, result, index, _element, product, _index, _element2, _product;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          request = req.body;
          request.order = 0;
          request.is_Active = true;
          request.is_deleted = false;
          console.log(request);
          _context.next = 7;
          return regeneratorRuntime.awrap(ProductRepository.addProduct(request));

        case 7:
          result = _context.sent;
          index = 0;

        case 9:
          if (!(index < req.body.required_modifier.split(',').length)) {
            _context.next = 20;
            break;
          }

          _element = req.body.required_modifier != "" ? req.body.required_modifier.split(',')[index] : null;
          _context.next = 13;
          return regeneratorRuntime.awrap(RequiredModifierProducts.findAll({
            where: {
              product_id: result._id,
              ModifierId: _element
            }
          }));

        case 13:
          product = _context.sent;

          if (!(product.length == 0 && _element != null)) {
            _context.next = 17;
            break;
          }

          _context.next = 17;
          return regeneratorRuntime.awrap(RequiredModifierProducts.create({
            product_id: result._id,
            ModifierId: _element
          }));

        case 17:
          index++;
          _context.next = 9;
          break;

        case 20:
          _index = 0;

        case 21:
          if (!(_index < req.body.optional_modifier.split(',').length)) {
            _context.next = 32;
            break;
          }

          _element2 = req.body.optional_modifier != "" ? req.body.optional_modifier.split(',')[_index] : null;
          _context.next = 25;
          return regeneratorRuntime.awrap(optionalModifierProducts.findAll({
            where: {
              product_id: result._id,
              ModifierId: _element2
            }
          }));

        case 25:
          _product = _context.sent;

          if (!(_product.length == 0 && _element2 != null)) {
            _context.next = 29;
            break;
          }

          _context.next = 29;
          return regeneratorRuntime.awrap(optionalModifierProducts.create({
            product_id: result._id,
            ModifierId: _element2
          }));

        case 29:
          _index++;
          _context.next = 21;
          break;

        case 32:
          return _context.abrupt("return", res.api(200, "product Added Successfully", result, true));

        case 33:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.getProducts = function _callee2(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.body.id;
          ProductRepository.getProducts(id).then(function (modifiers) {
            res.api(200, "products retrived successfully", modifiers, true);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.updateProduct = function _callee3(req, res, _) {
  var category, Modifier_list, unLinkedList_req, unLinkedList_opt, index, _element3, product, _index2, _element4, _index3, _element5, _product2, _index4, _element6;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(ProductRepository.getProducts(req.body._id));

        case 2:
          category = _context3.sent;

          if (!category) {
            _context3.next = 67;
            break;
          }

          _context3.next = 6;
          return regeneratorRuntime.awrap(ProductRepository.updateProduct(req.body));

        case 6:
          if (!(req.body.required_modifier == "")) {
            _context3.next = 9;
            break;
          }

          _context3.next = 9;
          return regeneratorRuntime.awrap(RequiredModifierProducts.destroy({
            where: {
              product_id: req.body._id
            }
          }));

        case 9:
          if (!(req.body.optional_modifier == "")) {
            _context3.next = 12;
            break;
          }

          _context3.next = 12;
          return regeneratorRuntime.awrap(optionalModifierProducts.destroy({
            where: {
              product_id: req.body._id
            }
          }));

        case 12:
          if (!(req.body.required_modifier != null || req.body.required_modifier != null)) {
            _context3.next = 64;
            break;
          }

          _context3.next = 15;
          return regeneratorRuntime.awrap(ModifiersModel.findAll({
            where: {
              is_deleted: false
            }
          }));

        case 15:
          _context3.t0 = function (item) {
            return item._id;
          };

          Modifier_list = _context3.sent.map(_context3.t0);
          unLinkedList_req = commonHelper.diffArray(Modifier_list, req.body.required_modifier.split(','));
          unLinkedList_opt = commonHelper.diffArray(Modifier_list, req.body.optional_modifier.split(','));
          console.log(unLinkedList_req, "req");
          console.log(unLinkedList_opt, "opt");
          index = 0;

        case 22:
          if (!(req.body.required_modifier != "" && index < req.body.required_modifier.split(',').length)) {
            _context3.next = 33;
            break;
          }

          _element3 = req.body.required_modifier.split(',')[index];
          _context3.next = 26;
          return regeneratorRuntime.awrap(RequiredModifierProducts.findAll({
            where: {
              product_id: req.body._id,
              ModifierId: _element3
            }
          }));

        case 26:
          product = _context3.sent;

          if (!(product.length == 0)) {
            _context3.next = 30;
            break;
          }

          _context3.next = 30;
          return regeneratorRuntime.awrap(RequiredModifierProducts.create({
            product_id: req.body._id,
            ModifierId: _element3
          }));

        case 30:
          index++;
          _context3.next = 22;
          break;

        case 33:
          _index2 = 0;

        case 34:
          if (!(_index2 < unLinkedList_req.length)) {
            _context3.next = 41;
            break;
          }

          _element4 = unLinkedList_req[_index2];
          _context3.next = 38;
          return regeneratorRuntime.awrap(RequiredModifierProducts.destroy({
            where: {
              product_id: req.body._id,
              ModifierId: _element4
            }
          }));

        case 38:
          _index2++;
          _context3.next = 34;
          break;

        case 41:
          _index3 = 0;

        case 42:
          if (!(req.body.optional_modifier != "" && _index3 < req.body.optional_modifier.split(',').length)) {
            _context3.next = 53;
            break;
          }

          _element5 = req.body.optional_modifier.split(',')[_index3];
          _context3.next = 46;
          return regeneratorRuntime.awrap(optionalModifierProducts.findAll({
            where: {
              product_id: req.body._id,
              ModifierId: _element5
            }
          }));

        case 46:
          _product2 = _context3.sent;

          if (!(_product2.length == 0)) {
            _context3.next = 50;
            break;
          }

          _context3.next = 50;
          return regeneratorRuntime.awrap(optionalModifierProducts.create({
            product_id: req.body._id,
            ModifierId: _element5
          }));

        case 50:
          _index3++;
          _context3.next = 42;
          break;

        case 53:
          _index4 = 0;

        case 54:
          if (!(_index4 < unLinkedList_opt.length)) {
            _context3.next = 61;
            break;
          }

          _element6 = unLinkedList_opt[_index4];
          _context3.next = 58;
          return regeneratorRuntime.awrap(optionalModifierProducts.destroy({
            where: {
              product_id: req.body._id,
              ModifierId: _element6
            }
          }));

        case 58:
          _index4++;
          _context3.next = 54;
          break;

        case 61:
          return _context3.abrupt("return", res.api(200, "product Updated", category, true));

        case 64:
          return _context3.abrupt("return", res.api(200, "product Updated", category, true));

        case 65:
          _context3.next = 68;
          break;

        case 67:
          return _context3.abrupt("return", res.api(200, "product Not available", null, false));

        case 68:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.getHomePage = function _callee4(req, res, _) {
  var user_id, user, response, _where, _where2, gifts, events, stories, index, orderedPdts, reorder_list, CartCount, collectCount, featured;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          user_id = req.body.user_id;
          _context4.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id
            }
          }));

        case 3:
          user = _context4.sent;
          response = {};

          if (!user) {
            _context4.next = 51;
            break;
          }

          _context4.t0 = JSON;
          _context4.t1 = JSON;
          _context4.next = 10;
          return regeneratorRuntime.awrap(UserProducts.findAll({
            where: {
              is_deleted: false
            },
            order: [["beans_value", "ASC"]],
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

        case 10:
          _context4.t2 = _context4.sent;
          _context4.t3 = _context4.t1.stringify.call(_context4.t1, _context4.t2);
          gifts = _context4.t0.parse.call(_context4.t0, _context4.t3);
          gifts = gifts.map(function (v) {
            return _objectSpread({}, v, {
              is_locked: Number(v.beans_value) > Number(user.beansEarnerd),
              beans_to_unlock: Number(v.beans_value) > Number(user.beansEarnerd) ? (Number(v.beans_value) - Number(user.beansEarnerd)).toFixed() : 0
            });
          });
          gifts = gifts.sort(function (a, b) {
            return Number(a.beans_value) > Number(b.beans_value) ? 1 : -1;
          });
          _context4.next = 17;
          return regeneratorRuntime.awrap(SyraEvents.findAll({
            where: {
              is_deleted: false,
              end_date: _defineProperty({}, Op.gte, moment().toDate())
            },
            include: [{
              model: UserProducts,
              as: "product_info",
              through: {
                attributes: []
              },
              include: [{
                model: ModifiersModel,
                as: "required_modifier_list"
              }, {
                model: ModifiersModel,
                as: "optional_modifier_list"
              }, {
                model: MyCartModel,
                as: "cart_info",
                where: {
                  "user_id": req.body.user_id
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

        case 17:
          events = _context4.sent;
          _context4.t4 = JSON;
          _context4.t5 = JSON;
          _context4.next = 22;
          return regeneratorRuntime.awrap(StoryModel.findAll({
            where: {
              is_deleted: false
            },
            include: [{
              model: UserProducts,
              as: "product_info",
              include: [{
                model: ModifiersModel,
                as: "required_modifier_list"
              }, {
                model: ModifiersModel,
                as: "optional_modifier_list"
              }, {
                model: MyCartModel,
                as: "cart_info",
                where: (_where = {
                  "user_id": user_id,
                  "is_claiming_gift": false,
                  "is_claim_wallet": false
                }, _defineProperty(_where, Op.or, [{
                  is_reorder: false
                }, {
                  is_reorder: null
                }]), _defineProperty(_where, "event_id", null), _where),
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

        case 22:
          _context4.t6 = _context4.sent;
          _context4.t7 = _context4.t5.stringify.call(_context4.t5, _context4.t6);
          stories = _context4.t4.parse.call(_context4.t4, _context4.t7);

          // to get hidden
          for (index = 0; index < stories.length; index++) {
            stories[index].product_info = [stories[index].product_info];
          }

          _context4.next = 28;
          return regeneratorRuntime.awrap(UserorderedProducts.findAll({
            where: {
              user_id: req.body.user_id ? req.body.user_id : ""
            },
            include: [{
              model: UserOrdersModel,
              as: "order_info",
              where: {
                checkout_method: "collect"
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
                  "user_id": req.body.user_id ? req.body.user_id : "",
                  "is_claim_wallet": false,
                  is_reorder: true
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
            }],
            order: [["createdAt", "DESC"]],
            group: [["UserProductId"]],
            limit: 2
          }));

        case 28:
          orderedPdts = _context4.sent;
          orderedPdts = JSON.parse(JSON.stringify(orderedPdts.map(function (data) {
            return data.product_info;
          }).sort(function (a, b) {
            var keyA = a.product_name,
                keyB = b.product_name;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          })));
          reorder_list = {
            category_id: "Reorder",
            category_details: {
              category_name: "reorder",
              image_url: constants.HOST + "assets/icons/reorder.png"
            },
            products: orderedPdts,
            type: "reorder",
            count: orderedPdts.length
          }; // to get hidden

          _context4.next = 33;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id || "",
              is_deleted: false
            }
          }));

        case 33:
          CartCount = _context4.sent;
          _context4.next = 36;
          return regeneratorRuntime.awrap(UserOrdersModel.count({
            where: {
              user_id: req.body.user_id || "",
              order_status: "pending",
              checkout_method: "collect"
            }
          }));

        case 36:
          collectCount = _context4.sent;
          response.cart_count = CartCount;
          response.collect_count = collectCount;
          response.beans_earned = Number(user.beansEarnerd).toFixed(0);
          response.gifts = gifts;
          response.events = events;
          response.stories = stories;

          if (reorder_list.products.length > 0) {
            response.reorder = reorder_list;
          }

          _context4.next = 46;
          return regeneratorRuntime.awrap(UserProducts.findAll({
            where: {
              is_deleted: false,
              is_featured: true
            },
            include: [{
              model: IVAModel,
              as: "iva_info"
            }, {
              model: UserCategories,
              as: "category_details"
            }, {
              model: ModifiersModel,
              as: "required_modifier_list"
            }, {
              model: ModifiersModel,
              as: "optional_modifier_list"
            }, {
              model: MyCartModel,
              as: "cart_info",
              where: (_where2 = {
                "user_id": user_id,
                "is_claiming_gift": false,
                "is_claim_wallet": false
              }, _defineProperty(_where2, Op.or, [{
                is_reorder: false
              }, {
                is_reorder: null
              }]), _defineProperty(_where2, "event_id", null), _where2),
              required: false,
              include: [{
                model: ModifiersModel,
                as: "required_modifier_detail"
              }, {
                model: ModifiersModel,
                as: "optional_modifier_detail"
              }]
            }],
            order: [["order", "ASC"]]
          }));

        case 46:
          featured = _context4.sent;
          response.featuredProducts = featured;
          return _context4.abrupt("return", res.api(200, "Home called Successfully", response, true));

        case 51:
          return _context4.abrupt("return", res.api(200, "No user Found", null, false));

        case 52:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.reorderCategory = function _callee5(req, res, _) {
  var index;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          index = 0;

        case 1:
          if (!(index < req.body.list.length)) {
            _context5.next = 8;
            break;
          }

          req.body.list[index].grinds = JSON.stringify(req.body.list[index].grinds);
          _context5.next = 5;
          return regeneratorRuntime.awrap(ProductRepository.updateProduct(req.body.list[index]));

        case 5:
          index++;
          _context5.next = 1;
          break;

        case 8:
          return _context5.abrupt("return", res.api(200, "Reordered Successfully", null, false));

        case 9:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.updateOnlineStatus = function _callee6(req, res, _) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(UserProducts.update({
            is_Active: req.body.is_Active
          }, {
            where: {
              _id: req.body._id
            }
          }));

        case 2:
          return _context6.abrupt("return", res.api(200, "Status updated Successfully", null, false));

        case 3:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.deleteProduct = function _callee7(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          id = req.body.id;
          ProductRepository.deleteProduct(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "product deleted successfully", null, true) : res.api(404, "No product found", null, false);
          });

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
};

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

module.exports.get_all_products = function _callee8(req, res, next) {
  var _where3, _ref;

  var user_id, products, CartCount, grouped, orderInfo, wallet, orderArraySorted, cart_info, index, ordered_products, required_modifier_info, optional_modifier_info, grind_info, index_cart, orderedPdts;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          user_id = req.body.user_id;
          _context8.next = 3;
          return regeneratorRuntime.awrap(UserProducts.findAll({
            where: {
              is_deleted: false,
              is_Active: true
            },
            include: [{
              model: IVAModel,
              as: "iva_info"
            }, {
              model: UserCategories,
              as: "category_details",
              where: {
                is_deleted: false,
                is_Active: true
              }
            }, {
              model: ModifiersModel,
              as: "required_modifier_list",
              where: {
                is_deleted: false,
                is_Active: true
              },
              required: false
            }, {
              model: ModifiersModel,
              as: "optional_modifier_list",
              where: {
                is_deleted: false,
                is_Active: true
              },
              required: false
            }, {
              model: MyCartModel,
              as: "cart_info",
              where: (_where3 = {
                "user_id": user_id,
                "is_claiming_gift": false,
                "is_claim_wallet": false
              }, _defineProperty(_where3, Op.or, [{
                is_reorder: false
              }, {
                is_reorder: null
              }]), _defineProperty(_where3, "event_id", null), _where3),
              required: false,
              include: [{
                model: ModifiersModel,
                as: "required_modifier_detail"
              }, {
                model: ModifiersModel,
                as: "optional_modifier_detail"
              }]
            }],
            order: [["order", "ASC"]]
          }));

        case 3:
          products = _context8.sent;
          _context8.next = 6;
          return regeneratorRuntime.awrap(MyCartModel.count({
            where: {
              user_id: req.body.user_id ? req.body.user_id : "",
              is_deleted: false
            }
          }));

        case 6:
          CartCount = _context8.sent;
          grouped = _(products).groupBy("category").map(function (data, key) {
            return {
              category_id: key,
              category_details: data[0].category_details,
              products: data.sort(function (a, b) {
                var keyA = Number(a.order),
                    keyB = Number(b.order);
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
              }),
              type: "product"
            };
          }).sort(function (a, b) {
            var keyA = Number(a.category_details.order),
                keyB = Number(b.category_details.order);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          grouped = JSON.parse(JSON.stringify(grouped)); //to get Wallets

          _context8.next = 11;
          return regeneratorRuntime.awrap(UserorderedProducts.findAll({
            where: {
              user_id: req.body.user_id ? req.body.user_id : ""
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
                where: _defineProperty({
                  "user_id": req.body.user_id ? req.body.user_id : "",
                  "is_claim_wallet": true
                }, Op.or, [{
                  is_reorder: false
                }, {
                  is_reorder: null
                }]),
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

        case 11:
          orderInfo = _context8.sent;
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
          }); // return res.api(200, "Products retrived successfully", { products_list: wallet, cart_count: orderArraySorted }, true)
          //get product_wise cart_info without replication

          cart_info = orderArraySorted.map(function (data, index) {
            var inde_pdt = data.order_info.order_data.findIndex(function (i) {
              return i.product_id == wallet[index]._id && i.required_modifiers == orderArraySorted[index].required_modifier_id && i.optional_modifiers == orderArraySorted[index].optional_modifier_id && i.grains == orderArraySorted[index].grind_id;
            });
            return data.order_info.order_data[inde_pdt];
          }); //filterout all null values 

          cart_info = (_ref = []).concat.apply(_ref, _toConsumableArray(cart_info.filter(function (data) {
            return data != null;
          })));

          for (index = 0; index < cart_info.length; index++) {
            element = cart_info[index];
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
              for (index_cart = 0; index_cart < wallet[index].cart_info.length; index_cart++) {
                if (!(wallet[index].cart_info[index_cart].grains == (wallet[index].grind_detail ? wallet[index].grind_detail._id : "") && wallet[index].cart_info[0].optional_modifiers == (wallet[index].optional_modifier_detail ? wallet[index].optional_modifier_detail._id : "") && wallet[index].cart_info[0].required_modifiers == (wallet[index].required_modifier_detail ? wallet[index].required_modifier_detail._id : "") && wallet[index].cart_info[index_cart].wallet_id == wallet[index].wallet_id)) {
                  wallet[index].cart_info.splice(index_cart, 1);
                }
              }
            }
          }

          if (wallet.length > 0) {
            grouped.insert(0, {
              category_id: "wallet",
              category_details: {
                category_name: "Wallet",
                image_url: constants.HOST + "assets/icons/wallet.png"
              },
              products: wallet,
              type: "wallet",
              count: wallet.length
            });
          }

          _context8.next = 20;
          return regeneratorRuntime.awrap(UserorderedProducts.findAll({
            where: {
              user_id: req.body.user_id ? req.body.user_id : ""
            },
            include: [{
              model: UserOrdersModel,
              as: "order_info",
              where: {
                checkout_method: "collect"
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
                  "user_id": req.body.user_id ? req.body.user_id : "",
                  "is_claim_wallet": false,
                  is_reorder: true
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
            }],
            order: [["createdAt", "DESC"]],
            group: [["UserProductId"]],
            limit: 2
          }));

        case 20:
          orderedPdts = _context8.sent;
          orderedPdts = JSON.parse(JSON.stringify(orderedPdts.map(function (data) {
            return data.product_info;
          }).sort(function (a, b) {
            var keyA = a.product_name,
                keyB = b.product_name;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          })));

          if (orderedPdts.length > 0) {
            grouped.insert(0, {
              category_id: "reorder",
              category_details: {
                category_name: "Reorder",
                image_url: constants.HOST + "assets/icons/reorder.png"
              },
              products: orderedPdts,
              type: "reorder",
              count: orderedPdts.length
            });
          } // grouped.insert(0, {
          //     category_id: "",
          //     category_details: {},
          //     products: [],
          //     type: "reorder",
          //     count: 0
          // })


          res.api(200, "Products retrived successfully", {
            products_list: grouped,
            cart_count: CartCount
          }, true);

        case 24:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports.getFeaturedProducts = function _callee9(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          id = req.body.id;
          ProductRepository.getFeaturedProducts().then(function (response) {
            return res.api(200, "Featured products retrived successfully", response, false);
          });

        case 2:
        case "end":
          return _context9.stop();
      }
    }
  });
};

module.exports.uploadPhoto = function _callee10(req, res, _) {
  var file, path, ext, imageName, oAuthClient, drive, restest;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          console.log(req.files);

          if (!req.files) {
            _context10.next = 28;
            break;
          }

          file = req.files[0];
          path = os.tmpdir() + '/';
          ext = file.originalname.split('.').pop();
          commonHelper.prepareUploadFolder(path);
          imageName = 'Product_' + file.originalname.split('.')[0] + "_" + moment().format("DD MMM YYY HH:mm") + '.' + ext;
          _context10.prev = 7;
          fs.writeFileSync(path + imageName, file.buffer, 'utf8');
          oAuthClient = new google.auth.OAuth2(commonHelper.CLIENT_ID, commonHelper.CLIENT_SECRET, commonHelper.REDIRECT_URI);
          oAuthClient.setCredentials({
            refresh_token: commonHelper.REFRESH_TOKEN
          });
          drive = google.drive({
            version: "v3",
            auth: oAuthClient
          });
          _context10.t0 = JSON;
          _context10.t1 = JSON;
          _context10.next = 16;
          return regeneratorRuntime.awrap(uploadImageToDrive(imageName, ext, path + imageName, drive));

        case 16:
          _context10.t2 = _context10.sent;
          _context10.t3 = _context10.t1.stringify.call(_context10.t1, _context10.t2);
          restest = _context10.t0.parse.call(_context10.t0, _context10.t3);
          restest.imageName = imageName;
          return _context10.abrupt("return", res.api(200, "Image uploaded", restest, false));

        case 23:
          _context10.prev = 23;
          _context10.t4 = _context10["catch"](7);
          return _context10.abrupt("return", res.api(422, "cannot upload", null, false));

        case 26:
          _context10.next = 29;
          break;

        case 28:
          return _context10.abrupt("return", res.api(422, "No image to upload", null, false));

        case 29:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[7, 23]]);
};

function uploadImageToDrive(fileName, mime, image, drive) {
  var folderId, response;
  return regeneratorRuntime.async(function uploadImageToDrive$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(getFolderId('SHARAFA-PRODUCTS', drive));

        case 2:
          folderId = _context11.sent;
          console.log("sucess", image, fileName, mime, folderId);
          _context11.prev = 4;
          _context11.next = 7;
          return regeneratorRuntime.awrap(drive.files.create({
            requestBody: {
              name: fileName,
              mimeType: "image/" + mime,
              parents: [folderId]
            },
            media: {
              mimeType: "image/" + mime,
              body: fs.createReadStream(image)
            }
          }));

        case 7:
          response = _context11.sent;
          console.log(response.data);
          return _context11.abrupt("return", shareImagePublic(response.data.id, drive));

        case 12:
          _context11.prev = 12;
          _context11.t0 = _context11["catch"](4);
          console.log(_context11.t0.message, "error");

        case 15:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[4, 12]]);
}

function shareImagePublic(fileId, drive) {
  var result;
  return regeneratorRuntime.async(function shareImagePublic$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          _context12.next = 3;
          return regeneratorRuntime.awrap(drive.permissions.create({
            fileId: fileId,
            requestBody: {
              role: 'reader',
              type: 'anyone'
            }
          }));

        case 3:
          _context12.next = 5;
          return regeneratorRuntime.awrap(drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
          }));

        case 5:
          result = _context12.sent;
          console.log("res", result.data);
          return _context12.abrupt("return", result.data);

        case 10:
          _context12.prev = 10;
          _context12.t0 = _context12["catch"](0);
          console.log(_context12.t0.message);

        case 13:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function getFolderId(withName, drive) {
  var result, folder;
  return regeneratorRuntime.async(function getFolderId$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(drive.files.list({
            q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
            fields: 'nextPageToken, files(id, name)',
            spaces: 'drive'
          })["catch"](function (e) {
            return console.log("eeee", e);
          }));

        case 2:
          result = _context13.sent;
          folder = result.data.files.filter(function (x) {
            return x.name === withName;
          });
          return _context13.abrupt("return", folder.length ? folder[0].id : null);

        case 5:
        case "end":
          return _context13.stop();
      }
    }
  });
}