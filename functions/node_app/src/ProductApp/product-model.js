const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../db');
const {IVAModel} = require("../SetupApp/setup-model")
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class Products extends Model { }

Products.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  product_name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.STRING, allowNull: false },
  price_with_iva: { type: DataTypes.STRING, allowNull: false},
  iva : {type : DataTypes.STRING, allowNull : false},
  beanValue : {type : DataTypes.STRING, allowNull : true},
  categories: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      if(this.getDataValue('categories'))
      {
        return this.getDataValue('categories').split(',')
      }
      else{
        return ""
      }
    }
  },
  color: { type: DataTypes.STRING, allowNull: false },
  available_branches: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      if(this.getDataValue('available_branches'))
      {
        return this.getDataValue('available_branches').split(',')
      }
      else{
        return ""
      }
    }
  },
  is_deleted : {type : DataTypes.BOOLEAN, allowNull : false, defaultValue : false},
  is_Active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue : true},
  created_by: { type: DataTypes.STRING, allowNull: false },
  beans_value: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
     if(this.getDataValue('beanValue')){
        return this.getDataValue('beanValue')
      }
      else{
        return (Number(this.getDataValue('price')) * 100).toFixed(2)
      }
    }
  },
  order : {type : DataTypes.TEXT,allowNull : false,
    get() {
      if (this.getDataValue('order')) {
        return JSON.parse(this.getDataValue('order'))
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

Products.belongsTo(IVAModel, { as: "iva_info", foreignKey: "iva" })
Products.sync(true)
module.exports.productsModel = Products