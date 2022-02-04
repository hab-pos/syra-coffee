"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require("sequelize"),
    Model = _require.Model,
    DataTypes = _require.DataTypes,
    UUIDV4 = _require.UUIDV4;

var _require2 = require('../db'),
    sequelize = _require2.sequelize;

var _require3 = require("../SetupApp/setup-model"),
    IVAModel = _require3.IVAModel;

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
});

var Products =
/*#__PURE__*/
function (_Model) {
  _inherits(Products, _Model);

  function Products() {
    _classCallCheck(this, Products);

    return _possibleConstructorReturn(this, _getPrototypeOf(Products).apply(this, arguments));
  }

  return Products;
}(Model);

Products.init({
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
    allowNull: false
  },
  price_with_iva: {
    type: DataTypes.STRING,
    allowNull: false
  },
  iva: {
    type: DataTypes.STRING,
    allowNull: false
  },
  beanValue: {
    type: DataTypes.STRING,
    allowNull: true
  },
  categories: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('categories')) {
        return this.getDataValue('categories').split(',');
      } else {
        return "";
      }
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  available_branches: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('available_branches')) {
        return this.getDataValue('available_branches').split(',');
      } else {
        return "";
      }
    }
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_Active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('order')) {
        return JSON.parse(this.getDataValue('order'));
      } else {
        return null;
      }
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
Products.belongsTo(IVAModel, {
  as: "iva_info",
  foreignKey: "iva"
});
Products.sync(true);
module.exports.productsModel = Products;