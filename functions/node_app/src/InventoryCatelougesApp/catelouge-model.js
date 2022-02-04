const { Model, DataTypes, UUIDV4, Op } = require("sequelize");
const { sequelize } = require('../db')
const { CategoryModel } = require('../Category_app/category-model')
const { BrancheModel } = require("../Branch-app/Branch-model")
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

class InventoryCatelouge extends Model { }

InventoryCatelouge.init({
  _id: { type: DataTypes.STRING, allowNull: false, defaultValue: UUIDV4, primaryKey: true },
  inventory_name: { type: DataTypes.STRING, allowNull: false },
  reference: { type: DataTypes.STRING, allowNull: false },
  unit: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.STRING, allowNull: false },
  category_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  available_branches: {
    type: DataTypes.TEXT,
    allowNull: false,
    get() {
      return this.getDataValue('available_branches').split(',')
    }
  },

  branch_name_array: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get() {
      let value = []
      if (this.getDataValue('branch_info')) {
        this.getDataValue('branch_info').forEach(element => {
          value.push(element.branch_name)
        });
      }
      return value
    }
  },

  quantity : {
    type : DataTypes.VIRTUAL,
    allowNull : true,
    get(){
      return 0
    }
  },
  created_by: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  freezeTableName: true
})

class inventoryBranch extends Model { }
inventoryBranch.init({
  BranchId: {
    type: DataTypes.STRING, allowNull: false, references: {
      model: "Branches",
      key: "_id"
    }
  },
  catelouge_id: {
    type: DataTypes.STRING, allowNull: false, references: {
      model: "InventoryCatelouge",
      key: "_id"
    }
  }
}, {
  sequelize,
  freezeTableName: true
})

InventoryCatelouge.belongsTo(CategoryModel, { as: "category_info", foreignKey: "category_id"})
InventoryCatelouge.belongsToMany(BrancheModel, { as: "branch_info", through: "inventoryBranch", foreignKey: "catelouge_id"})
InventoryCatelouge.sync(true)
inventoryBranch.sync(true)
module.exports.InventoryCatelougeModel = InventoryCatelouge
module.exports.inventoryBranchModel = inventoryBranch