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

var _require2 = require("../Branch-app/Branch-model"),
    BrancheModel = _require2.BrancheModel;

var _require3 = require("../BaristaApp/Barista-model"),
    BaristaModel = _require3.BaristaModel;

var _require4 = require("../SetupApp/setup-model"),
    IVAModel = _require4.IVAModel,
    ExpenseModel = _require4.ExpenseModel;

var _require5 = require('../db'),
    sequelize = _require5.sequelize;

var moment = require('moment');

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
});

var ExpenseSchema =
/*#__PURE__*/
function (_Model) {
  _inherits(ExpenseSchema, _Model);

  function ExpenseSchema() {
    _classCallCheck(this, ExpenseSchema);

    return _possibleConstructorReturn(this, _getPrototypeOf(ExpenseSchema).apply(this, arguments));
  }

  return ExpenseSchema;
}(Model);

ExpenseSchema.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  expense_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  motive: {
    type: DataTypes.STRING,
    allowNull: false
  },
  iva_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false,
    get: function get() {
      return Number(this.getDataValue('price')).toFixed(2);
    }
  },
  payment: {
    type: DataTypes.STRING,
    allowNull: true,
    get: function get() {
      return Number(this.getDataValue('payment')).toFixed(2);
    }
  },
  branch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  barista_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('expense_date')) {
        return moment(this.getDataValue('expense_date')).format("DD/MM/YYYY");
      } else {
        return null;
      }
    }
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
ExpenseSchema.belongsTo(BrancheModel, {
  as: "branch_info",
  foreignKey: "branch_id"
});
ExpenseSchema.belongsTo(BaristaModel, {
  as: "barista_info",
  foreignKey: "barista_id"
});
ExpenseSchema.belongsTo(IVAModel, {
  as: "iva_info",
  foreignKey: "iva_id"
});
ExpenseSchema.belongsTo(ExpenseModel, {
  as: "expense_info",
  foreignKey: "motive"
});
ExpenseSchema.sync(true);
module.exports.ExpenseTableModel = ExpenseSchema;