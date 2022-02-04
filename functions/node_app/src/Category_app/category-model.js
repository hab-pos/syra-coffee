const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../db');

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class Categories extends Model { }

Categories.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  category_name: { type: DataTypes.STRING, allowNull: false },
  color: { type: DataTypes.STRING, allowNull: false },
  is_deleted : {type : DataTypes.BOOLEAN, allowNull : false, defaultValue : false},
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
  order : {type : DataTypes.TEXT,allowNull : false,
    get() {
      if (this.getDataValue('order')) {
        return JSON.parse(this.getDataValue('order'))
      }
      else {
        return null
      }
    }
  },  is_Active: { type: DataTypes.BOOLEAN, allowNull: false },
  created_by: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  freezeTableName: true
})
Categories.sync(true)
module.exports.CategoryModel = Categories