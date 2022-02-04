const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../../db');
const { UserProducts } = require("../Products_app/products-model");
const moment = require('moment')
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class SyraEvents extends Model { }

SyraEvents.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  event_name: { type: DataTypes.STRING, allowNull: false },
  start_date: { type: DataTypes.STRING, allowNull: false },
  end_date: { type: DataTypes.STRING, allowNull: false },
  reward_mode: { type: DataTypes.STRING, allowNull: false },
  reward_mode_string: { type: DataTypes.VIRTUAL, allowNull: true,
    get(){
      if(this.getDataValue("reward_mode") == "discount"){
        return "Discount ("+ this.getDataValue('amount') +"%)"
      }
      else{
        return "Beans ("+this.getDataValue('amount')+"x)"
      }
    }
  },
  amount: { type: DataTypes.STRING, allowNull: false },
  products: { type: DataTypes.TEXT, allowNull: false },
  thumbnail_name: { type: DataTypes.STRING, allowNull: false },
  thumbnail_url: { type: DataTypes.STRING, allowNull: false },
  cover_name: { type: DataTypes.STRING, allowNull: false },
  cover_url: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  event_time_frame : {type: DataTypes.VIRTUAL, 
    get(){
      if(moment(this.getDataValue('start_date')).month() == moment(this.getDataValue('end_date')).month()){
        return moment(this.getDataValue('start_date')).format("MMM D") + " - " + moment(this.getDataValue('end_date')).format("MMM D YYYY")
      }
      else{
        return moment(this.getDataValue('start_date')).format("MMM D YYYY") + " - " + moment(this.getDataValue('end_date')).format("MMM D YYYY")
      }
    }
  },
  short_description : { type: DataTypes.VIRTUAL, allowNull: true,
    get(){
      if(this.getDataValue('description')){
        let description = this.getDataValue('description')
        return description.replace( /(<([^>]+)>)/ig, '')
      }
    } 
  },
  is_expired : {type: DataTypes.VIRTUAL, 
    get(){
      return moment(this.getDataValue('end_date')).diff(moment()) < 0
    }
  }
}, {
  sequelize,
  freezeTableName: true
})


class EventProducts extends Model { }
EventProducts.init({
  SyraEventId: {
    type: DataTypes.STRING, allowNull: false,
    references: {
      model: "SyraEvents",
      key: "_id"
    }
  },
  UserProductId: {
    type: DataTypes.STRING, allowNull: false,
    references: {
      model: "UserProducts",
      key: "_id"
    }
  }
}, {
  sequelize,
  freezeTableName: true
})

SyraEvents.belongsToMany(UserProducts, { as: "product_info",foreignKey: "SyraEventId",through : "EventProducts" })
module.exports.EventProducts = EventProducts
SyraEvents.sync(true)
EventProducts.sync(true)
module.exports.SyraEvents = SyraEvents