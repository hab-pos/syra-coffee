const { Model, DataTypes, UUIDV4 } = require("sequelize");
const { sequelize } = require('../../db');
const { UserProducts } = require("../Products_app/products-model");
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class StoryModel extends Model { }
StoryModel.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  products: { type: DataTypes.STRING, allowNull: false },
  thumbnail_name: { type: DataTypes.STRING, allowNull: false },
  thumbnail_url: { type: DataTypes.TEXT, allowNull: false },
  story_content : { type: DataTypes.TEXT, allowNull: false },
  story_content_list : { type: DataTypes.VIRTUAL, allowNull: true,
  get(){
    if(this.getDataValue('story_content')){
      return JSON.parse(this.getDataValue('story_content'))
    }
  } 
},
short_description : { type: DataTypes.VIRTUAL, allowNull: true,
  get(){
    if(this.getDataValue('story_content')){
      let description = JSON.parse(this.getDataValue('story_content'))
      var index = description.map(function(e) { return e.type; }).indexOf('text');
      return description[index].value.replace( /(<([^>]+)>)/ig, '')
    }
  } 
},

  order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  is_deleted: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  sequelize,
  freezeTableName: true
})

// class StoryModelProduct extends Model { }
// StoryModelProduct.init({
//   StoryModelId: {
//     type: DataTypes.STRING, allowNull: false,
//     references: {
//       model: "StoryModel",
//       key: "_id"
//     }
//   },
//   UserProductId: {
//     type: DataTypes.STRING, allowNull: false,
//     references: {
//       model: "UserProducts",
//       key: "_id"
//     }
//   }
// }, {
//   sequelize,
//   freezeTableName: true
// })

StoryModel.sync(true)
StoryModel.belongsTo(UserProducts, { as: "product_info",foreignKey: "products"})
// module.exports.StoryModelProduct = StoryModelProduct
// StoryModelProduct.sync(true)
module.exports.StoryModel = StoryModel