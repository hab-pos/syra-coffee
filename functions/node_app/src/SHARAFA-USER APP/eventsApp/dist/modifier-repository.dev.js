"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./modifier-model'),
    ModifiersModel = _require.ModifiersModel;

var ModifiersRepository =
/*#__PURE__*/
function () {
  function ModifiersRepository() {
    _classCallCheck(this, ModifiersRepository);
  }

  _createClass(ModifiersRepository, [{
    key: "addModifier",
    value: function addModifier(modifier_name, price, iva, iva_value, beans_value, is_Active) {
      return ModifiersModel.create({
        modifier_name: modifier_name,
        price: price,
        iva: iva,
        beans_value: beans_value,
        iva_value: iva_value,
        is_Active: is_Active
      });
    }
  }, {
    key: "getModifiers",
    value: function getModifiers(id) {
      return id ? ModifiersModel.findOne({
        where: {
          _id: id
        }
      }) : ModifiersModel.findAll({
        where: {
          is_deleted: false
        },
        order: [["createdAt", "DESC"]]
      });
    }
  }, {
    key: "deleteModifier",
    value: function deleteModifier(id) {
      return ModifiersModel.update({
        is_deleted: true
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "updateModifier",
    value: function updateModifier(query) {
      return ModifiersModel.update(query, {
        where: {
          _id: query._id
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

  return ModifiersRepository;
}();

module.exports.ModifiersRepository = new ModifiersRepository();