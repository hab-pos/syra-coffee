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
});

var Branches =
/*#__PURE__*/
function (_Model) {
  _inherits(Branches, _Model);

  function Branches() {
    _classCallCheck(this, Branches);

    return _possibleConstructorReturn(this, _getPrototypeOf(Branches).apply(this, arguments));
  }

  return Branches;
}(Model);

Branches.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false
  },
  branch_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  device_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: true,
    get: function get() {
      return this.getDataValue('lat') == null ? "0.0" : this.getDataValue('lat');
    }
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: true,
    get: function get() {
      return this.getDataValue('lng') == null ? "0.0" : this.getDataValue('lng');
    }
  },
  show_on_app: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  espresso_report_date: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: false,
    get: function get() {
      if (this.getDataValue('espresso_report_date')) {
        return this.getDataValue('espresso_report_date').split(",");
      } else {
        return [];
      }
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
Branches.sync(true);
module.exports.BrancheModel = Branches;