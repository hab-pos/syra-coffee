"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./catelouge-model'),
    InventoryCatelougeModel = _require.InventoryCatelougeModel;

var _require2 = require('./catelouge-model'),
    inventoryBranchModel = _require2.inventoryBranchModel;

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
        }]
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
          reference: reference
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
      return InventoryCatelougeModel.findAll({
        where: {
          inventory_name: _defineProperty({}, Op.like, "%" + string + "%")
        },
        include: [{
          model: CategoryModel,
          as: "category_info"
        }, {
          model: BrancheModel,
          as: "branch_info"
        }]
      });
    }
  }]);

  return InventoryCatelougeRepoistory;
}();

module.exports.catelougeRepository = new InventoryCatelougeRepoistory();