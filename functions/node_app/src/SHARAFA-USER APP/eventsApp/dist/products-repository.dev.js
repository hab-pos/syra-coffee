"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./products-model'),
    UserProducts = _require.UserProducts;

var _require2 = require("../../SetupApp/setup-model"),
    IVAModel = _require2.IVAModel;

var _require3 = require("../Category_app/category-model"),
    UserCategories = _require3.UserCategories; // {
//     _id,
//       product_name,
//       price,
//       iva,
//       beans_value,
//       category,
//       image_name,
//       image_url,
//       setup_selected,
//       required_modifier,
//       optional_modifier,
//       grinds,
//       orgin_text,
//       notes,
//       notes_enabled,
//       origin_enabled,
//       description,
//       order,
//       is_Active,
//       is_deleted
//   }


var ProductRepository =
/*#__PURE__*/
function () {
  function ProductRepository() {
    _classCallCheck(this, ProductRepository);
  }

  _createClass(ProductRepository, [{
    key: "addProduct",
    value: function addProduct(data) {
      return UserProducts.create({
        product_name: data.product_name,
        price: data.price,
        iva: data.iva,
        beans_value: data.beans_value,
        category: data.category,
        image_name: data.image_name,
        image_url: data.image_url,
        setup_selected: data.setup_selected,
        required_modifier: data.required_modifier,
        optional_modifier: data.optional_modifier,
        grinds: data.grinds,
        orgin_text: data.orgin_text,
        notes: data.notes,
        notes_enabled: data.notes_enabled,
        origin_enabled: data.origin_enabled,
        description: data.description,
        order: data.order,
        is_Active: data.is_Active,
        is_deleted: data.is_deleted
      });
    }
  }, {
    key: "getProducts",
    value: function getProducts(id) {
      return id ? UserProducts.findOne({
        where: {
          _id: id
        }
      }) : UserProducts.findAll({
        where: {
          is_deleted: false
        },
        order: [["order", "ASC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }, {
          model: UserCategories,
          as: "category_details"
        }]
      });
    }
  }, {
    key: "deleteProduct",
    value: function deleteProduct(id) {
      return UserProducts.update({
        is_deleted: true
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "updateProduct",
    value: function updateProduct(query) {
      return UserProducts.update(query, {
        where: {
          _id: query._id
        }
      });
    }
  }, {
    key: "isUniqueCode",
    value: function isUniqueCode(name) {
      return UserProducts.findOne({
        where: {
          category_name: name,
          is_deleted: false
        }
      });
    }
  }, {
    key: "getFeaturedProducts",
    value: function getFeaturedProducts() {
      return UserProducts.findAll({
        where: {
          is_deleted: false,
          is_featured: true
        },
        order: [["order", "ASC"]],
        include: [{
          model: IVAModel,
          as: "iva_info"
        }, {
          model: UserCategories,
          as: "category_details"
        }]
      });
    }
  }]);

  return ProductRepository;
}();

module.exports.ProductRepository = new ProductRepository();