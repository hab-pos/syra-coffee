"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./category-model'),
    CategoryModel = _require.CategoryModel;

var CategoryRepository =
/*#__PURE__*/
function () {
  function CategoryRepository() {
    _classCallCheck(this, CategoryRepository);
  }

  _createClass(CategoryRepository, [{
    key: "addcategory",
    value: function addcategory(category_name, color, available_branches, is_Active, created_by, order) {
      return CategoryModel.create({
        category_name: category_name,
        color: color,
        available_branches: available_branches,
        is_Active: is_Active,
        created_by: created_by,
        order: order
      });
    }
  }, {
    key: "getCateogories",
    value: function getCateogories(id) {
      return id ? CategoryModel.findOne({
        where: {
          _id: id
        }
      }) : CategoryModel.findAll({
        where: {
          is_deleted: false
        }
      });
    }
  }, {
    key: "deleteCategories",
    value: function deleteCategories(id) {
      return CategoryModel.update({
        is_deleted: true
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "update_categories",
    value: function update_categories(query) {
      return CategoryModel.update(query, {
        where: {
          _id: query.id
        }
      });
    }
  }, {
    key: "updateOrder",
    value: function updateOrder(order) {
      return CategoryModel.update({
        order: order.order
      }, {
        where: {
          _id: order.id
        }
      });
    }
  }, {
    key: "isUniqueCode",
    value: function isUniqueCode(name) {
      return CategoryModel.findOne({
        where: {
          category_name: name,
          is_deleted: false
        }
      });
    }
  }, {
    key: "get_max_order",
    value: function get_max_order() {
      return CategoryModel.max('order');
    }
  }]);

  return CategoryRepository;
}();

module.exports.categoryRepository = new CategoryRepository();