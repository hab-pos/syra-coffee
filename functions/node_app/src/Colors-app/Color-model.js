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

class Color extends Model { }

Color.init({
    _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
    color_code: { type: DataTypes.STRING, allowNull: false },
}, {
    sequelize,
    freezeTableName: true
})
Color.sync(true)
module.exports.ColorModel = Color