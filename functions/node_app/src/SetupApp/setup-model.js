const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../db')

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

//IVA MODEL
class IVA extends Model {
}

IVA.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  iva_percent: {
    type: DataTypes.STRING, allowNull: false,
    get() {
      return Number(this.getDataValue("iva_percent")).toFixed(2)
    }
  },
  iva_percent_withSymbol: {
    type: DataTypes.VIRTUAL, allowNull: false,
    get() {
      return Number(this.getDataValue("iva_percent")).toFixed(2) + "%"
    }
  },
  color: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  created_by: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  freezeTableName: true
})


//EXPENSE MODEL
class Expense extends Model { }

Expense.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  expense_name: { type: DataTypes.STRING, allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  sequelize,
  freezeTableName: true
})


//Discount MODEL
class Discount extends Model {
}

Discount.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  discount_name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.STRING, allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: false },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  color: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
}, {
  sequelize,
  freezeTableName: true
})

Expense.sync(true)
module.exports.ExpenseModel = Expense
IVA.sync(true)
module.exports.IVAModel = IVA
Discount.sync(true)
module.exports.DiscountModel = Discount