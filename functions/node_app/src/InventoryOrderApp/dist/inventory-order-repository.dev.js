"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('../Branch-app/Branch-model'),
    BrancheModel = _require.BrancheModel;

var _require2 = require('./inventory-order-model'),
    InventoryOrderModel = _require2.InventoryOrderModel;

var _require3 = require("../BaristaApp/Barista-model"),
    BaristaModel = _require3.BaristaModel;

var _require4 = require("../Category_app/category-model"),
    CategoryModel = _require4.CategoryModel;

var _require5 = require('../InventoryCatelougesApp/catelouge-model'),
    InventoryCatelougeModel = _require5.InventoryCatelougeModel;

var _require6 = require('../Transaction-outApp/transaction-out-repository'),
    transactionOutRepository = _require6.transactionOutRepository;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var moment = require('moment');

var _require7 = require('../../Utils/constants'),
    constants = _require7.constants;

var InventoryOrderRepository =
/*#__PURE__*/
function () {
  function InventoryOrderRepository() {
    _classCallCheck(this, InventoryOrderRepository);
  }

  _createClass(InventoryOrderRepository, [{
    key: "createTxn",
    value: function createTxn(req) {
      return transactionOutRepository.addTxn(req.date_of_transaction, req.reason, req.type, req.barista_id, req.iva_id, req.total_amount, req.mode_of_payment, req.invoice_number);
    }
  }, {
    key: "createOrder",
    value: function createOrder(requestObj) {
      return InventoryOrderModel.create({
        order_date: requestObj.order_date,
        ordered_branch: requestObj.ordered_branch,
        received_by: requestObj.received_by,
        ordered_by: requestObj.ordered_by,
        delivery_date: requestObj.delivery_date,
        number_of_products: requestObj.number_of_products,
        status: requestObj.status,
        comment_by_barista: requestObj.comment_by_barista,
        admin_msg: requestObj.admin_msg,
        ordered_items: requestObj.ordered_items
      });
    }
  }, {
    key: "get_branchInfo",
    value: function get_branchInfo(device_id) {
      return BrancheModel.findOne({
        where: {
          device_id: device_id
        }
      });
    }
  }, {
    key: "getInventoryOrders",
    value: function getInventoryOrders(id) {
      return id ? InventoryOrderModel.findOne({
        where: {
          _id: id
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "ordered_by_details"
        }, {
          model: BaristaModel,
          as: "recieved_by_details"
        }],
        order: [["order_date", "DESC"]]
      }) : InventoryOrderModel.findAll({
        where: {
          is_deleted: false,
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "ordered_by_details"
        }, {
          model: BaristaModel,
          as: "recieved_by_details"
        }],
        order: [["order_date", "DESC"]]
      });
    }
  }, {
    key: "deleteOrder",
    value: function deleteOrder(id) {
      return InventoryOrderModel.update({
        is_deleted: true
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "updateOrder",
    value: function updateOrder(query) {
      return InventoryOrderModel.update(query, {
        where: {
          _id: query.id
        }
      });
    }
  }, {
    key: "get_branchInfo",
    value: function get_branchInfo(device_id) {
      return BrancheModel.findOne({
        where: {
          device_id: device_id
        }
      });
    }
  }, {
    key: "get_inventories",
    value: function get_inventories(id) {
      return id ? InventoryCatelougeModel.findOne({
        where: {
          _id: id
        },
        include: [{
          model: CategoryModel,
          as: "category_info"
        }, {
          model: BrancheModel,
          as: "branch_info"
        }]
      }) : InventoryCatelougeModel.findAll({
        include: [{
          model: CategoryModel,
          as: "category_info"
        }, {
          model: BrancheModel,
          as: "branch_info"
        }],
        order: [["reference", "ASC"], ["inventory_name", "ASC"]]
      });
    } // only branch

  }, {
    key: "get_branch_orders",
    value: function get_branch_orders(branch_id) {
      return InventoryOrderModel.findAll({
        where: {
          is_deleted: false,
          ordered_branch: branch_id,
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "ordered_by_details"
        }, {
          model: BaristaModel,
          as: "recieved_by_details"
        }],
        order: [["order_date", "DESC"]]
      });
    }
  }, {
    key: "get_branch_orders_not_delivered",
    value: function get_branch_orders_not_delivered(branch_id) {
      return InventoryOrderModel.findAll({
        where: {
          is_deleted: false,
          ordered_branch: branch_id,
          status: _defineProperty({}, Op["in"], ["approved", "pending"]),
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'months').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "ordered_by_details"
        }, {
          model: BaristaModel,
          as: "recieved_by_details"
        }],
        order: [["order_date", "DESC"]]
      });
    } //only dates both start and end

  }, {
    key: "get_date_orders",
    value: function get_date_orders(start, end) {
      return InventoryOrderModel.findAll({
        where: {
          is_deleted: false,
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(end).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "ordered_by_details"
        }, {
          model: BaristaModel,
          as: "recieved_by_details"
        }],
        order: [["order_date", "DESC"]]
      });
    } // both start,end dates and branch-id

  }, {
    key: "get_branches_and_dates",
    value: function get_branches_and_dates(branch_id, start, end) {
      return InventoryOrderModel.findAll({
        where: {
          is_deleted: false,
          ordered_branch: _defineProperty({}, Op["in"], branch_id),
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(end).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "ordered_by_details"
        }, {
          model: BaristaModel,
          as: "recieved_by_details"
        }],
        order: [["order_date", "DESC"]]
      });
    } //branch and start date only

  }, {
    key: "get_branches_and_StartDate",
    value: function get_branches_and_StartDate(branch_id, start) {
      return InventoryOrderModel.findAll({
        where: {
          is_deleted: false,
          ordered_branch: _defineProperty({}, Op["in"], branch_id),
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(start).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "ordered_by_details"
        }, {
          model: BaristaModel,
          as: "recieved_by_details"
        }],
        order: [["order_date", "DESC"]]
      });
    } //only start 

  }, {
    key: "get_orders_only_with_start_date",
    value: function get_orders_only_with_start_date(start) {
      console.log(start);
      console.log(moment(start).utc().tz(constants.TIME_ZONE).startOf('day'));
      console.log(moment(start).utc().tz(constants.TIME_ZONE).endOf('day'));
      return InventoryOrderModel.findAll({
        where: {
          is_deleted: false,
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(start).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "ordered_by_details"
        }, {
          model: BaristaModel,
          as: "recieved_by_details"
        }],
        order: [["order_date", "DESC"]]
      });
    }
  }]);

  return InventoryOrderRepository;
}();

module.exports.inventoryOrderRepository = new InventoryOrderRepository();