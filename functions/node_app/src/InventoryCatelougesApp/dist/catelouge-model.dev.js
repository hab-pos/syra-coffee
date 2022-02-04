"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require("sequelize"),
    Model = _require.Model,
    DataTypes = _require.DataTypes,
    UUIDV4 = _require.UUIDV4,
    Op = _require.Op;

var _require2 = require('../db'),
    sequelize = _require2.sequelize;

var _require3 = require('../Category_app/category-model'),
    CategoryModel = _require3.CategoryModel;

var _require4 = require("../Branch-app/Branch-model"),
    BrancheModel = _require4.BrancheModel;

sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
})["catch"](function (err) {
  console.error('Unable to connect to the database:', err);
});

var InventoryCatelouge =
/*#__PURE__*/
function (_Model) {
  _inherits(InventoryCatelouge, _Model);

  function InventoryCatelouge() {
    _classCallCheck(this, InventoryCatelouge);

    return _possibleConstructorReturn(this, _getPrototypeOf(InventoryCatelouge).apply(this, arguments));
  }

  return InventoryCatelouge;
}(Model);

InventoryCatelouge.init({
  _id: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: UUIDV4,
    primaryKey: true
  },
  inventory_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  reference: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  available_branches: {
    type: DataTypes.TEXT,
    allowNull: false,
    get: function get() {
      return this.getDataValue('available_branches').split(',');
    }
  },
  branch_name_array: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      var value = [];

      if (this.getDataValue('branch_info')) {
        this.getDataValue('branch_info').forEach(function (element) {
          value.push(element.branch_name);
        });
      }

      return value;
    }
  },
  quantity: {
    type: DataTypes.VIRTUAL,
    allowNull: true,
    get: function get() {
      return 0;
    }
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});

var inventoryBranch =
/*#__PURE__*/
function (_Model2) {
  _inherits(inventoryBranch, _Model2);

  function inventoryBranch() {
    _classCallCheck(this, inventoryBranch);

    return _possibleConstructorReturn(this, _getPrototypeOf(inventoryBranch).apply(this, arguments));
  }

  return inventoryBranch;
}(Model);

inventoryBranch.init({
  BranchId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "Branches",
      key: "_id"
    }
  },
  catelouge_id: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: "InventoryCatelouge",
      key: "_id"
    }
  }
}, {
  sequelize: sequelize,
  freezeTableName: true
});
InventoryCatelouge.belongsTo(CategoryModel, {
  as: "category_info",
  foreignKey: "category_id"
});
InventoryCatelouge.belongsToMany(BrancheModel, {
  as: "branch_info",
  through: "inventoryBranch",
  foreignKey: "catelouge_id"
});
InventoryCatelouge.sync(true);
inventoryBranch.sync(true);
module.exports.InventoryCatelougeModel = InventoryCatelouge;
module.exports.inventoryBranchModel = inventoryBranch;