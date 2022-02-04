"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require("http"),
    get = _require.get;

var _require2 = require("sequelize"),
    Model = _require2.Model,
    DataTypes = _require2.DataTypes,
    UUIDV4 = _require2.UUIDV4;

var _require3 = require("../Branch-app/Branch-model"),
    BrancheModel = _require3.BrancheModel;

var _require4 = require('../db'),
    sequelize = _require4.sequelize;

var moment = require('moment');

var _require5 = require('../../Utils/constants'),
    constants = _require5.constants;

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
});

var Barista =
/*#__PURE__*/
function (_Model) {
  _inherits(Barista, _Model);

  function Barista() {
    _classCallCheck(this, Barista);

    return _possibleConstructorReturn(this, _getPrototypeOf(Barista).apply(this, arguments));
  }

  return Barista;
}(Model);

Barista.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  barista_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_logged_in: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  login_time: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      return moment(this.getDataValue("updatedAt")).utc().tz(constants.TIME_ZONE).format('hh : mm A');
    }
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
Barista.sync(true);
module.exports.BaristaModel = Barista; //clockin_table class

var clockin =
/*#__PURE__*/
function (_Model2) {
  _inherits(clockin, _Model2);

  function clockin() {
    _classCallCheck(this, clockin);

    return _possibleConstructorReturn(this, _getPrototypeOf(clockin).apply(this, arguments));
  }

  return clockin;
}(Model);

clockin.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  branch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  barista_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  time_slot: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "checked_in"
  },
  is_active: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false
  },
  is_deleted: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false
  },
  loginTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  logoutTime: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
clockin.belongsTo(BrancheModel, {
  as: "branch_info",
  foreignKey: "branch_id"
});
clockin.belongsTo(Barista, {
  as: "barista_info",
  foreignKey: "barista_id"
});
clockin.sync(true);
module.exports.ClockinModel = clockin;