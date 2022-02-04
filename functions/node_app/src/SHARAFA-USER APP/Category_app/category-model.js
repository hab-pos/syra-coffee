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

class UserCategories extends Model { }

UserCategories.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  category_name: { type: DataTypes.STRING, allowNull: false },
  image_name :  { type: DataTypes.STRING, allowNull: false },  
  image_url: { type: DataTypes.STRING, allowNull: false },
  is_Active: { type: DataTypes.BOOLEAN, allowNull: false,defaultValue : true },
  order : {type : DataTypes.INTEGER,allowNull : false,defaultValue : 0},
  is_deleted : {type : DataTypes.BOOLEAN, allowNull : false, defaultValue : false}, 
}, {
  sequelize,
  freezeTableName: true
})
UserCategories.sync(true)
module.exports.UserCategories = UserCategories