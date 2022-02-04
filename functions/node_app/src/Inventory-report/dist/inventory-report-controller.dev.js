"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require('./inventory-report-repository'),
    InventoryReportRepository = _require.InventoryReportRepository;

var moment = require('moment');

var _require2 = require('process'),
    report = _require2.report;

var _require3 = require('./inventory-report-model'),
    InventoryReportModel = _require3.InventoryReportModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var _require4 = require('../../Utils/constants'),
    constants = _require4.constants;

module.exports.add_order = function _callee(req, res, _) {
  var _req$body, device_id, final_remaining, branch, record, total_consumption, data_to_pass;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, device_id = _req$body.device_id, final_remaining = _req$body.final_remaining; // let request = new Object()

          _context.next = 3;
          return regeneratorRuntime.awrap(InventoryReportRepository.get_branchInfo(device_id));

        case 3:
          branch = _context.sent;

          if (!branch) {
            _context.next = 21;
            break;
          }

          _context.next = 7;
          return regeneratorRuntime.awrap(InventoryReportModel.findAll({
            // change record to lastrecord in case if you change the c ode as previous
            where: {
              branch_id: branch._id,
              is_deleted: false
            },
            order: [["createdAt", "DESC"]],
            limit: 1
          }));

        case 7:
          record = _context.sent;
          total_consumption = record.length > 0 ? record[0].quantity_at_week_start - final_remaining : 0;

          if (!(total_consumption < 0)) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.api(200, "Your remaining is greater than the totalstock you have!", null, true));

        case 13:
          _context.next = 15;
          return regeneratorRuntime.awrap(InventoryReportModel.update({
            final_remaining: final_remaining,
            total_consumption: total_consumption,
            createdAt: moment().toDate()
          }, {
            where: {
              _id: record.length > 0 ? record[0]._id : ""
            }
          }));

        case 15:
          _context.next = 17;
          return regeneratorRuntime.awrap(InventoryReportModel.findOne({
            where: {
              _id: record.length > 0 ? record[0]._id : ""
            }
          }));

        case 17:
          data_to_pass = _context.sent;
          res.api(200, "report generated successfully", data_to_pass, true); // let date = lastrecord.length == 0 ? null : lastrecord[0].createdAt
          // console.log(date)
          // InventoryReportRepository.get_last_week_orders(branch._id, date).then(order_list => {
          //     let weekly_shipped = 0
          //     console.log(JSON.parse(JSON.stringify(order_list)))
          //     order_list.forEach(element => {
          //         console.log(JSON.parse(JSON.stringify(element)))
          //         element.ordered_items.forEach(element_item => {
          //             if (element_item.inventory_name.toLowerCase() == 'espresso') {
          //                 weekly_shipped += element_item.qty
          //             }
          //         });
          //     });
          //     request.weekly_shipped = weekly_shipped // weeekly shipped
          //     InventoryReportRepository.get_report(branch._id).then(reports => {
          //         request.quantity_at_week_start = (reports.length > 0) ? Number(reports[0].final_remaining) + Number(request.weekly_shipped) : Number(request.weekly_shipped) // week start
          //         request.final_remaining = Number(final_remaining) // final remaining
          //         request.total_consumption = request.quantity_at_week_start - request.final_remaining // total consumption
          //         if (request.total_consumption >= 0) {
          //             InventoryReportRepository.create_report(request).then(result => {
          //                 res.api(200, "report generated successfully", result, true)
          //             })
          //         }
          //         else {
          //             res.api(200, "Invalid remaining Value", null, true)
          //         }
          //     })
          // })

          _context.next = 22;
          break;

        case 21:
          res.api(200, "IPAD Not registered to Branch", null, false);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.get_orders = function _callee2(req, res, _) {
  var _req$body2, branch_id, device_id, branch, reports, reportJSON;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, branch_id = _req$body2.branch_id, device_id = _req$body2.device_id;

          if (!device_id) {
            _context2.next = 12;
            break;
          }

          _context2.next = 4;
          return regeneratorRuntime.awrap(InventoryReportRepository.get_branchInfo(device_id));

        case 4:
          branch = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(InventoryReportRepository.get_report_limit(branch._id, 10));

        case 7:
          reports = _context2.sent;
          reportJSON = JSON.parse(JSON.stringify(reports)); // un comment while testflight
          // for (let index = 0; index < reportJSON.length; index++) {
          //     var element = reportJSON[index];
          //     element.total_stock = Number(element.quantity_at_week_start).toFixed(2)
          //     element.weekly_shipped = Number(element.weekly_shipped).toFixed(2)
          //     element.quantity_at_week_start = (Number(element.quantity_at_week_start) - Number(element.weekly_shipped)).toFixed(2)
          //     element.final_remaining = element.final_remaining == -1 ? "-" : Number(element.final_remaining).toFixed(2)
          //     element.total_consumption = element.total_consumption == -1 ? "-" : Number(element.total_consumption).toFixed(2)
          //     reportJSON[index] = element
          //     //created Date manuplation
          //     if (reportJSON[index].final_remaining != -1) {
          //         if (index == reportJSON.length - 1) {
          //             reportJSON[index].created_date = moment(reportJSON[index].date_of_week).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM")
          //         }
          //         else {
          //             reportJSON[index].created_date = moment(reportJSON[index + 1].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM")
          //         }
          //     }
          //     else {
          //         if (index == reportJSON.length - 1) {
          //             reportJSON[index].created_date = moment(reportJSON[index].date_of_week).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM")
          //         }
          //         else {
          //             reportJSON[index].created_date = moment(reportJSON[index + 1].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - "
          //         }
          //     }
          // }

          return _context2.abrupt("return", res.api(200, "Reports retrived", reportJSON, true));

        case 12:
          // let request = new Object()
          // let lastrecord = await InventoryReportModel.findAll({
          //     where: { branch_id: branch_id }, order: [
          //         ["createdAt", "DESC"]
          //     ], limit: 1
          // })
          // let date = lastrecord.length == 0 ? null : lastrecord[0].createdAt
          // console.log(date)
          // request.created_date = moment().format("DD/MM/YYYY")
          InventoryReportRepository.get_report(branch_id).then(function (reports) {
            // InventoryReportRepository.get_last_week_orders(branch_id, date).then(order_list => {
            //     let weekly_shipped = 0
            //     console.log(JSON.parse(JSON.stringify(order_list)))
            //     order_list.forEach(element => {
            //         console.log(JSON.parse(JSON.stringify(element)))
            //         element.ordered_items.forEach(element_item => {
            //             if (element_item.inventory_name.toLowerCase() == 'espresso') {
            //                 weekly_shipped += element_item.qty
            //             }
            //         });
            //     });
            //     request.weekly_shipped = weekly_shipped // weeekly shipped
            //     request.quantity_at_week_start = (reports.length > 0) ? Number(reports[0].final_remaining) + Number(request.weekly_shipped) : Number(request.weekly_shipped) // week start
            //     request.final_remaining = "-" // final remaining
            //     request.total_consumption = "-"
            //     let data = JSON.parse(JSON.stringify(reports))
            //     data.unshift(request)
            //     res.api(200, "Reports retrived",data, true)
            // })
            var reportJSON = JSON.parse(JSON.stringify(reports));

            for (var index = 0; index < reportJSON.length; index++) {
              if (reportJSON[index].final_remaining != -1) {
                if (index == reportJSON.length - 1) {
                  reportJSON[index].created_date = moment(reportJSON[index].date_of_week).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm");
                } else {
                  reportJSON[index].created_date = moment(reportJSON[index + 1].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm");
                }
              } else {
                if (index == reportJSON.length - 1) {
                  reportJSON[index].created_date = moment(reportJSON[index].date_of_week).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm");
                } else {
                  reportJSON[index].created_date = moment(reportJSON[index + 1].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - ";
                }
              }
            }

            res.api(200, "Reports retrived", reportJSON, true);
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.filter_reports = function _callee3(req, res, _) {
  var _req$body3, selected_date, branch_id;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, selected_date = _req$body3.selected_date, branch_id = _req$body3.branch_id;

          if (selected_date.start && selected_date.end) {
            InventoryReportRepository.filter_with_start_and_end(selected_date.start, selected_date.end, branch_id).then(function (reports) {
              res.api(200, "Reports retrived", reports, true);
            });
          } else {
            InventoryReportRepository.filter_with_start(selected_date.start, branch_id).then(function (reports) {
              res.api(200, "Reports retrived", reports, true);
            });
          }

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.update = function _callee4(req, res, _) {
  var data, request, current_report, upcommingReports, element, request_next_update;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(InventoryReportModel.findOne({
            where: {
              _id: req.body._id
            }
          }));

        case 2:
          data = _context4.sent;
          console.log(req.body);

          if (!(req.body.final_remaining < 0)) {
            _context4.next = 8;
            break;
          }

          return _context4.abrupt("return", res.api(200, "Invalid remaining Value", {}, false));

        case 8:
          if (!(req.body.final_remaining > data.quantity_at_week_start)) {
            _context4.next = 12;
            break;
          }

          return _context4.abrupt("return", res.api(200, "Remaining cannot exceed total quantity!", {}, false));

        case 12:
          if (data.final_remaining != -1) {
            request = {
              weekly_shipped: Number(req.body.weekly_shipping),
              quantity_at_week_start: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping),
              final_remaining: Number(req.body.final_remaining),
              total_consumption: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping) - Number(req.body.final_remaining)
            };
          } else {
            console.log(data);

            if (req.body.final_remaining != null && req.body.final_remaining != undefined) {
              request = {
                weekly_shipped: Number(req.body.weekly_shipping),
                quantity_at_week_start: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping),
                final_remaining: Number(req.body.final_remaining),
                total_consumption: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping) - Number(req.body.final_remaining)
              };
            } else {
              request = {
                weekly_shipped: Number(req.body.weekly_shipping),
                quantity_at_week_start: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping)
              };
            }
          } // console.log(request, data)


          _context4.next = 15;
          return regeneratorRuntime.awrap(InventoryReportModel.update(request, {
            where: {
              _id: req.body._id
            }
          }));

        case 15:
          _context4.next = 17;
          return regeneratorRuntime.awrap(InventoryReportModel.findOne({
            where: {
              _id: req.body._id
            }
          }));

        case 17:
          current_report = _context4.sent;

          if (!(current_report.final_remaining != data.final_remaining)) {
            _context4.next = 28;
            break;
          }

          _context4.next = 21;
          return regeneratorRuntime.awrap(InventoryReportModel.findAll({
            where: {
              createdAt: _defineProperty({}, Op.gt, current_report.createdAt),
              branch_id: current_report.branch_id
            },
            order: [["date_of_week", "ASC"]],
            limit: 1
          }));

        case 21:
          upcommingReports = _context4.sent;

          if (!(upcommingReports.length > 0)) {
            _context4.next = 28;
            break;
          }

          element = upcommingReports[0];
          request_next_update = {
            weekly_shipped: Number(element.weekly_shipped),
            quantity_at_week_start: Number(element.weekly_shipped) + Number(current_report.final_remaining),
            final_remaining: Number(element.final_remaining),
            total_consumption: Number(element.weekly_shipped) + Number(current_report.final_remaining) - Number(element.final_remaining)
          };
          current_report.final_remaining = element.final_remaining;
          _context4.next = 28;
          return regeneratorRuntime.awrap(InventoryReportModel.update(request_next_update, {
            where: {
              _id: element._id
            }
          }));

        case 28:
          return _context4.abrupt("return", res.api(200, "Reports updated successfully", {}, true));

        case 29:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.deleteAct = function _callee5(req, res, _) {
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(InventoryReportModel.destroy({
            where: {
              _id: req.body._id
            }
          }));

        case 2:
          res.api(200, "Reports deleted successfully", null, true);

        case 3:
        case "end":
          return _context5.stop();
      }
    }
  });
};