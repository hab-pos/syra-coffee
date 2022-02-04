"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("../BaristaApp/Barista-model"),
    BaristaModel = _require.BaristaModel;

var _require2 = require("../ExpenseApp/Expense-model"),
    ExpenseTableModel = _require2.ExpenseTableModel;

var _require3 = require('../Branch-app/Branch-model'),
    BrancheModel = _require3.BrancheModel;

var _require4 = require("./orders-model"),
    OrdersModel = _require4.OrdersModel,
    AppliedDiscountsModel = _require4.AppliedDiscountsModel,
    OrderedProductsModel = _require4.OrderedProductsModel,
    TransactionInModel = _require4.TransactionInModel;

var _require5 = require("../ProductApp/product-model"),
    productsModel = _require5.productsModel;

var _require6 = require("../Category_app/category-model"),
    CategoryModel = _require6.CategoryModel;

var _require7 = require("../SetupApp/setup-model"),
    IVAModel = _require7.IVAModel,
    DiscountModel = _require7.DiscountModel;

var _require8 = require("../Transaction-outApp/transaction-out-model"),
    TransactionOutModel = _require8.TransactionOutModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var moment = require('moment');

var sequential = require("sequential-ids");

var _require9 = require('../../Utils/constants'),
    constants = _require9.constants;

var ReportRepository =
/*#__PURE__*/
function () {
  function ReportRepository() {
    _classCallCheck(this, ReportRepository);
  }

  _createClass(ReportRepository, [{
    key: "getTotalBillings",
    value: function getTotalBillings(dates, branch) {
      return regeneratorRuntime.async(function getTotalBillings$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              console.log(dates, branch);

              if (!dates) {
                _context.next = 21;
                break;
              }

              if (!(dates.start != null && dates.end != null)) {
                _context.next = 12;
                break;
              }

              if (!(branch != null)) {
                _context.next = 8;
                break;
              }

              console.log("date and branch  Block");
              return _context.abrupt("return", TransactionInModel.findAll({
                where: {
                  branch_id: branch,
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }]),
                  attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
                }]
              }));

            case 8:
              console.log("Dates only");
              return _context.abrupt("return", TransactionInModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }]),
                  attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
                }]
              }));

            case 10:
              _context.next = 19;
              break;

            case 12:
              if (!(branch != null)) {
                _context.next = 17;
                break;
              }

              console.log("Start and branch Only Block");
              return _context.abrupt("return", TransactionInModel.findAll({
                where: {
                  branch_id: branch,
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }]),
                  attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
                }]
              }));

            case 17:
              console.log("Start Only Block");
              return _context.abrupt("return", TransactionInModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }]),
                  attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
                }]
              }));

            case 19:
              _context.next = 28;
              break;

            case 21:
              if (!(branch == null && dates == null)) {
                _context.next = 26;
                break;
              }

              console.log("no date and no branch  Block");
              return _context.abrupt("return", TransactionInModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }]),
                  attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
                }]
              }));

            case 26:
              console.log("branch Only Block");
              return _context.abrupt("return", TransactionInModel.findAll({
                where: {
                  branch_id: branch,
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }]),
                  attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
                }]
              }));

            case 28:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "lastWeekDashboardReport",
    value: function lastWeekDashboardReport(dates, branch) {
      if (dates) {
        var startDate = moment(dates.start);
        var endDate = moment(dates.end);

        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: branch
              },
              attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
              }]
            });
          } else {
            console.log("Dates only");

            var _startDate = moment(dates.start);

            var _endDate = moment(dates.end);

            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(_endDate.diff(_startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(_endDate.diff(_startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block");
            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: branch
              },
              attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
              }]
            });
          } else {
            console.log("Start Only Block");
            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        console.log("no date and no branch  Block123123", moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day'));
        return TransactionInModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
          include: [{
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }]),
            attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
          }]
        });
      } else {
        console.log("branch Only Block");
        return TransactionInModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))]),
            branch_id: branch
          },
          attributes: [[Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count']],
          include: [{
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }]),
            attributes: [[Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount']]
          }]
        });
      }
    }
  }, {
    key: "get_branch_wise_report",
    value: function get_branch_wise_report(dates, branch) {
      console.log(dates, branch);

      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return TransactionInModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
                group: ['branch_id']
              }]
            });
          } else {
            console.log("Dates only"); //done

            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
                group: ['branch_id']
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block"); //done

            return TransactionInModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
                group: ['branch_id']
              }]
            });
          } else {
            console.log("Start Only Block"); //done

            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
                group: ['branch_id']
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        console.log("no date and no branch  Block"); //done

        return TransactionInModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          group: ['branch_id'],
          attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }]),
            attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
            group: ['branch_id']
          }]
        });
      } else {
        console.log("branch Only Block"); //done

        return TransactionInModel.findAll({
          where: {
            branch_id: branch,
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          group: ['branch_id'],
          attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }]),
            attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
            group: ['branch_id']
          }]
        });
      }
    }
  }, {
    key: "get_branch_wise_report_graph",
    value: function get_branch_wise_report_graph(dates, branch) {
      console.log(dates, branch);

      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return TransactionInModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          } else {
            console.log("Dates only"); //done

            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block"); //done

            return TransactionInModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          } else {
            console.log("Start Only Block"); //done

            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        console.log("no date and no branch  Block"); //done

        return TransactionInModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }])
          }]
        });
      } else {
        console.log("branch Only Block"); //done

        return TransactionInModel.findAll({
          where: {
            branch_id: branch,
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }])
          }]
        });
      }
    }
  }, {
    key: "lastWeekBranchReport",
    value: function lastWeekBranchReport(dates, branch) {
      if (dates) {
        var startDate = moment(dates.start);
        var endDate = moment(dates.end);

        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return TransactionInModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
                group: ['branch_id']
              }]
            });
          } else {
            console.log("Dates only"); //done

            var _startDate2 = moment(dates.start);

            var _endDate2 = moment(dates.end);

            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(_endDate2.diff(_startDate2, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(_endDate2.diff(_startDate2, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
                group: ['branch_id']
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block"); //done

            return TransactionInModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
                group: ['branch_id']
              }]
            });
          } else {
            console.log("Start Only Block"); //done

            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }]),
                attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
                group: ['branch_id']
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        //done
        console.log("no date and no branch  Block");
        return TransactionInModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          group: ['branch_id'],
          attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }]),
            attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
            group: ['branch_id']
          }]
        });
      } else {
        //dome
        console.log("branch Only Block");
        return TransactionInModel.findAll({
          where: {
            branch_id: branch,
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          group: ['branch_id'],
          attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }]),
            attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'], [Sequelize.fn('count', Sequelize.col('order_id')), 'count']],
            group: ['branch_id']
          }]
        });
      }
    } //expense

  }, {
    key: "get_branch_wise_expense_report",
    value: function get_branch_wise_expense_report(dates, branch) {
      console.log(dates, branch);

      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return ExpenseTableModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }]
            });
          } else {
            console.log("Dates only"); //done

            return ExpenseTableModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block");
            return ExpenseTableModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }]
            });
          } else {
            console.log("Start Only Block");
            return ExpenseTableModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        console.log("no date and no branch  Block");
        return ExpenseTableModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          group: ['branch_id'],
          attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }]
        });
      } else {
        console.log("branch Only Block"); //done

        return ExpenseTableModel.findAll({
          where: {
            branch_id: branch,
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          group: ['branch_id'],
          attributes: ['branch_id', [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }]
        });
      }
    }
  }, {
    key: "lastWeekBranchExpenseReport",
    value: function lastWeekBranchExpenseReport(dates, branch) {
      if (dates) {
        var startDate = moment(dates.start);
        var endDate = moment(dates.end);

        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return ExpenseTableModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ["branch_id", [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }]
            });
          } else {
            console.log("Dates only"); //done

            var _startDate3 = moment(dates.start);

            var _endDate3 = moment(dates.end);

            return ExpenseTableModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(_endDate3.diff(_startDate3, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(_endDate3.diff(_startDate3, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ["branch_id", [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block"); //done

            return ExpenseTableModel.findAll({
              where: {
                createdAt: _defineProperty({
                  branch_id: branch
                }, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ["branch_id", [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }]
            });
          } else {
            console.log("Start Only Block");
            return ExpenseTableModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              group: ['branch_id'],
              attributes: ["branch_id", [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        //done
        console.log("no date and no branch  Block");
        return ExpenseTableModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          group: ['branch_id'],
          attributes: ["branch_id", [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }]
        });
      } else {
        //dome
        console.log("branch Only Block");
        return ExpenseTableModel.findAll({
          where: {
            branch_id: branch,
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          group: ['branch_id'],
          attributes: ["branch_id", [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount']],
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }]
        });
      }
    }
  }, {
    key: "getTotalBillingsGraph",
    value: function getTotalBillingsGraph(dates, branch) {
      return regeneratorRuntime.async(function getTotalBillingsGraph$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              console.log(dates, branch);

              if (!dates) {
                _context2.next = 21;
                break;
              }

              if (!(dates.start != null && dates.end != null)) {
                _context2.next = 12;
                break;
              }

              if (!(branch != null)) {
                _context2.next = 8;
                break;
              }

              console.log("date and branch  Block");
              return _context2.abrupt("return", TransactionInModel.findAll({
                where: {
                  branch_id: branch,
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }]
              }));

            case 8:
              console.log("Dates only");
              return _context2.abrupt("return", TransactionInModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }]
              }));

            case 10:
              _context2.next = 19;
              break;

            case 12:
              if (!(branch != null)) {
                _context2.next = 17;
                break;
              }

              console.log("Start and branch Only Block");
              return _context2.abrupt("return", TransactionInModel.findAll({
                where: {
                  branch_id: branch,
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }]
              }));

            case 17:
              console.log("Start Only Block");
              return _context2.abrupt("return", TransactionInModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }]
              }));

            case 19:
              _context2.next = 28;
              break;

            case 21:
              if (!(branch == null && dates == null)) {
                _context2.next = 26;
                break;
              }

              console.log("no date and no branch  Block");
              return _context2.abrupt("return", TransactionInModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }]
              }));

            case 26:
              console.log("branch Only Block");
              return _context2.abrupt("return", TransactionInModel.findAll({
                where: {
                  branch_id: branch,
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }]
              }));

            case 28:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }]);

  return ReportRepository;
}();

module.exports.OrderReportRepository = new ReportRepository();