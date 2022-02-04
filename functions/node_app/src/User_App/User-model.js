const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../db')
const moment = require('moment');
const { constants } = require('../../Utils/constants');
const { BrancheModel } = require("../Branch-app/Branch-model");
const { UserProducts } = require("../SHARAFA-USER APP/Products_app/products-model");
const { ModifiersModel } = require("../SHARAFA-USER APP/ModifiersApp/modifier-model");
const { UserCategories } = require("../SHARAFA-USER APP/Category_app/category-model");
const { SyraEvents } = require("../SHARAFA-USER APP/eventsApp/events-model");

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class User extends Model {

}

User.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  full_name: { type: DataTypes.VIRTUAL, allowNull: true,get(){
    return this.getDataValue("first_name") + " " + this.getDataValue("last_name")
  } },
  birth_day: { type: DataTypes.DATE, allowNull: false },
  birth_day_string: {
    type: DataTypes.VIRTUAL, get() {
      if (this.birth_day) {
        return moment(this.getDataValue('birth_day')).format("DD-MM-YYYY")
      }
    }
  },
  is_birthday_today: {
    type: DataTypes.VIRTUAL, get() {
      if (this.birth_day) {
        return moment(this.getDataValue('birth_day')).format("DD-MM-YYYY") == moment().format("DD-MM-YYYY")
      }
      return false
    }
  },
  email: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  default_store: { type: DataTypes.STRING, allowNull: false, defaultValue: "" },
  is_logged_in: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  color: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  beansEarnerd: {
    type: DataTypes.STRING, allowNull: true, defaultValue: 0, get() {
      return Number(this.getDataValue("beansEarnerd")) <= 0 ? "00" : this.getDataValue("beansEarnerd")
    }
  },
  beansSpent: { type: DataTypes.STRING, allowNull: true, defaultValue: 0 },
  user_reference_number: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  freezeTableName: true
})


class UserCreditCards extends Model {

}

UserCreditCards.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.STRING, allowNull: false },
  holder_name: { type: DataTypes.STRING, allowNull: false },
  card_number: { type: DataTypes.STRING, allowNull: false },
  expiry_date: { type: DataTypes.STRING, allowNull: false },
  is_default: { type: DataTypes.INTEGER, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  tokenUser: { type: DataTypes.STRING, allowNull: true },
  idUser: { type: DataTypes.STRING, allowNull: false },
  cardHash: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  freezeTableName: true
})


class Cart extends Model {

}
Cart.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  user_id: { type: DataTypes.STRING, allowNull: false },
  product_id: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.STRING, allowNull: false },
  required_modifiers: {
    type: DataTypes.STRING, allowNull: true,
    get() {
      return this.getDataValue('required_modifiers') == null ? "" : this.getDataValue('required_modifiers')
    }
  },
  optional_modifiers: {
    type: DataTypes.STRING, allowNull: true,
    get() {
      return this.getDataValue('optional_modifiers') == null ? "" : this.getDataValue('optional_modifiers')
    }
  },
  grains: {
    type: DataTypes.STRING, allowNull: true,
    get() {
      return this.getDataValue('grains') == null ? "" : this.getDataValue('grains')
    }
  },
  is_claiming_gift: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  order_status: { type: DataTypes.STRING, allowNull: true, defaultValue: "pending" },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  is_claim_wallet: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  wallet_id: { type: DataTypes.STRING, allowNull: true },
  event_id: { type: DataTypes.STRING, allowNull: true },
  wallet_count: { type: DataTypes.INTEGER, allowNull: true },
  is_reorder: {
    type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false,
    get() {
      return this.getDataValue("is_reorder") != null ? this.getDataValue("is_reorder") : false
    }
  }
}, {
  sequelize,
  freezeTableName: true
})

User.sync(true)
UserCreditCards.sync(true)
Cart.sync(true)

User.belongsTo(BrancheModel, { as: "default_store_detail", foreignKey: "default_store" })
Cart.belongsTo(User, { as: "user_info", foreignKey: "user_id" })
Cart.belongsTo(UserProducts, { as: "product_info", foreignKey: "product_id" })
Cart.belongsTo(ModifiersModel, { as: "required_modifier_detail", foreignKey: "required_modifiers" })
Cart.belongsTo(ModifiersModel, { as: "optional_modifier_detail", foreignKey: "optional_modifiers" })
Cart.belongsTo(SyraEvents, { as: "event_info", foreignKey: "event_id" })
UserProducts.hasMany(Cart, { as: "cart_info", foreignKey: "product_id" })

module.exports.UserModel = User
module.exports.UserCreditCards = UserCreditCards
module.exports.MyCartModel = Cart

class UserOrders extends Model {

}
UserOrders.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  date_of_order: { type: DataTypes.DATE, allowNull: false },
  ordered_hour: {
    type: DataTypes.VIRTUAL, allowNull: true, get() {
      if (this.getDataValue("date_of_order")) {
        return moment(this.getDataValue("date_of_order")).format("hh:mm a")
      }
    }
  },
  user_id: { type: DataTypes.STRING, allowNull: false },
  store_id: { type: DataTypes.STRING, allowNull: false },
  barista_delivers_order: { type: DataTypes.STRING, allowNull: true },
  order_data: {
    type: DataTypes.TEXT('long'), allowNull: true, get() {
      if (this.getDataValue("order_data")) {
        return JSON.parse(this.getDataValue("order_data"))
      }
      else {
        return []
      }
    }
  },
  total_price: { type: DataTypes.STRING, allowNull: true },
  Payment_method: { type: DataTypes.STRING, allowNull: true },
  products: { type: DataTypes.TEXT, allowNull: true },
  card_id: { type: DataTypes.STRING, allowNull: true },
  txn_id: { type: DataTypes.STRING, allowNull: true },
  is_beans_applied: { type: DataTypes.STRING, allowNull: true },
  bean_applied: { type: DataTypes.STRING, allowNull: true },
  remaining_to_pay: { type: DataTypes.STRING, allowNull: true },
  bean_generated: { type: DataTypes.STRING, allowNull: true },
  is_claiming_gift: { type: DataTypes.STRING, allowNull: true },
  price_data: {
    type: DataTypes.TEXT, allowNull: true, get() {
      if (this.getDataValue("price_data")) {
        return JSON.parse(this.getDataValue("price_data"))
      }
      else {
        return []
      }
    }
  },
  total_price_with_out_tax: { type: DataTypes.STRING, allowNull: true },
  tax_amount: { type: DataTypes.STRING, allowNull: true },
  order_status: { type: DataTypes.STRING, allowNull: true, defaultValue: "pending" },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  checkout_method: { type: DataTypes.STRING, allowNull: true },
  proceedToPayOnline: {
    type: DataTypes.VIRTUAL, allowNull: true, get() {
      if (this.getDataValue("total_price")) {
        return Number(this.getDataValue("total_price")) > 0 && (!this.getDataValue('is_beans_applied') || !this.getDataValue('is_claiming_gift'))
      }
    }
  }
}, {
  sequelize,
  freezeTableName: true
})
UserOrders.belongsTo(BrancheModel, { as: "branch_info", foreignKey: "store_id" })

class UserorderedProducts extends Model { }
UserorderedProducts.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  date_of_order: { type: DataTypes.DATE, allowNull: true },
  order_id: { type: DataTypes.STRING, allowNull: true },
  UserProductId: { type: DataTypes.STRING, allowNull: true },
  category_id: { type: DataTypes.STRING, allowNull: true },
  required_modifier_id: { type: DataTypes.STRING, allowNull: true },
  required_modifier_iva: { type: DataTypes.STRING, allowNull: true },
  optional_modifier_id: { type: DataTypes.STRING, allowNull: true },
  optional_modifier_iva: { type: DataTypes.STRING, allowNull: true },
  grind_id: { type: DataTypes.STRING, allowNull: true },
  user_id: { type: DataTypes.STRING, allowNull: true },
  store_id: { type: DataTypes.STRING, allowNull: true },
  quantity: { type: DataTypes.STRING, allowNull: true },
  product_iva: { type: DataTypes.TEXT, allowNull: true },
  total_price: { type: DataTypes.STRING, allowNull: true },
  Payment_method: { type: DataTypes.STRING, allowNull: true },
  total_price_with_out_tax: { type: DataTypes.STRING, allowNull: true },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
}, {
  sequelize,
  freezeTableName: true
})
UserorderedProducts.belongsTo(UserOrders, { as: "order_info", foreignKey: "order_id" })
UserorderedProducts.belongsTo(ModifiersModel, { as: "required_modifier_detail", foreignKey: "required_modifier_id" })
UserorderedProducts.belongsTo(ModifiersModel, { as: "optional_modifier_detail", foreignKey: "optional_modifier_id" })
UserorderedProducts.belongsTo(UserProducts, { as: "product_info", foreignKey: "UserProductId" })
UserProducts.belongsTo(UserCategories, { as: "category_info", foreignKey: "category" })
UserOrders.belongsToMany(UserProducts, { as: "ordered_products", foreignKey: "order_id", through: "UserorderedProducts" })
UserOrders.belongsTo(User, { as: "user_info", foreignKey: "user_id" })

class AppliedBeans extends Model { }

AppliedBeans.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  order_id: { type: DataTypes.STRING, allowNull: false },
  beans_used: { type: DataTypes.STRING, allowNull: false },
  beans_genrated: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
}, {
  sequelize,
  freezeTableName: true
})
AppliedBeans.sync(true)
UserorderedProducts.sync(true)
UserOrders.sync(true)

// AppliedBeans.sync({force : true})
// UserorderedProducts.sync({force : true})
// UserOrders.sync({force : true})

module.exports.AppliedBeans = AppliedBeans
module.exports.UserorderedProducts = UserorderedProducts
module.exports.UserOrdersModel = UserOrders
