"use strict";

var _require = require('./catelouge-repository'),
    catelougeRepository = _require.catelougeRepository;

var _require2 = require("./catelouge-emitter"),
    catelouge_inserted = _require2.catelouge_inserted;

module.exports.add_inventory = function _callee(req, res, _) {
  var _req$body, inventory_name, reference, unit, price, category_id, available_branches, created_by;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, inventory_name = _req$body.inventory_name, reference = _req$body.reference, unit = _req$body.unit, price = _req$body.price, category_id = _req$body.category_id, available_branches = _req$body.available_branches, created_by = _req$body.created_by;
          console.log(req.body);
          catelougeRepository.isUniqueCode(inventory_name).then(function (response) {
            if (response) {
              res.api(200, "already available", null, false);
            } else {
              catelougeRepository.addInventory(inventory_name, reference, unit, price, category_id, available_branches, created_by).then(function (info) {
                res.api(200, "inventory saved", {
                  info: info
                }, true);
                catelouge_inserted({
                  ids: available_branches.split(","),
                  catelouge: info
                });
              });
            }
          });

        case 3:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.get_inventories_sorted = function _callee2(req, res, _) {
  var result;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(catelougeRepository.get_inventories_sorted(null));

        case 2:
          result = _context2.sent;
          res.api(200, "retrived successfully", {
            inventories: result
          }, true);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.get_inventories = function _callee3(req, res, _) {
  var _req$body2, id, device_id, branch_list, inventories;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, id = _req$body2.id, device_id = _req$body2.device_id, branch_list = _req$body2.branch_list;

          if (device_id) {
            catelougeRepository.get_branchInfo(device_id).then(function (branch_info) {
              if (branch_info) {
                var branch_id = branch_info._id;
                var inventories = [];
                catelougeRepository.get_inventories(id).then(function (inventories_list) {
                  inventories_list.forEach(function (element) {
                    if (element.available_branches.includes(branch_id)) {
                      inventories.push(element);
                    }
                  });
                  res.api(200, "branch inventory retrived successfully", {
                    inventories: inventories
                  }, true);
                });
              } else {
                res.api(200, "IPAD Not registered to Branch", null, false);
              }
            });
          } else if (branch_list) {
            if (branch_list.length == 0) {
              catelougeRepository.get_inventories(id).then(function (inventories) {
                res.api(200, "inventory retrived successfully", {
                  inventories: inventories
                }, true);
              });
            } else {
              inventories = [];
              catelougeRepository.get_inventories(id).then(function (inventories_list) {
                branch_list.forEach(function (element_branch) {
                  inventories_list.forEach(function (element) {
                    if (element.available_branches.includes(element_branch)) {
                      var index = inventories.map(function (iv) {
                        return iv._id;
                      }).indexOf(element._id);

                      if (index < 0) {
                        inventories.push(element);
                      }
                    }
                  });
                });
                res.api(200, "branch inventory retrived successfully", {
                  inventories: inventories
                }, true);
              });
            }
          } else {
            catelougeRepository.get_inventories(id).then(function (inventories) {
              res.api(200, "inventory retrived successfully", {
                inventories: inventories
              }, true);
            });
          }

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.update_inventory = function _callee4(req, res, _) {
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          catelougeRepository.update_inventory(req.body).then(function (update_success) {
            update_success[0] > 0 ? res.api(200, "inventory updated successfully", null, true) : res.api(404, "no inventory found", null, false);
            catelouge_inserted({
              ids: req.body.available_branches.split(","),
              catelouge: req.body
            });
          });

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.delete_inventory = function _callee5(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.body.id;
          catelougeRepository.delete_inventory(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "inventory deleted successfully", null, true) : res.api(404, "No inventory found", null, false);
          });

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.search_inventory = function _callee6(req, res, _) {
  var search_string;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          search_string = req.body.search_string;
          catelougeRepository.search(search_string).then(function (response) {
            res.api(200, "inventory read successfully", response, true);
          });

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
};