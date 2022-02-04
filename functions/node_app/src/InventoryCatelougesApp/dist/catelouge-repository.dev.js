"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./catelouge-model'),
    InventoryCatelougeModel = _require.InventoryCatelougeModel;

var _require2 = require('./catelouge-model'),
    inventoryBranchModel = _require2.inventoryBranchModel;

var _require3 = require("../Category_app/category-model"),
    CategoryModel = _require3.CategoryModel;

var _require4 = require('../Branch-app/Branch-model'),
    BrancheModel = _require4.BrancheModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var InventoryCatelougeRepoistory =
/*#__PURE__*/
function () {
  function InventoryCatelougeRepoistory() {
    _classCallCheck(this, InventoryCatelougeRepoistory);
  }

  _createClass(InventoryCatelougeRepoistory, [{
    key: "addInventory",
    value: function addInventory(inventory_name, reference, unit, price, category_id, available_branches, created_by) {
      return InventoryCatelougeModel.create({
        inventory_name: inventory_name,
        reference: reference,
        unit: unit,
        price: price,
        category_id: category_id,
        available_branches: available_branches,
        created_by: created_by
      });
    }
  }, {
    key: "get_inventories",
    value: function get_inventories(id) {
      return id ? InventoryCatelougeModel.findOne({
        where: {
          _id: id
        },
        include: [{
          model: CategoryModel,
          as: "category_info"
        }, {
          model: BrancheModel,
          as: "branch_info"
        }]
      }) : InventoryCatelougeModel.findAll({
        include: [{
          model: CategoryModel,
          as: "category_info"
        }, {
          model: BrancheModel,
          as: "branch_info"
        }],
        order: [["createdAt", "DESC"]]
      });
    }
  }, {
    key: "get_inventories_sorted",
    value: function get_inventories_sorted(id) {
      return id ? InventoryCatelougeModel.findOne({
        where: {
          _id: id
        },
        include: [{
          model: CategoryModel,
          as: "category_info"
        }, {
          model: BrancheModel,
          as: "branch_info"
        }]
      }) : InventoryCatelougeModel.findAll({
        include: [{
          model: CategoryModel,
          as: "category_info"
        }, {
          model: BrancheModel,
          as: "branch_info"
        }],
        order: [["reference", "ASC"], ["inventory_name", "ASC"]]
      });
    }
  }, {
    key: "delete_inventory",
    value: function delete_inventory(id) {
      return InventoryCatelougeModel.destroy({
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "update_inventory",
    value: function update_inventory(query) {
      console.log(JSON.stringify(query));
      return InventoryCatelougeModel.update(query, {
        where: {
          _id: query.id
        }
      });
    }
  }, {
    key: "isUniqueCode",
    value: function isUniqueCode(reference) {
      return InventoryCatelougeModel.findOne({
        where: {
          inventory_name: reference
        }
      });
    }
  }, {
    key: "insert_middelware",
    value: function insert_middelware(branch_id, product_id) {
      return inventoryBranchModel.create({
        BranchId: branch_id,
        catelouge_id: product_id
      });
    }
  }, {
    key: "checkUniquenessinMiddleware",
    value: function checkUniquenessinMiddleware(branch_id, product_id) {
      return inventoryBranchModel.findAll({
        where: {
          BranchId: branch_id,
          catelouge_id: product_id
        }
      });
    }
  }, {
    key: "delete_Relation",
    value: function delete_Relation(product_id) {
      return inventoryBranchModel.destroy({
        where: {
          "catelouge_id": product_id
        }
      });
    }
  }, {
    key: "search",
    value: function search(string) {
      var ans = InventoryCatelougeModel.findAll({
        where: _defineProperty({}, Op.or, [{
          inventory_name: _defineProperty({}, Op.like, "%" + string + "%")
        }, {
          reference: _defineProperty({}, Op.like, "%" + string + "%")
        }]),
        include: [{
          model: CategoryModel,
          as: "category_info"
        }, {
          model: BrancheModel,
          as: "branch_info"
        }]
      });
      ans.then(function (res) {
        console.log(res);
      });
      return ans;
    }
  }, {
    key: "get_branchInfo",
    value: function get_branchInfo(device_id) {
      return regeneratorRuntime.async(function get_branchInfo$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", BrancheModel.findOne({
                where: {
                  device_id: device_id
                }
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }]);

  return InventoryCatelougeRepoistory;
}();

module.exports.catelougeRepository = new InventoryCatelougeRepoistory();