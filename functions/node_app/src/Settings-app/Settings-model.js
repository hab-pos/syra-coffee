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

class Settings extends Model { }

Settings.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.TEXT, allowNull: false },
}, {
  sequelize,
  freezeTableName: true
})
Settings.sync(true)
module.exports.SettingsModel = Settings