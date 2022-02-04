const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../../db');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class Modifiers extends Model { }
Modifiers.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  modifier_name: { type: DataTypes.STRING, allowNull: false },
  price :  { type: DataTypes.STRING, allowNull: false,get(){
    return Number(this.getDataValue('price')).toFixed(2)
  } },  
  iva: { type: DataTypes.STRING, allowNull: false },
  iva_value : {type: DataTypes.STRING, allowNull: false},
  beans_value: { type: DataTypes.STRING, allowNull: false },
  is_Active: { type: DataTypes.BOOLEAN, allowNull: false,defaultValue : true },
  is_deleted : {type : DataTypes.BOOLEAN, allowNull : false, defaultValue : false}, 
  price_without_tax : { type: DataTypes.VIRTUAL, allowNull: true,
    get(){
      if(this.getDataValue('iva_value')){
        return Number(this.getDataValue('price')) - (Number(this.getDataValue('price')) * Number(this.getDataValue('iva_value').replace("%", "")) / 100)
        // return (Number(this.getDataValue('price')) - (Number(this.getDataValue('price')) * Number(this.getDataValue('iva_value').replace("%", "")) / 100)).toFixed(2)
      }
    } 
  },
}, {
  sequelize,
  freezeTableName: true
})
Modifiers.sync(true)
module.exports.ModifiersModel = Modifiers