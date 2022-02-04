const { get } = require("http");
const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { BrancheModel } = require("../Branch-app/Branch-model");
const { sequelize } = require('../db')
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

class Barista extends Model {

}

Barista.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  barista_name: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: false },
  is_logged_in: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: false },
  login_time: {
    type: DataTypes.VIRTUAL, allowNull: true,
    get() {
      return moment(this.getDataValue("updatedAt")).utc().tz(constants.TIME_ZONE).format('hh : mm A');
    }
  },
  color: {
    type: DataTypes.STRING, allowNull: false},
}, {
  sequelize,
  freezeTableName: true
})
Barista.sync(true)
module.exports.BaristaModel = Barista



//clockin_table class
class clockin extends Model { }

clockin.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  branch_id: { type: DataTypes.STRING, allowNull: false },
  barista_id: { type: DataTypes.STRING, allowNull: false },
  time_slot: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false, defaultValue: "checked_in" },
  is_active: { type: DataTypes.STRING, allowNull: false, defaultValue: false },
  is_deleted: { type: DataTypes.STRING, allowNull: false, defaultValue: false },
  loginTime: { type: DataTypes.DATE, allowNull: false },
  logoutTime: { type: DataTypes.DATE, allowNull: true },
}, {
  sequelize,
  freezeTableName: true
})
clockin.belongsTo(BrancheModel, { as: "branch_info", foreignKey: "branch_id" })
clockin.belongsTo(Barista, { as: "barista_info", foreignKey: "barista_id" })
clockin.sync(true)
module.exports.ClockinModel = clockin