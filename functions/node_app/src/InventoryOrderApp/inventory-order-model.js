const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { BrancheModel } = require("../Branch-app/Branch-model");
const { BaristaModel } = require("../BaristaApp/Barista-model");
const { sequelize } = require('../db');
const moment = require('moment');
const { constants } = require('../../Utils/constants')

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class InventoryOrder extends Model { }

InventoryOrder.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  order_date: { type: DataTypes.DATE, allowNull: false },
  ordered_branch: { type: DataTypes.STRING, allowNull: false },
  received_by: { type: DataTypes.STRING, allowNull: true },
  ordered_by: { type: DataTypes.STRING, allowNull: true },
  delivery_date: { type: DataTypes.DATE, allowNull: true },
  number_of_products: { type: DataTypes.INTEGER, allowNull: false, get(){
    if (this.getDataValue('ordered_items')) {
      return JSON.parse(this.getDataValue('ordered_items')).length
    }
    else {
      return this.getDataValue('number_of_products')
    }
  } },
  status: { type: DataTypes.STRING, allowNull: false },
  comment_by_barista: { type: DataTypes.TEXT, allowNull: true },
  admin_msg: { type: DataTypes.TEXT, allowNull: true },
  ordered_items: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      if (this.getDataValue('ordered_items')) {
        return JSON.parse(this.getDataValue('ordered_items'))
      }
      else {
        return null
      }
    }
  },
  created_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      if (this.getDataValue('createdAt')) {
        return moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY - HH:mm")
      }
      else {
        return null
      }
    }
  },

  delivered_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      if (this.getDataValue('delivery_date')) {
        return moment(this.getDataValue('delivery_date')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY")
      }
      else {
        return null
      }
    }
  },

  price_details: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {

      if (this.getDataValue('ordered_items')) {
        let ordered_items = JSON.parse(this.getDataValue('ordered_items'))

        let price_details = new Object()
        let price_list = Array()
        let totalPrice = 0
        ordered_items.forEach(ordered_item => {
          totalPrice += ordered_item.qty * Number(ordered_item.price)
          let item = { id: ordered_item.inventory_id, price: ordered_item.qty * Number(ordered_item.price) }
          console.log(item)

          price_list.push(item)
        });
        price_details.price_list = price_list
        price_details.totalPrice = totalPrice

        return price_details
      }
      else {
        return null
      }
    }
  },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  sequelize,
  freezeTableName: true
})

InventoryOrder.belongsTo(BrancheModel, { as: "branch_info", foreignKey: "ordered_branch" })
InventoryOrder.belongsTo(BaristaModel, { as: "ordered_by_details", foreignKey: "ordered_by" })
InventoryOrder.belongsTo(BaristaModel, { as: "recieved_by_details", foreignKey: "received_by" })

InventoryOrder.sync(true)
module.exports.InventoryOrderModel = InventoryOrder