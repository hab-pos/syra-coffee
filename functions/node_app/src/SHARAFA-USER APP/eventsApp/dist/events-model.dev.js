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

var _require2 = require('../../db'),
    sequelize = _require2.sequelize;

var _require3 = require("../Products_app/products-model"),
    UserProducts = _require3.UserProducts;

var moment = require('moment');

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
});

var SyraEvents =
/*#__PURE__*/
function (_Model) {
  _inherits(SyraEvents, _Model);

  function SyraEvents() {
    _classCallCheck(this, SyraEvents);

    return _possibleConstructorReturn(this, _getPrototypeOf(SyraEvents).apply(this, arguments));
  }

  return SyraEvents;
}(Model);

SyraEvents.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  event_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  end_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reward_mode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reward_mode_string: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("reward_mode") == "discount50") {
        return "Discount (50%)";
      } else {
        return "Beans (2x)";
      }
    }
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false
  },
  products: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  thumbnail_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thumbnail_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cover_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cover_url: {
    type: DataTypes.STRING,
    allowNull: false
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
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  event_time_frame: {
    type: DataTypes.VIRTUAL,
    get: function get() {
      if (moment(this.getDataValue('start_date')).month() == moment(this.getDataValue('end_date')).month()) {
        return moment(this.getDataValue('start_date')).format("MMM D") + " - " + moment(this.getDataValue('end_date')).format("MMM D YYYY");
      } else {
        return moment(this.getDataValue('start_date')).format("MMM D YYYY") + " - " + moment(this.getDataValue('end_date')).format("MMM D YYYY");
      }
    }
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
  is_expired: {
    type: DataTypes.VIRTUAL,
    get: function get() {
      return moment(this.getDataValue('end_date')).diff(moment()) < 0;
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});

var EventProducts =
/*#__PURE__*/
function (_Model2) {
  _inherits(EventProducts, _Model2);

  function EventProducts() {
    _classCallCheck(this, EventProducts);

    return _possibleConstructorReturn(this, _getPrototypeOf(EventProducts).apply(this, arguments));
  }

  return EventProducts;
}(Model);

EventProducts.init({
  SyraEventId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "SyraEvents",
      key: "_id"
    }
  },
  UserProductId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "UserProducts",
      key: "_id"
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
SyraEvents.belongsToMany(UserProducts, {
  as: "product_info",
  foreignKey: "SyraEventId",
  through: "EventProducts"
});
module.exports.EventProducts = EventProducts;
SyraEvents.sync(true);
EventProducts.sync(true);
module.exports.SyraEvents = SyraEvents;