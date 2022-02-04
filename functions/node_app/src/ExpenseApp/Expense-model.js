const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { BrancheModel } = require("../Branch-app/Branch-model");
const { BaristaModel } = require("../BaristaApp/Barista-model");
const {IVAModel,ExpenseModel} = require("../SetupApp/setup-model")
const { sequelize } = require('../db');
const moment = require('moment');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class ExpenseSchema extends Model { }

ExpenseSchema.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  expense_date: { type: DataTypes.DATE, allowNull: false },
  motive: { type: DataTypes.STRING, allowNull: false },
  iva_id : {type : DataTypes.STRING, allowNull : true},
  price : {type : DataTypes.STRING, allowNull : false,
  get(){
    return Number(this.getDataValue('price')).toFixed(2)
  }
  },
  payment : {type: DataTypes.STRING, allowNull: true,
    get(){
      return Number(this.getDataValue('payment')).toFixed(2)
    }}, 
  branch_id : {type: DataTypes.STRING, allowNull: false},
  barista_id : {type: DataTypes.STRING, allowNull: false},
  created_date: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      if(this.getDataValue('expense_date'))
      {
        return (moment(this.getDataValue('expense_date')).format("DD/MM/YYYY"))
      }
      else{
        return null
      }
    }
  },
  is_deleted : {type : DataTypes.BOOLEAN, allowNull : false, defaultValue : false},
}, {
  sequelize,
  freezeTableName: true
})

ExpenseSchema.belongsTo(BrancheModel, { as: "branch_info", foreignKey: "branch_id"})
ExpenseSchema.belongsTo(BaristaModel, { as: "barista_info", foreignKey: "barista_id"})
ExpenseSchema.belongsTo(IVAModel, { as: "iva_info", foreignKey: "iva_id"})
ExpenseSchema.belongsTo(ExpenseModel, { as: "expense_info", foreignKey: "motive"})
ExpenseSchema.sync(true)
module.exports.ExpenseTableModel = ExpenseSchema