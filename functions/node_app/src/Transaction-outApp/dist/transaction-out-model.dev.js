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

var _require4 = require("../BaristaApp/Barista-model"),
    BaristaModel = _require4.BaristaModel;

var moment = require('moment');

var _require5 = require('../../Utils/constants'),
    constants = _require5.constants;

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
}); //Discount MODEL

var TransactionOut =
/*#__PURE__*/
function (_Model) {
  _inherits(TransactionOut, _Model);

  function TransactionOut() {
    _classCallCheck(this, TransactionOut);

    return _possibleConstructorReturn(this, _getPrototypeOf(TransactionOut).apply(this, arguments));
  }

  return TransactionOut;
}(Model);

TransactionOut.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  date_of_transaction: {
    type: DataTypes.DATE,
    allowNull: false
  },
  date_of_transaction_formated: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('date_of_transaction')) {
        if (this.getDataValue("type") == "expense") {
          return moment(this.getDataValue('date_of_transaction')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY");
        } else {
          return moment(this.getDataValue('date_of_transaction')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY HH:mm");
        }
      } else {
        return null;
      }
    }
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false
  },
  barista_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  iva_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  total_amount: {
    type: DataTypes.STRING,
    allowNull: false
  },
  mode_of_payment: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "CASH"
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "-"
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  branch_id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false
  },
  expense_id: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
TransactionOut.belongsTo(IVAModel, {
  as: "iva_info",
  foreignKey: "iva_id"
});
TransactionOut.belongsTo(BaristaModel, {
  as: "barista_info",
  foreignKey: "barista_id"
});
TransactionOut.sync(true);
module.exports.TransactionOutModel = TransactionOut;