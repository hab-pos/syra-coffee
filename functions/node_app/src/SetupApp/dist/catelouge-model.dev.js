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

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
}); //IVA MODEL

var IVA =
/*#__PURE__*/
function (_Model) {
  _inherits(IVA, _Model);

  function IVA() {
    _classCallCheck(this, IVA);

    return _possibleConstructorReturn(this, _getPrototypeOf(IVA).apply(this, arguments));
  }

  return IVA;
}(Model);

IVA.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  iva_percent: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
IVA.sync(true);
module.exports.IVAModel = IVA; //EXPENSE MODEL

var Expense =
/*#__PURE__*/
function (_Model2) {
  _inherits(Expense, _Model2);

  function Expense() {
    _classCallCheck(this, Expense);

    return _possibleConstructorReturn(this, _getPrototypeOf(Expense).apply(this, arguments));
  }

  return Expense;
}(Model);

Expense.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  expense_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
Expense.sync(true);
module.exports.ExpenseModel = Expense; //Discount MODEL

var Discount =
/*#__PURE__*/
function (_Model3) {
  _inherits(Discount, _Model3);

  function Discount() {
    _classCallCheck(this, Discount);

    return _possibleConstructorReturn(this, _getPrototypeOf(Discount).apply(this, arguments));
  }

  return Discount;
}(Model);

Discount.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  discount_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
Discount.sync(true);
module.exports.DiscountModel = Discount;