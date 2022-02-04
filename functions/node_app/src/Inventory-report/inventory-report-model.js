const { Model, DataTypes, UUIDV4 } = require("sequelize");
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

class InventoryReport extends Model { }

InventoryReport.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  date_of_week: { type: DataTypes.DATE, allowNull: false },
  branch_id : { type: DataTypes.STRING, allowNull: false },
  weekly_shipped: { type: DataTypes.DOUBLE, allowNull: false },
  quantity_at_week_start: { type: DataTypes.DOUBLE, allowNull: false },
  final_remaining: { type: DataTypes.DOUBLE, allowNull: false },
  total_consumption: { type: DataTypes.DOUBLE, allowNull: false,
    get(){
      if(Number(this.getDataValue('total_consumption')) != null){
        return Number(this.getDataValue('total_consumption')).toFixed(2)
      }
      else{
        return -1
      }
    }
  },
  created_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      if (this.getDataValue('date_of_week')) {
        if(this.getDataValue("final_remaining") != -1){
          return moment(this.getDataValue('date_of_week')).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - " + moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm")
        }
        else{
          return moment(this.getDataValue('date_of_week')).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - "
        }
      }
      else {
        return null
      }
    }
  },
  duraion: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      if (this.getDataValue('date_of_week')) {
        if(this.getDataValue("final_remaining") != -1){
          return moment(this.getDataValue('date_of_week')).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - " + moment(this.getDataValue('createdAt')).utc().tz(constants.TIME_ZONE).format("DD/MM")
        }
        else{
          return moment(this.getDataValue('date_of_week')).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - "
        }
      }
      else {
        return null
      }
    }
  },
  total_stock: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      if(this.getDataValue('quantity_at_week_start')){
        return this.getDataValue('quantity_at_week_start').toFixed(2)
      }
    }
  },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  sequelize,
  freezeTableName: true
})

InventoryReport.sync(true)
module.exports.InventoryReportModel = InventoryReport