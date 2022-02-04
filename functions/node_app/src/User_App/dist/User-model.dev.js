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

var _require4 = require("../Branch-app/Branch-model"),
    BrancheModel = _require4.BrancheModel;

var _require5 = require("../SHARAFA-USER APP/Products_app/products-model"),
    UserProducts = _require5.UserProducts;

var _require6 = require("../SHARAFA-USER APP/ModifiersApp/modifier-model"),
    ModifiersModel = _require6.ModifiersModel;

var _require7 = require("../SHARAFA-USER APP/Category_app/category-model"),
    UserCategories = _require7.UserCategories;

var _require8 = require("../SHARAFA-USER APP/eventsApp/events-model"),
    SyraEvents = _require8.SyraEvents;

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
});

var User =
/*#__PURE__*/
function (_Model) {
  _inherits(User, _Model);

  function User() {
    _classCallCheck(this, User);

    return _possibleConstructorReturn(this, _getPrototypeOf(User).apply(this, arguments));
  }

  return User;
}(Model);

User.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  birth_day: {
    type: DataTypes.DATE,
    allowNull: false
  },
  birth_day_string: {
    type: DataTypes.VIRTUAL,
    get: function get() {
      if (this.birth_day) {
        return moment(this.getDataValue('birth_day')).format("DD-MM-YYYY");
      }
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  default_store: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: ""
  },
  is_logged_in: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  color: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  beansEarnerd: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 0,
    get: function get() {
      return Number(this.getDataValue("beansEarnerd")) <= 0 ? "00" : this.getDataValue("beansEarnerd");
    }
  },
  beansSpent: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 0
  },
  user_reference_number: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});

var UserCreditCards =
/*#__PURE__*/
function (_Model2) {
  _inherits(UserCreditCards, _Model2);

  function UserCreditCards() {
    _classCallCheck(this, UserCreditCards);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserCreditCards).apply(this, arguments));
  }

  return UserCreditCards;
}(Model);

UserCreditCards.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  holder_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  card_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  expiry_date: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_default: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  tokenUser: {
    type: DataTypes.STRING,
    allowNull: true
  },
  idUser: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cardHash: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});

var Cart =
/*#__PURE__*/
function (_Model3) {
  _inherits(Cart, _Model3);

  function Cart() {
    _classCallCheck(this, Cart);

    return _possibleConstructorReturn(this, _getPrototypeOf(Cart).apply(this, arguments));
  }

  return Cart;
}(Model);

Cart.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: false
  },
  required_modifiers: {
    type: DataTypes.STRING,
    allowNull: true,
    get: function get() {
      return this.getDataValue('required_modifiers') == null ? "" : this.getDataValue('required_modifiers');
    }
  },
  optional_modifiers: {
    type: DataTypes.STRING,
    allowNull: true,
    get: function get() {
      return this.getDataValue('optional_modifiers') == null ? "" : this.getDataValue('optional_modifiers');
    }
  },
  grains: {
    type: DataTypes.STRING,
    allowNull: true,
    get: function get() {
      return this.getDataValue('grains') == null ? "" : this.getDataValue('grains');
    }
  },
  is_claiming_gift: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  order_status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "pending"
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  is_claim_wallet: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  wallet_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  event_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_reorder: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    get: function get() {
      return this.getDataValue("is_reorder") != null ? this.getDataValue("is_reorder") : false;
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
User.sync(true);
UserCreditCards.sync(true);
Cart.sync(true);
User.belongsTo(BrancheModel, {
  as: "default_store_detail",
  foreignKey: "default_store"
});
Cart.belongsTo(User, {
  as: "user_info",
  foreignKey: "user_id"
});
Cart.belongsTo(UserProducts, {
  as: "product_info",
  foreignKey: "product_id"
});
Cart.belongsTo(ModifiersModel, {
  as: "required_modifier_detail",
  foreignKey: "required_modifiers"
});
Cart.belongsTo(ModifiersModel, {
  as: "optional_modifier_detail",
  foreignKey: "optional_modifiers"
});
Cart.belongsTo(SyraEvents, {
  as: "event_info",
  foreignKey: "event_id"
});
UserProducts.hasMany(Cart, {
  as: "cart_info",
  foreignKey: "product_id"
});
module.exports.UserModel = User;
module.exports.UserCreditCards = UserCreditCards;
module.exports.MyCartModel = Cart;

var UserOrders =
/*#__PURE__*/
function (_Model4) {
  _inherits(UserOrders, _Model4);

  function UserOrders() {
    _classCallCheck(this, UserOrders);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserOrders).apply(this, arguments));
  }

  return UserOrders;
}(Model);

UserOrders.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  date_of_order: {
    type: DataTypes.DATE,
    allowNull: false
  },
  ordered_hour: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("date_of_order")) {
        return moment(this.getDataValue("date_of_order")).format("hh:mm a");
      }
    }
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  store_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  barista_delivers_order: {
    type: DataTypes.STRING,
    allowNull: true
  },
  order_data: {
    type: DataTypes.TEXT,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("order_data")) {
        return JSON.parse(this.getDataValue("order_data"));
      } else {
        return [];
      }
    }
  },
  total_price: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  products: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  card_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  txn_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_beans_applied: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bean_applied: {
    type: DataTypes.STRING,
    allowNull: true
  },
  remaining_to_pay: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bean_generated: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_claiming_gift: {
    type: DataTypes.STRING,
    allowNull: true
  },
  price_data: {
    type: DataTypes.TEXT,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("price_data")) {
        return JSON.parse(this.getDataValue("price_data"));
      } else {
        return [];
      }
    }
  },
  total_price_with_out_tax: {
    type: DataTypes.STRING,
    allowNull: true
  },
  tax_amount: {
    type: DataTypes.STRING,
    allowNull: true
  },
  order_status: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "pending"
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  checkout_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  proceedToPayOnline: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("total_price")) {
        return Number(this.getDataValue("total_price")) > 0 && (!this.getDataValue('is_beans_applied') || !this.getDataValue('is_claiming_gift'));
      }
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
UserOrders.belongsTo(BrancheModel, {
  as: "branch_info",
  foreignKey: "store_id"
});

var UserorderedProducts =
/*#__PURE__*/
function (_Model5) {
  _inherits(UserorderedProducts, _Model5);

  function UserorderedProducts() {
    _classCallCheck(this, UserorderedProducts);

    return _possibleConstructorReturn(this, _getPrototypeOf(UserorderedProducts).apply(this, arguments));
  }

  return UserorderedProducts;
}(Model);

UserorderedProducts.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  date_of_order: {
    type: DataTypes.DATE,
    allowNull: true
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UserProductId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  required_modifier_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  required_modifier_iva: {
    type: DataTypes.STRING,
    allowNull: true
  },
  optional_modifier_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  optional_modifier_iva: {
    type: DataTypes.STRING,
    allowNull: true
  },
  grind_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  store_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  quantity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  product_iva: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  total_price: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  total_price_with_out_tax: {
    type: DataTypes.STRING,
    allowNull: true
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
UserorderedProducts.belongsTo(UserOrders, {
  as: "order_info",
  foreignKey: "order_id"
});
UserorderedProducts.belongsTo(UserProducts, {
  as: "product_info",
  foreignKey: "UserProductId"
});
UserProducts.belongsTo(UserCategories, {
  as: "category_info",
  foreignKey: "category"
});
UserOrders.belongsToMany(UserProducts, {
  as: "ordered_products",
  foreignKey: "order_id",
  through: "UserorderedProducts"
});

var AppliedBeans =
/*#__PURE__*/
function (_Model6) {
  _inherits(AppliedBeans, _Model6);

  function AppliedBeans() {
    _classCallCheck(this, AppliedBeans);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppliedBeans).apply(this, arguments));
  }

  return AppliedBeans;
}(Model);

AppliedBeans.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  beans_used: {
    type: DataTypes.STRING,
    allowNull: false
  },
  beans_genrated: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_deleted: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
AppliedBeans.sync(true);
UserorderedProducts.sync(true);
UserOrders.sync(true); // AppliedBeans.sync({force : true})
// UserorderedProducts.sync({force : true})
// UserOrders.sync({force : true})

module.exports.AppliedBeans = AppliedBeans;
module.exports.UserorderedProducts = UserorderedProducts;
module.exports.UserOrdersModel = UserOrders;