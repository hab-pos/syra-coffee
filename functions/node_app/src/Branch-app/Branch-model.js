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

class Branches extends Model { }

Branches.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  created_by: { type: DataTypes.STRING, allowNull: false },
  branch_name: { type: DataTypes.STRING, allowNull: false },
  device_id: { type: DataTypes.STRING, allowNull: false },
  lat : { type: DataTypes.STRING, allowNull: true,
    get(){
    return this.getDataValue('lat') == null ? "0.0" : this.getDataValue('lat')
  } 
},
  lng : { type: DataTypes.STRING, allowNull: true, 
    get(){
      return this.getDataValue('lng') == null ? "0.0" : this.getDataValue('lng')
    } 
  },
  show_on_app : { type: DataTypes.BOOLEAN, allowNull: true,defaultValue : false },
  espresso_report_date : { type: DataTypes.STRING, allowNull: true,defaultValue : false,get(){
    if(this.getDataValue('espresso_report_date')){
      return this.getDataValue('espresso_report_date').split(",")
    }
    else{
      return []
    }
  } },
}, {
  sequelize,
  freezeTableName: true
})
Branches.sync(true)
module.exports.BrancheModel = Branches