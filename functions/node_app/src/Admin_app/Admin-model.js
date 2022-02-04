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

class Admin_user extends Model { }

Admin_user.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  user_name: { type: DataTypes.STRING, allowNull: false },
  admin_recipt_message: { type: DataTypes.STRING, allowNull: false },
  email_id: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  is_logged_in : {type : DataTypes.BOOLEAN, allowNull : false,defaultValue : false}
}, {
  sequelize,
  freezeTableName: true
})
Admin_user.sync(true)
module.exports.AdminModel = Admin_user