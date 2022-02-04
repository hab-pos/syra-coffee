"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./Barista-model'),
    BaristaModel = _require.BaristaModel,
    ClockinModel = _require.ClockinModel;

var _require2 = require('../../Utils/Common/crypto'),
    comparePassword = _require2.comparePassword;

var _require3 = require('../Branch-app/Branch-model'),
    BrancheModel = _require3.BrancheModel;

var _require4 = require('../OrdersApp/orders-model'),
    TransactionInModel = _require4.TransactionInModel,
    OrdersModel = _require4.OrdersModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var moment = require('moment');

var _require5 = require('../../Utils/constants'),
    constants = _require5.constants;

var BaristaRepository =
/*#__PURE__*/
function () {
  function BaristaRepository() {
    _classCallCheck(this, BaristaRepository);
  }

  _createClass(BaristaRepository, [{
    key: "addBarista",
    value: function addBarista(barista_name, password, admin_id) {
      var count, color, colorString;
      return regeneratorRuntime.async(function addBarista$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return regeneratorRuntime.awrap(BaristaModel.count());

            case 2:
              count = _context.sent;
              color = Math.floor(0x1000000 * (Math.random() + count)).toString(16);
              colorString = '#' + ('000000' + color).slice(-6);
              return _context.abrupt("return", BaristaModel.create({
                barista_name: barista_name,
                password: password,
                created_by: admin_id,
                color: colorString
              }));

            case 6:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "get_all_baristas",
    value: function get_all_baristas() {
      return BaristaModel.findAll({
        where: {
          is_deleted: false
        },
        order: [["createdAt", "DESC"]]
      });
    }
  }, {
    key: "get_barista_details",
    value: function get_barista_details(query) {
      return BaristaModel.findOne({
        where: query
      });
    }
  }, {
    key: "get_branchInfo",
    value: function get_branchInfo(device_id) {
      var branch;
      return regeneratorRuntime.async(function get_branchInfo$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return regeneratorRuntime.awrap(BrancheModel.findOne({
                where: {
                  device_id: device_id
                }
              }));

            case 2:
              branch = _context2.sent;
              return _context2.abrupt("return", branch);

            case 4:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "update_login_status",
    value: function update_login_status(user_id, status) {
      return BaristaModel.update({
        is_logged_in: status
      }, {
        where: {
          _id: user_id
        }
      });
    }
  }, {
    key: "update_password",
    value: function update_password(id, hash) {
      return BaristaModel.update({
        password: hash
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "update_user_name",
    value: function update_user_name(id, user_name) {
      return BaristaModel.update({
        barista_name: user_name
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "update_user_and_pwd",
    value: function update_user_and_pwd(id, user_name, pwd) {
      return BaristaModel.update({
        password: pwd,
        barista_name: user_name
      }, {
        where: {
          _id: id
        }
      });
    }
  }, {
    key: "delete_barista",
    value: function delete_barista(_id) {
      return BaristaModel.update({
        is_deleted: true
      }, {
        where: {
          _id: _id
        }
      });
    }
  }, {
    key: "isUniqueName",
    value: function isUniqueName(name) {
      return BaristaModel.findOne({
        where: {
          "barista_name": name
        }
      });
    }
  }, {
    key: "compare_password",
    value: function compare_password(barista_name, password) {
      var barista_details;
      return regeneratorRuntime.async(function compare_password$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return regeneratorRuntime.awrap(this.get_barista_details({
                "barista_name": barista_name
              }));

            case 2:
              barista_details = _context3.sent;

              if (!barista_details) {
                _context3.next = 9;
                break;
              }

              _context3.next = 6;
              return regeneratorRuntime.awrap(comparePassword(password, barista_details.password).then(function (status) {
                return {
                  status: status,
                  barista_details: barista_details
                };
              }));

            case 6:
              return _context3.abrupt("return", _context3.sent);

            case 9:
              return _context3.abrupt("return", {
                status: false,
                barista_details: null
              });

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, null, this);
    } //create clockin data

  }, {
    key: "addClockin",
    value: function addClockin(barista_id, branch_id, current_time_slot, type, is_active) {
      return ClockinModel.create({
        barista_id: barista_id,
        branch_id: branch_id,
        time_slot: current_time_slot,
        type: type,
        is_active: is_active,
        loginTime: moment().toDate()
      });
    } //clock_out

  }, {
    key: "clock_out",
    value: function clock_out(branch_id, barista_id) {
      return ClockinModel.update({
        is_deleted: true,
        logoutTime: moment().toDate()
      }, {
        where: {
          branch_id: branch_id,
          barista_id: barista_id,
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
        }
      });
    } //switch_user

  }, {
    key: "switch_user",
    value: function switch_user(branch_id, barista_id, status) {
      //console.log(branch_id,barista_id,status)
      return ClockinModel.update({
        is_active: status
      }, {
        where: {
          branch_id: branch_id,
          barista_id: barista_id,
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
        }
      });
    } //create clockin data

  }, {
    key: "getClockin",
    value: function getClockin(branch_id) {
      return ClockinModel.findAll({
        where: {
          branch_id: branch_id,
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')),
          is_deleted: false
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }],
        order: [["createdAt", "DESC"]]
      });
    }
  }, {
    key: "getClockinRecord",
    value: function getClockinRecord(branch_id, barista_id) {
      return ClockinModel.findOne({
        where: {
          branch_id: branch_id,
          barista_id: barista_id,
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')),
          is_deleted: false
        },
        include: [{
          model: BrancheModel,
          as: "branch_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }],
        order: [["createdAt", "ASC"]]
      });
    }
  }, {
    key: "clock_out_all",
    value: function clock_out_all(branch_id) {
      return ClockinModel.update({
        is_deleted: true,
        logoutTime: moment().toDate()
      }, {
        where: {
          branch_id: branch_id,
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')),
          logoutTime: null
        }
      });
    }
  }, {
    key: "getReport",
    value: function getReport(dates, branch) {
      console.log(dates, branch);

      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return ClockinModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }]
            });
          } else {
            console.log("Dates only"); //done

            return ClockinModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block");
            return ClockinModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }]
            });
          } else {
            console.log("Start Only Block");
            return ClockinModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        console.log("no date and no branch  Block"); //done

        return ClockinModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: BaristaModel,
            as: "barista_info"
          }]
        });
      } else {
        console.log("branch Only Block"); //done

        return ClockinModel.findAll({
          where: {
            branch_id: branch,
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: BaristaModel,
            as: "barista_info"
          }]
        });
      }
    }
  }, {
    key: "getReportGraph",
    value: function getReportGraph(dates, branch) {
      console.log(dates, branch);

      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return ClockinModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }],
              order: [["loginTime", "ASC"]]
            });
          } else {
            console.log("Dates only"); //done

            return ClockinModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }],
              order: [["loginTime", "ASC"]]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block");
            return ClockinModel.findAll({
              where: {
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }],
              order: [["loginTime", "ASC"]]
            });
          } else {
            console.log("Start Only Block");
            return ClockinModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }],
              order: [["loginTime", "ASC"]]
            });
          }
        }
      } else if (branch == null && dates == null) {
        console.log("no date and no branch  Block"); //done

        return ClockinModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: BaristaModel,
            as: "barista_info"
          }],
          order: [["loginTime", "ASC"]]
        });
      } else {
        console.log("branch Only Block"); //done

        return ClockinModel.findAll({
          where: {
            branch_id: branch,
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          include: [{
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: BaristaModel,
            as: "barista_info"
          }],
          order: [["loginTime", "ASC"]]
        });
      }
    } //in

  }, {
    key: "getBarista_transaction",
    value: function getBarista_transaction(dates, branch, barista_id) {
      console.log(dates, branch, barista_id);

      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return TransactionInModel.findAll({
              where: {
                branch_id: branch,
                barista_id: barista_id,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              attributes: [[Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount']],
              include: [{
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
                barista_id: barista_id,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              attributes: [[Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount']],
              include: [{
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
            console.log("Start and branch Only Block");
            return TransactionInModel.findAll({
              where: {
                barista_id: barista_id,
                branch_id: branch,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              attributes: [[Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount']],
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          } else {
            console.log("Start Only Block");
            return TransactionInModel.findAll({
              where: {
                barista_id: barista_id,
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              attributes: [[Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount']],
              include: [{
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
            barista_id: barista_id,
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          attributes: [[Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount']],
          include: [{
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
            barista_id: barista_id,
            branch_id: branch,
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          attributes: [[Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount']],
          include: [{
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }])
          }]
        });
      }
    }
  }]);

  return BaristaRepository;
}();

module.exports.baristaRepository = new BaristaRepository();