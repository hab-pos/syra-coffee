"use strict";

var _require = require('./category-repository'),
    categoryRepository = _require.categoryRepository;

var _require2 = require('../db'),
    sequelize = _require2.sequelize;

var _require3 = require("../ProductApp/product-model"),
    productsModel = _require3.productsModel;

var _require4 = require('./category-model'),
    CategoryModel = _require4.CategoryModel;

var loadsh = require('lodash');

module.exports.add_Category = function _callee(req, res, _) {
  var _req$body, category_name, color, available_branches, is_Active, created_by;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, category_name = _req$body.category_name, color = _req$body.color, available_branches = _req$body.available_branches, is_Active = _req$body.is_Active, created_by = _req$body.created_by;
          categoryRepository.isUniqueCode(category_name).then(function (category) {
            if (category) {
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

              categoryRepository.addcategory(category_name, color, available_branches, is_Active, created_by, JSON.stringify(orders)).then(function (info) {
                res.api(200, "category saved", {
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

module.exports.test_order = function _callee2(req, res, _) {
  var data, array, index, element, index_branch, element_prod, item;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(CategoryModel.findAll({}));

        case 2:
          data = _context2.sent;
          array = [];
          index = 0;

        case 5:
          if (!(index < data.length)) {
            _context2.next = 15;
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
          _context2.next = 11;
          return regeneratorRuntime.awrap(CategoryModel.update({
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
          _context2.next = 5;
          break;

        case 15:
          res.api(200, "category saved", "", true);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.get_category = function _callee3(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          id = req.body.id;
          categoryRepository.getCateogories(id).then(function (category) {
            res.api(200, "categories retrived successfully", {
              category: category
            }, true);
          });

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.update_category = function _callee4(req, res, _) {
  var _req$body2, id, available_branches, category, branch_list, to_insert, to_remove, json_to_do, obj;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body2 = req.body, id = _req$body2.id, available_branches = _req$body2.available_branches;
          _context4.next = 3;
          return regeneratorRuntime.awrap(categoryRepository.getCateogories(id));

        case 3:
          category = _context4.sent;
          branch_list = available_branches.split(",");
          to_insert = branch_list.filter(function (element) {
            return !category.available_branches.includes(element);
          });
          to_remove = category.available_branches.filter(function (element) {
            return !branch_list.includes(element);
          });
          json_to_do = JSON.parse(JSON.stringify(category.order));
          to_insert.forEach(function (element) {
            json_to_do.push({
              branch_id: element,
              order: 0
            });
          });
          json_to_do.forEach(function (element, index) {
            if (to_remove.includes(element.branch_id)) {
              json_to_do.splice(index, 1);
            }
          });
          console.log("inser", to_insert, "remove", to_remove);

          if (to_insert.length > 0) {
            console.log("adding products also wait a moment .....");
            sequelize.query("SELECT * from Products where FIND_IN_SET('" + category._id + "',categories) AND is_deleted = false", {
              type: sequelize.QueryTypes.SELECT
            }).then(function (products) {
              products.forEach(function (element) {
                var branches_to_insert = element.available_branches.split(",").concat(to_insert);
                var order = JSON.parse(element.order);
                to_insert.forEach(function (element) {
                  var item = {
                    branch_id: element,
                    order: 0
                  };
                  order.push(item);
                });
                console.log("before", element.available_branches.split(","), "new ", to_insert, "combained", branches_to_insert);
                productsModel.update({
                  available_branches: branches_to_insert.join(","),
                  order: JSON.stringify(order)
                }, {
                  where: {
                    _id: element._id
                  }
                });
              });
            });
          }

          if (to_remove.length > 0) {
            console.log("adding products also wait a moment .....");
            sequelize.query("SELECT * from Products where FIND_IN_SET('" + category._id + "',categories) AND is_deleted = false", {
              type: sequelize.QueryTypes.SELECT
            }).then(function (products) {
              products.forEach(function (element) {
                var branches_to_insert = element.available_branches.split(",").filter(function (item) {
                  return !to_remove.includes(item);
                });
                var order_list = JSON.parse(element.order);
                var order = [];
                order_list.forEach(function (element) {
                  if (!to_remove.includes(element.branch_id)) {
                    order.push(element);
                  }
                });
                console.log("before", element.available_branches.split(","), "new ", to_remove, "combained", branches_to_insert);
                productsModel.update({
                  available_branches: branches_to_insert.join(","),
                  order: JSON.stringify(order)
                }, {
                  where: {
                    _id: element._id
                  }
                });
              });
            });
          }

          obj = JSON.parse(JSON.stringify(req.body));
          obj.order = JSON.stringify(json_to_do);
          categoryRepository.update_categories(obj).then(function (update_success) {
            update_success[0] > 0 ? res.api(200, "category updated successfully", null, true) : res.api(404, "no category found", null, false);
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.delete_category = function _callee5(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.body.id;
          categoryRepository.deleteCategories(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "category deleted successfully", null, true) : res.api(404, "No category found", null, false);
          });

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.update_order = function _callee6(req, res, _) {
  var _req$body3, order, branch_id, array, index, element, category, mutable_category, index_order, item, data;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body3 = req.body, order = _req$body3.order, branch_id = _req$body3.branch_id;
          iterationCount = 0;
          array = [];
          index = 0;

        case 4:
          if (!(index < order.length)) {
            _context6.next = 19;
            break;
          }

          element = order[index];
          _context6.next = 8;
          return regeneratorRuntime.awrap(CategoryModel.findOne({
            where: {
              _id: element.id
            }
          }));

        case 8:
          category = _context6.sent;
          mutable_category = JSON.parse(JSON.stringify(category));
          console.log(mutable_category);

          for (index_order = 0; index_order < mutable_category.order.length; index_order++) {
            item = mutable_category.order[index_order];

            if (item.branch_id == branch_id) {
              item.order = element.order;
            }

            array.push(item);
          }

          _context6.next = 14;
          return regeneratorRuntime.awrap(CategoryModel.update({
            order: JSON.stringify(array)
          }, {
            where: {
              "_id": element.id
            }
          }));

        case 14:
          data = _context6.sent;
          array = [];

        case 16:
          index++;
          _context6.next = 4;
          break;

        case 19:
          res.api(200, "updated successfully", null, true);

        case 20:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.getBranchCategories = function _callee7(req, res, _) {
  var _req$body4, branch_id, branch_list, array, _loop, index;

  return regeneratorRuntime.async(function _callee7$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body4 = req.body, branch_id = _req$body4.branch_id, branch_list = _req$body4.branch_list;

          if (!branch_list) {
            _context8.next = 14;
            break;
          }

          array = [];

          _loop = function _loop(index) {
            var bid, category, mutable_category_list, _loop2, _index, sorted, _index2, element, index_elem;

            return regeneratorRuntime.async(function _loop$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    bid = branch_list[index];
                    _context7.next = 3;
                    return regeneratorRuntime.awrap(sequelize.query("SELECT * from Categories where FIND_IN_SET('" + bid + "',available_branches) AND `Categories`.`is_deleted` = false ORDER BY `Categories`.`order` ASC", {
                      type: sequelize.QueryTypes.SELECT
                    }));

                  case 3:
                    category = _context7.sent;
                    mutable_category_list = JSON.parse(JSON.stringify(category));

                    _loop2 = function _loop2(_index) {
                      var order_json = JSON.parse(mutable_category_list[_index].order) || [];
                      order_json.forEach(function (element) {
                        if (branch_list.includes(element.branch_id)) {
                          mutable_category_list[_index].order = element.order;
                          console.log(mutable_category_list[_index].category_name, mutable_category_list[_index].order);
                        }
                      });
                    };

                    for (_index = 0; _index < mutable_category_list.length; _index++) {
                      _loop2(_index);
                    }

                    sorted = loadsh.sortBy(mutable_category_list, [function (o) {
                      return o.order;
                    }]);

                    for (_index2 = 0; _index2 < sorted.length; _index2++) {
                      element = sorted[_index2];
                      index_elem = array.map(function (element) {
                        return element._id;
                      }).indexOf(element._id);

                      if (index_elem < 0) {
                        array.push(element);
                      }
                    }

                  case 9:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          };

          index = 0;

        case 5:
          if (!(index < branch_list.length)) {
            _context8.next = 11;
            break;
          }

          _context8.next = 8;
          return regeneratorRuntime.awrap(_loop(index));

        case 8:
          index++;
          _context8.next = 5;
          break;

        case 11:
          res.api(200, "products retrived successfully", {
            category: array
          }, true);
          _context8.next = 15;
          break;

        case 14:
          sequelize.query("SELECT * from Categories where FIND_IN_SET('" + branch_id + "',available_branches) AND `Categories`.`is_deleted` = false ORDER BY `Categories`.`order` ASC", {
            type: sequelize.QueryTypes.SELECT
          }).then(function (category) {
            var mutable_category_list = JSON.parse(JSON.stringify(category));

            var _loop3 = function _loop3(_index3) {
              var order_json = JSON.parse(mutable_category_list[_index3].order) || [];
              order_json.forEach(function (element) {
                if (element.branch_id == branch_id) {
                  mutable_category_list[_index3].order = element.order;
                  console.log(mutable_category_list[_index3].category_name, mutable_category_list[_index3].order);
                }
              });
            };

            for (var _index3 = 0; _index3 < mutable_category_list.length; _index3++) {
              _loop3(_index3);
            }

            var sorted = loadsh.sortBy(mutable_category_list, [function (o) {
              return o.order;
            }]);
            res.api(200, "products retrived successfully", {
              category: sorted
            }, true);
          });

        case 15:
        case "end":
          return _context8.stop();
      }
    }
  });
};