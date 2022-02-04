"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./product-model'),
    productsModel = _require.productsModel;

var _require2 = require('../Category_app/category-model'),
    CategoryModel = _require2.CategoryModel;

var _require3 = require("../Branch-app/Branch-model"),
    BrancheModel = _require3.BrancheModel;

var Sequelize = require('sequelize');

var _require4 = require('../SetupApp/setup-model'),
    IVAModel = _require4.IVAModel;

var Op = Sequelize.Op;

var ProductsRepository =
/*#__PURE__*/
function () {
  function ProductsRepository() {
    _classCallCheck(this, ProductsRepository);
  }

  _createClass(ProductsRepository, [{
    key: "addProduct",
    value: function addProduct(product_name, price, iva, categories, color, available_branches, created_by, price_with_iva, order) {
      return productsModel.create({
        product_name: product_name,
        price: price,
        iva: iva,
        categories: categories,
        color: color,
        available_branches: available_branches,
        created_by: created_by,
        price_with_iva: price_with_iva,
        order: order
      });
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
  }, {
    key: "getProducts",
    value: function getProducts(id) {
      return id ? productsModel.findOne({
        where: {
          _id: id
        },
        include: [{
          model: IVAModel,
          as: "iva_info"
        }]
      }) : productsModel.findAll({
        where: {
          is_deleted: false
        },
        order: [["order", "ASC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }]
      });
    }
  }, {
    key: "deleteProduct",
    value: function deleteProduct(id) {
      return productsModel.update({
        is_deleted: true
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "updateOrder",
    value: function updateOrder(order) {
      return productsModel.update({
        order: order.order
      }, {
        where: {
          _id: order.id
        }
      });
    }
  }, {
    key: "update_Product",
    value: function update_Product(query) {
      return productsModel.update(query, {
        where: {
          _id: query.id
        }
      });
    }
  }, {
    key: "isUniqueproduct",
    value: function isUniqueproduct(name) {
      return productsModel.findOne({
        where: {
          product_name: name,
          is_deleted: false
        }
      });
    }
  }, {
    key: "getCateogories",
    value: function getCateogories() {
      return CategoryModel.findAll({
        where: {
          is_deleted: false,
          is_Active: true
        },
        order: [["order", "ASC"]]
      });
    }
  }, {
    key: "get_active_products",
    value: function get_active_products() {
      return productsModel.findAll({
        where: {
          is_deleted: false,
          is_Active: true
        },
        order: [["order", "ASC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }]
      });
    }
  }]);

  return ProductsRepository;
}();

module.exports.ProductsRepository = new ProductsRepository();