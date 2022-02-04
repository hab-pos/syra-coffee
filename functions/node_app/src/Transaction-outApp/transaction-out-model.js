const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../db')
const {IVAModel} = require("../SetupApp/setup-model")
const {BaristaModel} = require("../BaristaApp/Barista-model")
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

  //Discount MODEL
class TransactionOut extends Model { }

TransactionOut.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  date_of_transaction : {type: DataTypes.DATE, allowNull: false },
  date_of_transaction_formated: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      if (this.getDataValue('date_of_transaction')) {
        if(this.getDataValue("type") == "expense"){
          return moment(this.getDataValue('date_of_transaction')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY")
        }
        else{
          return moment(this.getDataValue('date_of_transaction')).utc().tz(constants.TIME_ZONE).format("DD/MM/YYYY HH:mm")
        }
      }
      else {
        return null
      }
    }
  },
  reason :  {type: DataTypes.STRING, allowNull: false },
  type :  {type: DataTypes.STRING, allowNull: false },
  barista_id: { type: DataTypes.STRING, allowNull: true },
  iva_id : {type: DataTypes.STRING, allowNull: true },
  total_amount : {type: DataTypes.STRING, allowNull: false },
  mode_of_payment : {type: DataTypes.STRING, allowNull: false,defaultValue : "CASH" },
  invoice_number : {type: DataTypes.STRING, allowNull: false,defaultValue : "-" },
  is_deleted : {type: DataTypes.BOOLEAN, allowNull: false,defaultValue : false },
  branch_id : {type: DataTypes.STRING, allowNull: false,defaultValue : false },
  expense_id : {type: DataTypes.STRING, allowNull: true,defaultValue : null}
}, {
  sequelize,
  freezeTableName: true
})

TransactionOut.belongsTo(IVAModel, { as: "iva_info", foreignKey: "iva_id"})
TransactionOut.belongsTo(BaristaModel, { as: "barista_info", foreignKey: "barista_id"})

TransactionOut.sync(true)
module.exports.TransactionOutModel = TransactionOut