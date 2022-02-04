"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./inventory-report-model'),
    InventoryReportModel = _require.InventoryReportModel;

var _require2 = require('../Branch-app/Branch-model'),
    BrancheModel = _require2.BrancheModel;

var _require3 = require("../InventoryOrderApp/inventory-order-model"),
    InventoryOrderModel = _require3.InventoryOrderModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var moment = require('moment');

var _require4 = require('../../Utils/constants'),
    constants = _require4.constants;

var InventoryReportRepository =
/*#__PURE__*/
function () {
  function InventoryReportRepository() {
    _classCallCheck(this, InventoryReportRepository);
  }

  _createClass(InventoryReportRepository, [{
    key: "create_report",
    value: function create_report(request) {
      return InventoryReportModel.create({
        date_of_week: request.date_of_week,
        branch_id: request.branch_id,
        weekly_shipped: request.weekly_shipped,
        quantity_at_week_start: request.quantity_at_week_start,
        final_remaining: request.final_remaining,
        total_consumption: request.total_consumption
      });
    }
  }, {
    key: "get_report",
    value: function get_report(branch_id) {
      return InventoryReportModel.findAll({
        where: {
          branch_id: branch_id,
          is_deleted: false
        },
        order: [["date_of_week", "DESC"]]
      });
    }
  }, {
    key: "get_report_limit",
    value: function get_report_limit(branch_id) {
      var limit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
      return InventoryReportModel.findAll({
        where: {
          branch_id: branch_id,
          is_deleted: false
        },
        order: [["date_of_week", "DESC"]],
        limit: limit
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
    key: "get_last_week_orders",
    value: function get_last_week_orders(branch_id, date) {
      if (date == null) {
        return InventoryOrderModel.findAll({
          where: {
            ordered_branch: branch_id,
            status: "delivered",
            order_date: _defineProperty({}, Op.gte, moment().subtract(7, 'days').utc()),
            is_deleted: false
          }
        });
      } else {
        return InventoryOrderModel.findAll({
          where: {
            ordered_branch: branch_id,
            status: "delivered",
            delivery_date: _defineProperty({}, Op.gte, moment(date).utc()),
            is_deleted: false
          }
        });
      }
    }
  }, {
    key: "filter_with_start_and_end",
    value: function filter_with_start_and_end(start, end, branch_id) {
      return InventoryReportModel.findAll({
        where: {
          branch_id: branch_id,
          date_of_week: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(end).utc().tz(constants.TIME_ZONE).endOf('day'))]),
          is_deleted: false
        },
        order: [["date_of_week", "DESC"]]
      });
    }
  }, {
    key: "filter_with_start",
    value: function filter_with_start(start, branch_id) {
      return InventoryReportModel.findAll({
        where: {
          branch_id: branch_id,
          date_of_week: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(start).utc().tz(constants.TIME_ZONE).endOf('day'))]),
          is_deleted: false
        },
        order: [["date_of_week", "DESC"]]
      });
    }
  }]);

  return InventoryReportRepository;
}();

module.exports.InventoryReportRepository = new InventoryReportRepository();