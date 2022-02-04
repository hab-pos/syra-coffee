"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require("../../User_App/User-model"),
    MyCartModel = _require.MyCartModel;

var _require2 = require("sequelize"),
    Model = _require2.Model,
    DataTypes = _require2.DataTypes,
    UUIDV4 = _require2.UUIDV4;

var _require3 = require('../../db'),
    sequelize = _require3.sequelize;

var _require4 = require("../../SetupApp/setup-model"),
    IVAModel = _require4.IVAModel;

var _require5 = require("../Category_app/category-model"),
    UserCategories = _require5.UserCategories;

var _require6 = require("../ModifiersApp/modifier-model"),
    ModifiersModel = _require6.ModifiersModel;

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
});

var UserProducts =
/*#__PURE__*/
function (_Model) {
  _inherits(UserProducts, _Model);

  function UserProducts() {
    _classCallCheck(this, UserProducts);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserProducts).apply(this, arguments));
  }

  return UserProducts;
}(Model);

UserProducts.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  product_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
    get: function get() {
      return Number(this.getDataValue('price')).toFixed(2);
    }
  },
  iva: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  beans_value: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image_name: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  image_url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  setup_selected: {
    type: DataTypes.STRING,
    allowNull: false
  },
  required_modifier: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  optional_modifier: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  grinds: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('grinds')) {
        if (_typeof(this.getDataValue('grinds')) != "object") {
          return JSON.parse(this.getDataValue('grinds'));
        }
      }
    }
  },
  orgin_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  notes_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  origin_enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  is_Active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  checked: {
    type: DataTypes.VIRTUAL,
    defaultValue: false
  },
  is_locked: {
    type: DataTypes.VIRTUAL,
    defaultValue: false
  },
  short_description: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('description')) {
        var description = this.getDataValue('description');
        return description.replace(/(<([^>]+)>)/ig, '');
      }
    }
  },
  price_without_tax: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('iva_info')) {
        return (Number(this.getDataValue('price')) - Number(this.getDataValue('price')) * Number(this.getDataValue('iva_info').iva_percent) / 100).toFixed(2);
      }
    }
  },
  wallet_id: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      return "";
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});

var RequiredModifierProducts =
/*#__PURE__*/
function (_Model2) {
  _inherits(RequiredModifierProducts, _Model2);

  function RequiredModifierProducts() {
    _classCallCheck(this, RequiredModifierProducts);

    return _possibleConstructorReturn(this, _getPrototypeOf(RequiredModifierProducts).apply(this, arguments));
  }

  return RequiredModifierProducts;
}(Model);

RequiredModifierProducts.init({
  ModifierId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: ModifiersModel,
      key: "_id"
    }
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: UserProducts,
      key: "_id"
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});

var optionalModifierProducts =
/*#__PURE__*/
function (_Model3) {
  _inherits(optionalModifierProducts, _Model3);

  function optionalModifierProducts() {
    _classCallCheck(this, optionalModifierProducts);

    return _possibleConstructorReturn(this, _getPrototypeOf(optionalModifierProducts).apply(this, arguments));
  }

  return optionalModifierProducts;
}(Model);

optionalModifierProducts.init({
  ModifierId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: ModifiersModel,
      key: "_id"
    }
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: UserProducts,
      key: "_id"
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
UserProducts.belongsTo(IVAModel, {
  as: "iva_info",
  foreignKey: "iva"
});
UserProducts.belongsTo(UserCategories, {
  as: "category_details",
  foreignKey: "category"
});
UserProducts.belongsToMany(ModifiersModel, {
  as: "required_modifier_list",
  foreignKey: "product_id",
  through: "RequiredModifierProducts"
});
UserProducts.belongsToMany(ModifiersModel, {
  as: "optional_modifier_list",
  foreignKey: "product_id",
  through: "optionalModifierProducts"
});
module.exports.RequiredModifierProducts = RequiredModifierProducts;
module.exports.optionalModifierProducts = optionalModifierProducts;
UserProducts.sync(true);
RequiredModifierProducts.sync(true);
optionalModifierProducts.sync(true);
module.exports.UserProducts = UserProducts;