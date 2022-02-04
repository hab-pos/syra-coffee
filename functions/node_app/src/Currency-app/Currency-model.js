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

class Currency extends Model { }

Currency.init({
    _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
    code: { type: DataTypes.STRING, allowNull: false },
    symbol: { type: DataTypes.CHAR, allowNull: false }
}, {
    sequelize,
    freezeTableName: true
})
Currency.sync(true)
module.exports.CurrencyModel = Currency