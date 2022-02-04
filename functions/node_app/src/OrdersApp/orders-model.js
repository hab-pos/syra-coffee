const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { BrancheModel } = require("../Branch-app/Branch-model");
const { BaristaModel } = require("../BaristaApp/Barista-model");
const { DiscountModel, IVAModel } = require("../SetupApp/setup-model")
const { productsModel } = require("../ProductApp/product-model")
const { CategoryModel } = require("../Category_app/category-model")
const { sequelize } = require('../db');
const moment = require('moment');
const { constants } = require('../../Utils/constants');
const { UserModel } = require("../User_App/User-model");

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//Orders Model
class Orders extends Model { }

Orders.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  date_of_order: { type: DataTypes.DATE, allowNull: false },
  reference: { type: DataTypes.STRING, allowNull: true },
  user_id: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
  barista_id: { type: DataTypes.STRING, allowNull: true },
  products_ids: {
    type: DataTypes.TEXT, allowNull: true,
    get() {
      if (this.getDataValue("products_ids")) {
        return this.getDataValue("products_ids").split(",")
      }
      else {
        return ""
      }
    }
  },
  products_data: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      if (this.getDataValue('products_data')) {
        return JSON.parse(this.getDataValue('products_data'))
      }
      else {
        return null
      }
    }
  },
  price_data: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      if (this.getDataValue('price_data')) {
        return JSON.parse(this.getDataValue('price_data'))
      }
      else {
        return null
      }
    }
  },
  branch_id: { type: DataTypes.STRING, allowNull: false },
  invoice_number: { type: DataTypes.STRING, allowNull: false },
  Payment_method: { type: DataTypes.STRING, allowNull: true },
  discount_id: {
    type: DataTypes.TEXT, allowNull: false,
    get() {
      if (this.getDataValue('discount_data')) {
        return this.getDataValue("discount_id").split(",")

      }
      else {
        return ""
      }
    }
  },
  discount_data: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      if (this.getDataValue('discount_data')) {
        return JSON.parse(this.getDataValue('discount_data'))
      }
      else {
        return null
      }
    }
  },
  order_status: { type: DataTypes.STRING, allowNull: false },
  total_price: { type: DataTypes.STRING, allowNull: false },
  total_price_with_out_tax: { type: DataTypes.STRING, allowNull: false },
  cancel_reason: { type: DataTypes.TEXT, allowNull: true },
  date_of_order_formated: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      if (this.getDataValue('date_of_order')) {
        return moment(this.getDataValue('date_of_order')).format("DD/MM/YYYY")
      }
      else {
        return null
      }
    }
  },
}, {
  sequelize,
  freezeTableName: true
})

Orders.belongsTo(BrancheModel, { as: "branch_info", foreignKey: "branch_id" })
Orders.belongsTo(BaristaModel, { as: "barista_info", foreignKey: "barista_id" })
Orders.belongsTo(UserModel, { as: "user_info", foreignKey: "user_id" })
Orders.sync(true)
module.exports.OrdersModel = Orders

//Applied Discounts Model
class AppliedDiscounts extends Model { }

AppliedDiscounts.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  order_id: { type: DataTypes.STRING, allowNull: false },
  discount_id: { type: DataTypes.STRING, allowNull: false },
  tota_discount_amount: { type: DataTypes.STRING, allowNull: false,
    get(){
      return Math.abs(Number(this.getDataValue('tota_discount_amount')))
    }
  },
  barista_id: { type: DataTypes.STRING, allowNull: false },
},
  {
    sequelize,
    freezeTableName: true
  })

AppliedDiscounts.belongsTo(Orders, { as: "order_info", foreignKey: "order_id" })
AppliedDiscounts.belongsTo(BaristaModel, { as: "barista_info", foreignKey: "barista_id" })
AppliedDiscounts.belongsTo(DiscountModel, { as: "discount_info", foreignKey: "discount_id" })


AppliedDiscounts.sync(true)
module.exports.AppliedDiscountsModel = AppliedDiscounts

//Ordered Products Model
class OrderedProducts extends Model { }

OrderedProducts.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  date: {
    type: DataTypes.STRING, allowNull: true,defaultValue : moment().format("DD/MM/YYYY")
    // get() {
    //   return moment(this.getDataValue("createdAt")).format("DD/MM/YYYY")
    // }
  },
  date_graph: {
    type: DataTypes.STRING, allowNull: true,defaultValue : moment().format("DD/MM")
    // get() {
    //   return moment(this.getDataValue("createdAt")).format("DD/MM")
    // }
  },
  hour_graph: {
    type: DataTypes.STRING, allowNull: true,defaultValue : moment().format("HH")
    // get() {
    //   return moment(this.getDataValue("createdAt")).format("HH")
    // }
  },
  order_id: { type: DataTypes.STRING, allowNull: false },
  product_id: { type: DataTypes.STRING, allowNull: false },
  category_id: { type: DataTypes.STRING, allowNull: false },
  iva_id: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  price: { type: DataTypes.STRING, allowNull: false },
  payment_method: { type: DataTypes.STRING, allowNull: false },
  branch_id: { type: DataTypes.STRING, allowNull: false },
  price_without_iva: {
    type: DataTypes.VIRTUAL, allowNull: true,
    get() {
      if(this.getDataValue('iva_info')){
        return (this.getDataValue('price') - ((this.getDataValue('price') * Number(this.getDataValue('iva_info').iva_percent)) / (100 + Number(this.getDataValue('iva_info').iva_percent))))   
      }
    }
  },
},
  {
    sequelize,
    freezeTableName: true
  })

OrderedProducts.belongsTo(Orders, { as: "order_info", foreignKey: "order_id" })
OrderedProducts.belongsTo(productsModel, { as: "product_info", foreignKey: "product_id" })
OrderedProducts.belongsTo(CategoryModel, { as: "category_info", foreignKey: "category_id" })
OrderedProducts.belongsTo(IVAModel, { as: "iva_info", foreignKey: "iva_id" })
OrderedProducts.belongsTo(BrancheModel, { as: "branch_info", foreignKey: "branch_id" })


OrderedProducts.sync(true)
module.exports.OrderedProductsModel = OrderedProducts

//In TransactionModel
class TransactionInModel extends Model { }

TransactionInModel.init({
  _id: { type: DataTypes.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.STRING, allowNull: false },
  date_of_transaction: {
    type: DataTypes.VIRTUAL, allowNull: true,
    get() {
      return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY")
    }
  },
  hour: {
    type: DataTypes.VIRTUAL, allowNull: true,
    get() {
      return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("HH:mm")
    }
  },

  date_graph: {
    type: DataTypes.VIRTUAL, allowNull: true,
    get() {
      return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM")
    }
  },
  hour_graph: {
    type: DataTypes.VIRTUAL, allowNull: true,
    get() {
      return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("HH")
    }
  },

  time_elapsed: { type: DataTypes.STRING, allowNull: false },
  barista_id: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  total_amount: { type: DataTypes.STRING, allowNull: false },
  branch_id: { type: DataTypes.STRING, allowNull: false },
  Payment_method: {
    type: DataTypes.STRING, allowNull: false
  }
},
  {
    sequelize,
    freezeTableName: true
  })

TransactionInModel.belongsTo(Orders, { as: "order_info", foreignKey: "order_id" })
TransactionInModel.belongsTo(BaristaModel, { as: "barista_info", foreignKey: "barista_id" })
TransactionInModel.belongsTo(BrancheModel, { as: "branch_info", foreignKey: "branch_id" })

TransactionInModel.sync(true)
module.exports.TransactionInModel = TransactionInModel


class CashFlow extends Model { }

CashFlow.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  open_time: { type: DataTypes.DATE, allowNull: false },
  open_balance: { type: DataTypes.STRING, allowNull: false },
  branch_id: { type: DataTypes.STRING, allowNull: false },
  today_income_cash: { type: DataTypes.STRING, allowNull: true },
  today_expense_cash: { type: DataTypes.STRING, allowNull: true },
  close_balance: { type: DataTypes.STRING, allowNull: true },
  close_time: { type: DataTypes.DATE, allowNull: true },
  barista_id: { type: DataTypes.STRING, allowNull: true },
},
  {
    sequelize,
    freezeTableName: true
  })


CashFlow.sync(true)
module.exports.CashFlowModel = CashFlow