"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./category-model'),
    UserCategories = _require.UserCategories;

var CategoryRepository =
/*#__PURE__*/
function () {
  function CategoryRepository() {
    _classCallCheck(this, CategoryRepository);
  }

  _createClass(CategoryRepository, [{
    key: "addcategory",
    value: function addcategory(category_name, image_name, image_url, is_Active, order) {
      return UserCategories.create({
        category_name: category_name,
        image_name: image_name,
        image_url: image_url,
        is_Active: is_Active,
        order: order
      });
    }
  }, {
    key: "getCateogories",
    value: function getCateogories(id) {
      return id ? UserCategories.findOne({
        where: {
          _id: id
        }
      }) : UserCategories.findAll({
        where: {
          is_deleted: false
        },
        order: [["ORDER", "ASC"]]
      });
    }
  }, {
    key: "deleteCategories",
    value: function deleteCategories(id) {
      return UserCategories.update({
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
      return UserCategories.update(query, {
        where: {
          _id: query._id
        }
      });
    }
  }, {
    key: "updateOrder",
    value: function updateOrder(order) {
      return UserCategories.update({
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
      return UserCategories.findOne({
        where: {
          category_name: name,
          is_deleted: false
        }
      });
    }
  }]);

  return CategoryRepository;
}();

module.exports.categoryRepository = new CategoryRepository();