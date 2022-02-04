const { MyCartModel } = require("../../User_App/User-model");
const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../../db');
const { IVAModel } = require("../../SetupApp/setup-model");
const { UserCategories } = require("../Category_app/category-model");
const {ModifiersModel} = require("../ModifiersApp/modifier-model")
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
  
class UserProducts extends Model { }
UserProducts.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  product_name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.STRING, allowNull: false,
  get(){
    return Number(this.getDataValue('price')).toFixed(2)
  } 
},
price_actual: { type: DataTypes.VIRTUAL, allowNull: false,
  get(){
    return Number(this.getDataValue('price')).toFixed(2)
  } 
},
  iva: { type: DataTypes.STRING, allowNull: false },
  reference: { type: DataTypes.STRING, allowNull: false,defaultValue : "" },
  beans_value: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  image_name: { type: DataTypes.TEXT, allowNull: false },
  image_url: { type: DataTypes.TEXT, allowNull: false },
  setup_selected: { type: DataTypes.STRING, allowNull: false },
  required_modifier: { type: DataTypes.TEXT, allowNull: false },
  optional_modifier: { type: DataTypes.TEXT, allowNull: false },
  grinds: { type: DataTypes.TEXT, allowNull: false,
    get(){
    if(this.getDataValue('grinds')){
      if(typeof this.getDataValue('grinds') != "object"){
        return JSON.parse(this.getDataValue('grinds'))
      }
    }
  } },
  orgin_text: { type: DataTypes.TEXT, allowNull: false },
  notes: { type: DataTypes.TEXT, allowNull: false },
  notes_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  origin_enabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  is_Active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  is_featured: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  checked: { type: DataTypes.VIRTUAL, defaultValue: false },
  is_locked: { type: DataTypes.VIRTUAL, defaultValue: false },
  short_description : { type: DataTypes.VIRTUAL, allowNull: true,
    get(){
      if(this.getDataValue('description')){
        let description = this.getDataValue('description')
        return description.replace( /(<([^>]+)>)/ig, '')
      }
    } 
  },
  price_without_tax : { type: DataTypes.VIRTUAL, allowNull: true,
    get(){
      if(this.getDataValue('iva_info')){
        return (Number(this.getDataValue('price')) - (Number(this.getDataValue('price')) * Number(this.getDataValue('iva_info').iva_percent) / 100)).toFixed(2)
      }
    } 
  },
  wallet_id : {type: DataTypes.VIRTUAL, allowNull: true,
  get(){
   return ""
  } 
},
color : {type: DataTypes.VIRTUAL, allowNull: true,
  get(){
    var hash = 0;
    let str = this.getDataValue('reference')
    for (var i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
      var value = (hash >> (i * 8)) & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour
  } 
},
}, {
  sequelize,
  freezeTableName: true
})

class RequiredModifierProducts extends Model { }
RequiredModifierProducts.init({
  ModifierId: {
    type: DataTypes.STRING, allowNull: false, references: {
      model: ModifiersModel,
      key: "_id"
    }
  },
  product_id: {
    type: DataTypes.STRING, allowNull: false, references: {
      model: UserProducts,
      key: "_id"
    }
  }
}, {
  sequelize,
  freezeTableName: true
})


class optionalModifierProducts extends Model { }
optionalModifierProducts.init({
  ModifierId: {
    type: DataTypes.STRING, allowNull: false, references: {
      model: ModifiersModel,
      key: "_id"
    }
  },
  product_id: {
    type: DataTypes.STRING, allowNull: false, references: {
      model: UserProducts,
      key: "_id"
    }
  }
}, {
  sequelize,
  freezeTableName: true
})


UserProducts.belongsTo(IVAModel, { as: "iva_info", foreignKey: "iva" })
UserProducts.belongsTo(UserCategories, { as: "category_details", foreignKey: "category" })
UserProducts.belongsToMany(ModifiersModel, { as: "required_modifier_list",foreignKey: "product_id",through : "RequiredModifierProducts" })
UserProducts.belongsToMany(ModifiersModel, { as: "optional_modifier_list",foreignKey: "product_id",through : "optionalModifierProducts" })

module.exports.RequiredModifierProducts = RequiredModifierProducts
module.exports.optionalModifierProducts = optionalModifierProducts

UserProducts.sync(true)
RequiredModifierProducts.sync(true)
optionalModifierProducts.sync(true)

module.exports.UserProducts = UserProducts