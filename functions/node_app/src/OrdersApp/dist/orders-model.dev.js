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
    DiscountModel = _require4.DiscountModel,
    IVAModel = _require4.IVAModel;

var _require5 = require("../ProductApp/product-model"),
    productsModel = _require5.productsModel;

var _require6 = require("../Category_app/category-model"),
    CategoryModel = _require6.CategoryModel;

var _require7 = require('../db'),
    sequelize = _require7.sequelize;

var moment = require('moment');

var _require8 = require('../../Utils/constants'),
    constants = _require8.constants;

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
}); //Orders Model

var Orders =
/*#__PURE__*/
function (_Model) {
  _inherits(Orders, _Model);

  function Orders() {
    _classCallCheck(this, Orders);

    return _possibleConstructorReturn(this, _getPrototypeOf(Orders).apply(this, arguments));
  }

  return Orders;
}(Model);

Orders.init({
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
  reference: {
    type: DataTypes.STRING,
    allowNull: true
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  barista_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  products_ids: {
    type: DataTypes.TEXT,
    allowNull: true,
    get: function get() {
      if (this.getDataValue("products_ids")) {
        return this.getDataValue("products_ids").split(",");
      } else {
        return "";
      }
    }
  },
  products_data: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('products_data')) {
        return JSON.parse(this.getDataValue('products_data'));
      } else {
        return null;
      }
    }
  },
  price_data: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('price_data')) {
        return JSON.parse(this.getDataValue('price_data'));
      } else {
        return null;
      }
    }
  },
  branch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  invoice_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Payment_method: {
    type: DataTypes.STRING,
    allowNull: true
  },
  discount_id: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('discount_data')) {
        return this.getDataValue("discount_id").split(",");
      } else {
        return "";
      }
    }
  },
  discount_data: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      if (this.getDataValue('discount_data')) {
        return JSON.parse(this.getDataValue('discount_data'));
      } else {
        return null;
      }
    }
  },
  order_status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_price_with_out_tax: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cancel_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date_of_order_formated: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('date_of_order')) {
        return moment(this.getDataValue('date_of_order')).format("DD/MM/YYYY");
      } else {
        return null;
      }
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
Orders.belongsTo(BrancheModel, {
  as: "branch_info",
  foreignKey: "branch_id"
});
Orders.belongsTo(BaristaModel, {
  as: "barista_info",
  foreignKey: "barista_id"
});
Orders.sync(true);
module.exports.OrdersModel = Orders; //Applied Discounts Model

var AppliedDiscounts =
/*#__PURE__*/
function (_Model2) {
  _inherits(AppliedDiscounts, _Model2);

  function AppliedDiscounts() {
    _classCallCheck(this, AppliedDiscounts);

    return _possibleConstructorReturn(this, _getPrototypeOf(AppliedDiscounts).apply(this, arguments));
  }

  return AppliedDiscounts;
}(Model);

AppliedDiscounts.init({
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
  discount_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  tota_discount_amount: {
    type: DataTypes.STRING,
    allowNull: false,
    get: function get() {
      return Math.abs(Number(this.getDataValue('tota_discount_amount')));
    }
  },
  barista_id: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
AppliedDiscounts.belongsTo(Orders, {
  as: "order_info",
  foreignKey: "order_id"
});
AppliedDiscounts.belongsTo(BaristaModel, {
  as: "barista_info",
  foreignKey: "barista_id"
});
AppliedDiscounts.belongsTo(DiscountModel, {
  as: "discount_info",
  foreignKey: "discount_id"
});
AppliedDiscounts.sync(true);
module.exports.AppliedDiscountsModel = AppliedDiscounts; //Ordered Products Model

var OrderedProducts =
/*#__PURE__*/
function (_Model3) {
  _inherits(OrderedProducts, _Model3);

  function OrderedProducts() {
    _classCallCheck(this, OrderedProducts);

    return _possibleConstructorReturn(this, _getPrototypeOf(OrderedProducts).apply(this, arguments));
  }

  return OrderedProducts;
}(Model);

OrderedProducts.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  date: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: moment().format("DD/MM/YYYY") // get() {
    //   return moment(this.getDataValue("createdAt")).format("DD/MM/YYYY")
    // }

  },
  date_graph: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: moment().format("DD/MM") // get() {
    //   return moment(this.getDataValue("createdAt")).format("DD/MM")
    // }

  },
  hour_graph: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: moment().format("HH") // get() {
    //   return moment(this.getDataValue("createdAt")).format("HH")
    // }

  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  product_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  iva_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  },
  branch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price_without_iva: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      if (this.getDataValue('iva_info')) {
        return this.getDataValue('price') - this.getDataValue('price') * Number(this.getDataValue('iva_info').iva_percent) / (100 + Number(this.getDataValue('iva_info').iva_percent));
      }
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
OrderedProducts.belongsTo(Orders, {
  as: "order_info",
  foreignKey: "order_id"
});
OrderedProducts.belongsTo(productsModel, {
  as: "product_info",
  foreignKey: "product_id"
});
OrderedProducts.belongsTo(CategoryModel, {
  as: "category_info",
  foreignKey: "category_id"
});
OrderedProducts.belongsTo(IVAModel, {
  as: "iva_info",
  foreignKey: "iva_id"
});
OrderedProducts.belongsTo(BrancheModel, {
  as: "branch_info",
  foreignKey: "branch_id"
});
OrderedProducts.sync(true);
module.exports.OrderedProductsModel = OrderedProducts; //In TransactionModel

var TransactionInModel =
/*#__PURE__*/
function (_Model4) {
  _inherits(TransactionInModel, _Model4);

  function TransactionInModel() {
    _classCallCheck(this, TransactionInModel);

    return _possibleConstructorReturn(this, _getPrototypeOf(TransactionInModel).apply(this, arguments));
  }

  return TransactionInModel;
}(Model);

TransactionInModel.init({
  _id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  order_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date_of_transaction: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY");
    }
  },
  hour: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("HH:mm");
    }
  },
  date_graph: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM");
    }
  },
  hour_graph: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("HH");
    }
  },
  time_elapsed: {
    type: DataTypes.STRING,
    allowNull: false
  },
  barista_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  total_amount: {
    type: DataTypes.STRING,
    allowNull: false
  },
  branch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  Payment_method: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
TransactionInModel.belongsTo(Orders, {
  as: "order_info",
  foreignKey: "order_id"
});
TransactionInModel.belongsTo(BaristaModel, {
  as: "barista_info",
  foreignKey: "barista_id"
});
TransactionInModel.belongsTo(BrancheModel, {
  as: "branch_info",
  foreignKey: "branch_id"
});
TransactionInModel.sync(true);
module.exports.TransactionInModel = TransactionInModel;

var CashFlow =
/*#__PURE__*/
function (_Model5) {
  _inherits(CashFlow, _Model5);

  function CashFlow() {
    _classCallCheck(this, CashFlow);

    return _possibleConstructorReturn(this, _getPrototypeOf(CashFlow).apply(this, arguments));
  }

  return CashFlow;
}(Model);

CashFlow.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  open_time: {
    type: DataTypes.DATE,
    allowNull: false
  },
  open_balance: {
    type: DataTypes.STRING,
    allowNull: false
  },
  branch_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  today_income_cash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  today_expense_cash: {
    type: DataTypes.STRING,
    allowNull: true
  },
  close_balance: {
    type: DataTypes.STRING,
    allowNull: true
  },
  close_time: {
    type: DataTypes.DATE,
    allowNull: true
  },
  barista_id: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
CashFlow.sync(true);
module.exports.CashFlowModel = CashFlow;