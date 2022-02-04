"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./products-model'),
    UserProducts = _require.UserProducts;

var _require2 = require("../../SetupApp/setup-model"),
    IVAModel = _require2.IVAModel;

var _require3 = require("../Category_app/category-model"),
    UserCategories = _require3.UserCategories;

var _require4 = require("../ModifiersApp/modifier-model"),
    ModifiersModel = _require4.ModifiersModel;

var _require5 = require('../../User_App/User-model'),
    MyCartModel = _require5.MyCartModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op; // {
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
        is_deleted: data.is_deleted,
        reference: data.reference
      });
    }
  }, {
    key: "getProducts",
    value: function getProducts(id) {
      var _where;

      var user_id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
      return id ? UserProducts.findOne({
        where: {
          _id: id
        }
      }) : UserProducts.findAll({
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
        }],
        order: [["order", "ASC"]]
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
        }, {
          model: ModifiersModel,
          as: "required_modifier_list"
        }, {
          model: ModifiersModel,
          as: "optional_modifier_list"
        }]
      });
    }
  }]);

  return ProductRepository;
}();

module.exports.ProductRepository = new ProductRepository();