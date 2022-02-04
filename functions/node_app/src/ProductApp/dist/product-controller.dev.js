"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _require = require('./product-repository'),
    ProductsRepository = _require.ProductsRepository;

var _require2 = require("../SetupApp/setup-repository"),
    setupRepository = _require2.setupRepository;

var _require3 = require('../db'),
    sequelize = _require3.sequelize;

var _require4 = require('./product-model'),
    productsModel = _require4.productsModel;

var loadsh = require('lodash');

module.exports.add_Product = function _callee(req, res, _) {
  var _req$body, product_name, price, iva, categories, color, available_branches, created_by, price_with_iva;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, product_name = _req$body.product_name, price = _req$body.price, iva = _req$body.iva, categories = _req$body.categories, color = _req$body.color, available_branches = _req$body.available_branches, created_by = _req$body.created_by, price_with_iva = _req$body.price_with_iva;
          ProductsRepository.isUniqueproduct(product_name).then(function (response) {
            if (response) {
              res.api(200, "already available", null, false);
            } else {
              var orders = [];
              var array = available_branches.split(',');

              for (var index = 0; index < array.length; index++) {
                var element = {
                  branch_id: array[index],
                  order: 0
                };
                orders.push(element);
              }

              ProductsRepository.addProduct(product_name, price, iva, categories, color, available_branches, created_by, price_with_iva, JSON.stringify(orders)).then(function (info) {
                res.api(200, "product saved", {
                  info: info
                }, true);
              });
            }
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.get_products = function _callee2(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.body.id;
          ProductsRepository.getProducts(id).then(function (products) {
            res.api(200, "products retrived successfully", {
              products: products
            }, true);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.update_products = function _callee3(req, res, _) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          console.log(req.body);
          ProductsRepository.update_Product(req.body).then(function (update_success) {
            update_success[0] > 0 ? res.api(200, "product updated successfully", null, true) : res.api(404, "no product found", null, false);
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.delete_products = function _callee4(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.body.id;
          ProductsRepository.deleteProduct(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "product deleted successfully", null, true) : res.api(404, "No product found", null, false);
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.update_order = function _callee5(req, res, _) {
  var _req$body2, order, branch_id, array, index, element, product, mutable_products, index_order, item, data;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body2 = req.body, order = _req$body2.order, branch_id = _req$body2.branch_id;
          iterationCount = 0;
          array = [];
          index = 0;

        case 4:
          if (!(index < order.length)) {
            _context5.next = 18;
            break;
          }

          element = order[index];
          _context5.next = 8;
          return regeneratorRuntime.awrap(productsModel.findOne({
            where: {
              _id: element.id
            }
          }));

        case 8:
          product = _context5.sent;
          mutable_products = JSON.parse(JSON.stringify(product));

          for (index_order = 0; index_order < mutable_products.order.length; index_order++) {
            item = mutable_products.order[index_order];

            if (item.branch_id == branch_id) {
              item.order = element.order;
            }

            array.push(item);
          }

          _context5.next = 13;
          return regeneratorRuntime.awrap(productsModel.update({
            order: JSON.stringify(array)
          }, {
            where: {
              "_id": element.id
            }
          }));

        case 13:
          data = _context5.sent;
          array = [];

        case 15:
          index++;
          _context5.next = 4;
          break;

        case 18:
          res.api(200, "updated successfully", null, true);

        case 19:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.get_all_products = function _callee7(req, res, _) {
  var device_id, products_list, branch_info, _ret;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          device_id = req.body.device_id;
          products_list = [];
          _context8.next = 4;
          return regeneratorRuntime.awrap(ProductsRepository.get_branchInfo(device_id));

        case 4:
          branch_info = _context8.sent;

          if (!branch_info) {
            _context8.next = 13;
            break;
          }

          _context8.next = 8;
          return regeneratorRuntime.awrap(function _callee6() {
            var categories, mutable_category_list, _loop, index, sorted, _loop2, discount_list;

            return regeneratorRuntime.async(function _callee6$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(sequelize.query("SELECT * from Categories where FIND_IN_SET('" + branch_info._id + "',available_branches) AND `Categories`.`is_deleted` = false AND `Categories`.`is_Active` = true", {
                      type: sequelize.QueryTypes.SELECT
                    }));

                  case 2:
                    categories = _context7.sent;
                    mutable_category_list = JSON.parse(JSON.stringify(categories));

                    _loop = function _loop(index) {
                      var order_json = JSON.parse(mutable_category_list[index].order) || [];
                      order_json.forEach(function (element) {
                        if (element.branch_id == branch_info._id) {
                          mutable_category_list[index].order = element.order;
                          console.log(mutable_category_list[index].category_name, mutable_category_list[index].order);
                        }
                      });
                    };

                    for (index = 0; index < mutable_category_list.length; index++) {
                      _loop(index);
                    }

                    sorted = loadsh.sortBy(mutable_category_list, [function (o) {
                      return o.order;
                    }]);

                    _loop2 = function _loop2() {
                      var item, element, prods, mutable_product_list, _loop3, _index, sorted_prods;

                      return regeneratorRuntime.async(function _loop2$(_context6) {
                        while (1) {
                          switch (_context6.prev = _context6.next) {
                            case 0:
                              item = new Object();
                              element = sorted[i];
                              item.category = element;
                              _context6.next = 5;
                              return regeneratorRuntime.awrap(sequelize.query("SELECT Products.*,IVA.`_id` as iva_id, IVA.`iva_percent` from Products INNER JOIN IVA ON Products.iva = IVA._id where FIND_IN_SET('" + branch_info._id + "',available_branches) AND FIND_IN_SET('" + element._id + "',categories) AND `Products`.`is_deleted` = false  AND `Products`.`is_Active` = true", {
                                type: sequelize.QueryTypes.SELECT
                              }));

                            case 5:
                              prods = _context6.sent;
                              mutable_product_list = JSON.parse(JSON.stringify(prods));

                              _loop3 = function _loop3(_index) {
                                var order_json = JSON.parse(mutable_product_list[_index].order) || [];
                                order_json.forEach(function (element) {
                                  if (element.branch_id == branch_info._id) {
                                    mutable_product_list[_index].order = element.order;
                                    console.log(mutable_product_list[_index].product_name, mutable_product_list[_index].order);
                                  }
                                });
                              };

                              for (_index = 0; _index < mutable_product_list.length; _index++) {
                                _loop3(_index);
                              }

                              sorted_prods = loadsh.sortBy(mutable_product_list, [function (o) {
                                return o.order;
                              }]);
                              item.products = sorted_prods;
                              products_list.push(item);

                            case 12:
                            case "end":
                              return _context6.stop();
                          }
                        }
                      });
                    };

                    i = 0;

                  case 9:
                    if (!(i < sorted.length)) {
                      _context7.next = 15;
                      break;
                    }

                    _context7.next = 12;
                    return regeneratorRuntime.awrap(_loop2());

                  case 12:
                    i++;
                    _context7.next = 9;
                    break;

                  case 15:
                    _context7.next = 17;
                    return regeneratorRuntime.awrap(setupRepository.get_Discounts());

                  case 17:
                    discount_list = _context7.sent;
                    return _context7.abrupt("return", {
                      v: res.api(200, "retrived successfully", {
                        products_list: products_list,
                        discount_list: discount_list
                      }, true)
                    });

                  case 19:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          }());

        case 8:
          _ret = _context8.sent;

          if (!(_typeof(_ret) === "object")) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", _ret.v);

        case 11:
          _context8.next = 14;
          break;

        case 13:
          res.api(404, "IPAD Not registered to branch", null, false);

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports.getBranchProducts = function _callee8(req, res, _) {
  var _req$body3, branch_id, branch_list, array, _loop4, index;

  return regeneratorRuntime.async(function _callee8$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body3 = req.body, branch_id = _req$body3.branch_id, branch_list = _req$body3.branch_list;

          if (!branch_list) {
            _context10.next = 14;
            break;
          }

          array = [];

          _loop4 = function _loop4(index) {
            var bid, products, mutable_product_list, _loop5, _index2, sorted, _index3, element, index_elem;

            return regeneratorRuntime.async(function _loop4$(_context9) {
              while (1) {
                switch (_context9.prev = _context9.next) {
                  case 0:
                    bid = branch_list[index];
                    _context9.next = 3;
                    return regeneratorRuntime.awrap(sequelize.query("SELECT * from Products where FIND_IN_SET('" + bid + "',available_branches) AND `Products`.`is_deleted` = false ORDER BY `Products`.`order` ASC", {
                      type: sequelize.QueryTypes.SELECT
                    }));

                  case 3:
                    products = _context9.sent;
                    mutable_product_list = JSON.parse(JSON.stringify(products));

                    _loop5 = function _loop5(_index2) {
                      var order_json = JSON.parse(mutable_product_list[_index2].order) || [];
                      order_json.forEach(function (element) {
                        if (element.branch_id == branch_id) {
                          mutable_product_list[_index2].order = element.order;
                          console.log(mutable_product_list[_index2].product_name, mutable_product_list[_index2].order);
                        }
                      });
                    };

                    for (_index2 = 0; _index2 < mutable_product_list.length; _index2++) {
                      _loop5(_index2);
                    }

                    sorted = loadsh.sortBy(mutable_product_list, [function (o) {
                      return o.order;
                    }]);

                    for (_index3 = 0; _index3 < sorted.length; _index3++) {
                      element = sorted[_index3];
                      index_elem = array.map(function (element) {
                        return element._id;
                      }).indexOf(element._id);

                      if (index_elem < 0) {
                        array.push(element);
                      }
                    }

                  case 9:
                  case "end":
                    return _context9.stop();
                }
              }
            });
          };

          index = 0;

        case 5:
          if (!(index < branch_list.length)) {
            _context10.next = 11;
            break;
          }

          _context10.next = 8;
          return regeneratorRuntime.awrap(_loop4(index));

        case 8:
          index++;
          _context10.next = 5;
          break;

        case 11:
          res.api(200, "products retrived successfully", {
            products: array
          }, true);
          _context10.next = 15;
          break;

        case 14:
          sequelize.query("SELECT * from Products where FIND_IN_SET('" + branch_id + "',available_branches) AND `Products`.`is_deleted` = false ORDER BY `Products`.`order` ASC", {
            type: sequelize.QueryTypes.SELECT
          }).then(function (products) {
            var mutable_product_list = JSON.parse(JSON.stringify(products));

            var _loop6 = function _loop6(_index4) {
              var order_json = JSON.parse(mutable_product_list[_index4].order) || [];
              order_json.forEach(function (element) {
                if (element.branch_id == branch_id) {
                  mutable_product_list[_index4].order = element.order;
                  console.log(mutable_product_list[_index4].product_name, mutable_product_list[_index4].order);
                }
              });
            };

            for (var _index4 = 0; _index4 < mutable_product_list.length; _index4++) {
              _loop6(_index4);
            }

            var sorted = loadsh.sortBy(mutable_product_list, [function (o) {
              return o.order;
            }]);
            res.api(200, "products retrived successfully", {
              products: sorted
            }, true);
          });

        case 15:
        case "end":
          return _context10.stop();
      }
    }
  });
};

module.exports.test_order = function _callee9(req, res, _) {
  var data, array, index, element, index_branch, element_prod, item;
  return regeneratorRuntime.async(function _callee9$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(productsModel.findAll({}));

        case 2:
          data = _context11.sent;
          array = [];
          index = 0;

        case 5:
          if (!(index < data.length)) {
            _context11.next = 15;
            break;
          }

          element = data[index];

          for (index_branch = 0; index_branch < element.available_branches.length; index_branch++) {
            element_prod = element.available_branches[index_branch];
            item = {
              branch_id: element_prod,
              order: 0
            };
            array.push(item);
          }

          console.log(array, "index", index);
          _context11.next = 11;
          return regeneratorRuntime.awrap(productsModel.update({
            order: JSON.stringify(array)
          }, {
            where: {
              "_id": element._id
            }
          }));

        case 11:
          array = [];

        case 12:
          index++;
          _context11.next = 5;
          break;

        case 15:
          res.api(200, "category saved", "", true);

        case 16:
        case "end":
          return _context11.stop();
      }
    }
  });
}; // ProductsRepository.get_branchInfo(device_id).then(branch => {
//     if (branch) {
//         const branch_id = branch._id
//         console.log("branch_info",branch)
//         sequelize.query("SELECT * from Categories where FIND_IN_SET('" + branch_id + "',available_branches) AND `Categories`.`is_deleted` = false ORDER BY `Categories`.`order` ASC", { type: sequelize.QueryTypes.SELECT })
//             .then(category => {
//                 category.forEach(element => {
//                     let item = new Object()
//                     item.category = element
//                     item.products = []
//                     sequelize.query("SELECT Products.*,IVA.`_id` as iva_id, IVA.`iva_percent` from Products INNER JOIN IVA ON Products.iva = IVA._id where FIND_IN_SET('" + branch_id + "',available_branches) AND FIND_IN_SET('" + element._id + "',categories) AND `Products`.`is_deleted` = false ORDER BY `Products`.`order` ASC", { type: sequelize.QueryTypes.SELECT})
//                         .then(products => {
//                             item.products = products
//                         })
//                         products_list.push(item)
//                 });
//                 setupRepository.get_Discounts().then(discounts => {
//                     return res.api(200, "retrived successfully", { products_list: products_list, discount_list: discounts }, true)
//                 })
//             })
//     }
//     else {
//         res.api(404, "IPAD Not registered to branch", null, false)
//     }
// })