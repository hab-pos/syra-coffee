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

var moment = require('moment');

var _require3 = require('../../Utils/constants'),
    constants = _require3.constants;

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
});

var InventoryReport =
/*#__PURE__*/
function (_Model) {
  _inherits(InventoryReport, _Model);

  function InventoryReport() {
    _classCallCheck(this, InventoryReport);

    return _possibleConstructorReturn(this, _getPrototypeOf(InventoryReport).apply(this, arguments));
  }

  return InventoryReport;
}(Model);

InventoryReport.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  date_of_week: {
    type: DataTypes.DATE,
    allowNull: false
  },
  branch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  weekly_shipped: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  quantity_at_week_start: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  final_remaining: {
    type: DataTypes.DOUBLE,
    allowNull: false
  },
  total_consumption: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    get: function get() {
      if (Number(this.getDataValue('total_consumption')) != null) {
        return Number(this.getDataValue('total_consumption')).toFixed(2);
      } else {
        return -1;
      }
    }
  },
  created_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('date_of_week')) {
        if (this.getDataValue("final_remaining") != -1) {
          return moment(this.getDataValue('date_of_week')).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - " + moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm");
        } else {
          return moment(this.getDataValue('date_of_week')).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - ";
        }
      } else {
        return null;
      }
    }
  },
  duraion: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('date_of_week')) {
        if (this.getDataValue("final_remaining") != -1) {
          return moment(this.getDataValue('date_of_week')).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - " + moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM");
        } else {
          return moment(this.getDataValue('date_of_week')).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - ";
        }
      } else {
        return null;
      }
    }
  },
  total_stock: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('quantity_at_week_start')) {
        return this.getDataValue('quantity_at_week_start').toFixed(2);
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
InventoryReport.sync(true);
module.exports.InventoryReportModel = InventoryReport;