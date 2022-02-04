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

var InventoryOrder =
/*#__PURE__*/
function (_Model) {
  _inherits(InventoryOrder, _Model);

  function InventoryOrder() {
    _classCallCheck(this, InventoryOrder);

    return _possibleConstructorReturn(this, _getPrototypeOf(InventoryOrder).apply(this, arguments));
  }

  return InventoryOrder;
}(Model);

InventoryOrder.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  order_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ordered_branch: {
    type: DataTypes.STRING,
    allowNull: false
  },
  received_by: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ordered_by: {
    type: DataTypes.STRING,
    allowNull: true
  },
  delivery_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  number_of_products: {
    type: DataTypes.INTEGER,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('ordered_items')) {
        return JSON.parse(this.getDataValue('ordered_items')).length;
      } else {
        return this.getDataValue('number_of_products');
      }
    }
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment_by_barista: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  admin_msg: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ordered_items: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('ordered_items')) {
        return JSON.parse(this.getDataValue('ordered_items'));
      } else {
        return null;
      }
    }
  },
  created_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('createdAt')) {
        return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY - HH:mm");
      } else {
        return null;
      }
    }
  },
  delivered_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('delivery_date')) {
        return moment(this.getDataValue('delivery_date')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY");
      } else {
        return null;
      }
    }
  },
  price_details: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('ordered_items')) {
        var ordered_items = JSON.parse(this.getDataValue('ordered_items'));
        var price_details = new Object();
        var price_list = Array();
        var totalPrice = 0;
        ordered_items.forEach(function (ordered_item) {
          totalPrice += ordered_item.qty * Number(ordered_item.price);
          var item = {
            id: ordered_item.inventory_id,
            price: ordered_item.qty * Number(ordered_item.price)
          };
          console.log(item);
          price_list.push(item);
        });
        price_details.price_list = price_list;
        price_details.totalPrice = totalPrice;
        return price_details;
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
InventoryOrder.belongsTo(BrancheModel, {
  as: "branch_info",
  foreignKey: "ordered_branch"
});
InventoryOrder.belongsTo(BaristaModel, {
  as: "ordered_by_details",
  foreignKey: "ordered_by"
});
InventoryOrder.belongsTo(BaristaModel, {
  as: "recieved_by_details",
  foreignKey: "received_by"
});
InventoryOrder.sync(true);
module.exports.InventoryOrderModel = InventoryOrder;