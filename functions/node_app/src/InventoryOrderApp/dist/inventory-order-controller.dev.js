"use strict";

var _require = require('./inventory-order-repository'),
    inventoryOrderRepository = _require.inventoryOrderRepository;

var _require2 = require('../Settings-app/settings-repository'),
    settingsRepository = _require2.settingsRepository;

var moment = require('moment');

var _require3 = require("./createInvoice"),
    createInvoice = _require3.createInvoice;

var _require4 = require('../../Utils/constants'),
    constants = _require4.constants;

var _require5 = require('../Inventory-report/inventory-report-model'),
    InventoryReportModel = _require5.InventoryReportModel;

var _require6 = require('./inventory-order-model'),
    InventoryOrderModel = _require6.InventoryOrderModel;

var _require7 = require('../Inventory-report/inventory-report-repository'),
    InventoryReportRepository = _require7.InventoryReportRepository;

module.exports.add_order = function _callee(req, res, _) {
  var _req$body, device_id, ordered_by, number_of_products, comment_by_barista, ordered_items, requestObj;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, device_id = _req$body.device_id, ordered_by = _req$body.ordered_by, number_of_products = _req$body.number_of_products, comment_by_barista = _req$body.comment_by_barista, ordered_items = _req$body.ordered_items;
          requestObj = Object();
          console.log("guru", ordered_items.length);

          if (ordered_items.length > 0) {
            inventoryOrderRepository.get_branchInfo(device_id).then(function (branch) {
              if (branch) {
                requestObj.order_date = moment();
                requestObj.ordered_branch = branch._id;
                requestObj.received_by = null;
                requestObj.ordered_by = ordered_by;
                requestObj.delivery_date = null;
                requestObj.number_of_products = number_of_products;
                requestObj.status = "pending";
                requestObj.comment_by_barista = comment_by_barista;
                requestObj.admin_msg = null;
                requestObj.ordered_items = JSON.stringify(ordered_items);
                inventoryOrderRepository.createOrder(requestObj).then(function (info) {
                  res.api(200, "inventory order placed successfully", info, true);
                });
              } else {
                res.api(404, "IPAD Not registered to branch", null, false);
              }
            });
          } else {
            res.api(200, "please select products to order", null, true);
          }

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.get_orders = function _callee2(req, res, _) {
  var _req$body2, id, device_id, response;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, id = _req$body2.id, device_id = _req$body2.device_id;
          console.log(req.body);
          response = new Object();

          if (device_id) {
            inventoryOrderRepository.get_branchInfo(device_id).then(function (branch_info) {
              if (branch_info) {
                var inventories = [];
                inventoryOrderRepository.get_branch_orders(branch_info._id).then(function (order_details) {
                  inventoryOrderRepository.get_inventories(null).then(function (inventories_list) {
                    inventories_list.forEach(function (element) {
                      if (element.available_branches.includes(branch_info._id)) {
                        inventories.push(element);
                      }
                    });
                    inventoryOrderRepository.get_branch_orders_not_delivered(branch_info._id).then(function (list) {
                      var order_parsable = JSON.parse(JSON.stringify(order_details));
                      var remaining = JSON.parse(JSON.stringify(list));
                      var total = order_parsable.concat(remaining);
                      response.order_details = total;
                      response.inventories_list = inventories;
                      res.api(200, "orders for your branch are retrived successfully", response, true);
                    });
                  });
                });
              } else {
                res.api(200, "IPAD Not registered to Branch", null, false);
              }
            });
          } else {
            inventoryOrderRepository.getInventoryOrders(id).then(function (order_details) {
              // let details = JSON.parse(JSON.stringify(order_details))
              // details.forEach(element => {
              //     if (element.status == "declained") {
              //         element.status = "declined"
              //     }
              // });
              res.api(200, "orders retrived successfully", {
                order_details: order_details
              }, true);
            });
          }

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.reorder = function _callee3(req, res, _) {
  var _req$body3, data, id, branch_list, admin_msg, number_of_products, record, index, branch_id, requestObj;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body3 = req.body, data = _req$body3.data, id = _req$body3.id, branch_list = _req$body3.branch_list, admin_msg = _req$body3.admin_msg, number_of_products = _req$body3.number_of_products;

          if (!(id != null && id != undefined && id != "")) {
            _context3.next = 10;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(InventoryOrderModel.update({
            ordered_items: JSON.stringify(data)
          }, {
            where: {
              _id: id
            }
          }));

        case 4:
          _context3.next = 6;
          return regeneratorRuntime.awrap(InventoryOrderModel.findOne({
            where: {
              _id: id
            }
          }));

        case 6:
          record = _context3.sent;
          res.api(200, "order updated successfully", {
            order_details: record
          }, true);
          _context3.next = 31;
          break;

        case 10:
          index = 0;

        case 11:
          if (!(index < branch_list.length)) {
            _context3.next = 30;
            break;
          }

          branch_id = branch_list[index];
          requestObj = Object();
          requestObj.order_date = moment();
          requestObj.ordered_branch = branch_id;
          requestObj.received_by = null;
          requestObj.ordered_by = null;
          requestObj.delivery_date = null;
          requestObj.number_of_products = number_of_products;
          requestObj.status = "pending";
          requestObj.comment_by_barista = null;
          requestObj.admin_msg = admin_msg;
          requestObj.ordered_items = JSON.stringify(data);
          console.log(data);
          _context3.next = 27;
          return regeneratorRuntime.awrap(inventoryOrderRepository.createOrder(requestObj));

        case 27:
          index++;
          _context3.next = 11;
          break;

        case 30:
          return _context3.abrupt("return", res.api(200, "inventory order placed successfully", null, true));

        case 31:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.update_order = function _callee4(req, res, _) {
  var record, branch_id, lastrecord_inv_report;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          if (req.body.ordered_items) {
            if (req.body.ordered_items.length == 0) {
              res.api(200, "please select the products to place order", null, true);
              res.end();
            }

            req.body.ordered_items = JSON.stringify(req.body.ordered_items);
          }

          if (req.body.status == "delivered") {
            req.body.delivery_date = moment();
          }

          _context4.next = 4;
          return regeneratorRuntime.awrap(InventoryOrderModel.findOne({
            where: {
              _id: req.body.id
            }
          }));

        case 4:
          record = _context4.sent;
          branch_id = record.ordered_branch;
          _context4.next = 8;
          return regeneratorRuntime.awrap(InventoryReportModel.findAll({
            where: {
              branch_id: branch_id,
              is_deleted: false
            },
            order: [["createdAt", "DESC"]],
            limit: 1
          }));

        case 8:
          lastrecord_inv_report = _context4.sent;
          current_espresso_orders_count = 0;
          record.ordered_items.forEach(function (element) {
            if (element.inventory_name.toLowerCase() == 'espresso') {
              current_espresso_orders_count += element.qty;
            }
          });
          inventory_record_unupdated = lastrecord_inv_report.length > 0 && lastrecord_inv_report[0].final_remaining == -1 && lastrecord_inv_report[0].total_consumption == -1;
          inventory_unupdated_id = lastrecord_inv_report.length > 0 ? lastrecord_inv_report[0]._id : null;
          inventoryOrderRepository.updateOrder(req.body).then(function (update_success) {
            if (req.body.status == "delivered") {
              var request = new Object();
              var inv_report_request = new Object();
              request.date_of_transaction = moment();
              request.type = "inventory-order";
              request.barista_id = req.body.received_by;
              request.iva_id = req.body.iva_id;
              request.mode_of_payment = req.body.mode_of_payment;
              request.invoice_number = req.body.invoice_number;
              var index = 0;
              console.log("order_id", JSON.parse(req.body.ordered_items));
              var order_list = JSON.parse(req.body.ordered_items);
              order_list.forEach(function (inventory) {
                request.reason = inventory.refernce + "-" + inventory.inventory_name;
                request.total_amount = Number(inventory.price) != null ? Number(inventory.price) : 0;
                inventoryOrderRepository.createTxn(request).then(function (txn) {
                  index += 1;
                  console.log("index", index, "length", req.body.ordered_items.length);

                  if (index == order_list.length) {
                    var date = lastrecord_inv_report.length > 0 ? lastrecord_inv_report[0].createdAt : null;
                    inv_report_request.created_date = moment();
                    inv_report_request.date_of_week = moment();
                    InventoryReportRepository.get_report(branch_id).then(function (reports) {
                      InventoryReportRepository.get_last_week_orders(branch_id, date).then(function (order_list) {
                        var weekly_shipped = 0;
                        order_list.forEach(function (element) {
                          element.ordered_items.forEach(function (element_item) {
                            if (element_item.inventory_name.toLowerCase() == 'espresso') {
                              weekly_shipped += element_item.qty;
                            }
                          });
                        });
                        inv_report_request.weekly_shipped = weekly_shipped; // weeekly shipped

                        inv_report_request.quantity_at_week_start = reports.length > 0 ? Number(reports[0].final_remaining) + Number(inv_report_request.weekly_shipped) : Number(inv_report_request.weekly_shipped); // week start

                        inv_report_request.final_remaining = -1; // final remaining

                        inv_report_request.total_consumption = -1;
                        inv_report_request.branch_id = branch_id;

                        if (inventory_record_unupdated) {
                          InventoryReportModel.update({
                            weekly_shipped: lastrecord_inv_report[0].weekly_shipped + current_espresso_orders_count,
                            quantity_at_week_start: lastrecord_inv_report[0].quantity_at_week_start + current_espresso_orders_count
                          }, {
                            where: {
                              _id: inventory_unupdated_id
                            }
                          }).then(function (result) {
                            return res.api(200, "updated successfully", null, true);
                          });
                        } else {
                          if (weekly_shipped > 0) {
                            InventoryReportRepository.create_report(inv_report_request).then(function (result) {
                              return res.api(200, "updated successfully", null, true);
                            });
                          } else {
                            return res.api(200, "updated successfully", null, true);
                          }
                        }
                      });
                    });
                  }
                });
              });
            } else {
              update_success[0] > 0 ? res.api(200, "updated successfully", null, true) : res.api(404, "no orders found", null, false);
            }
          });

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.delete_order = function _callee5(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          id = req.body.id;
          inventoryOrderRepository.deleteOrder(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "order info deleted successfully", null, true) : res.api(404, "No order found", null, false);
          });

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.get_brach_orders = function (req, res, _) {
  var _req$body4 = req.body,
      branch_id = _req$body4.branch_id,
      start = _req$body4.start,
      end = _req$body4.end; //done

  if (start != undefined && end != undefined && branch_id != undefined) {
    inventoryOrderRepository.get_branches_and_dates(branch_id, start, end).then(function (order_details) {
      res.api(200, "orders retrived successfully", {
        order_details: order_details
      }, true);
    });
  } else if (start != undefined && branch_id != undefined && end == undefined) {
    inventoryOrderRepository.get_branches_and_StartDate(branch_id, start).then(function (order_details) {
      res.api(200, "orders retrived successfully", {
        order_details: order_details
      }, true);
    });
  } //done
  else if (start == undefined && end == undefined && branch_id != undefined) {
      console.log("branch only");
      inventoryOrderRepository.get_branch_orders(branch_id).then(function (order_details) {
        res.api(200, "orders retrived successfully", {
          order_details: order_details
        }, true);
      });
    } //done
    else if (start != undefined && end != undefined && branch_id == undefined) {
        console.log("date only");
        inventoryOrderRepository.get_date_orders(start, end).then(function (order_details) {
          res.api(200, "orders retrived successfully", {
            order_details: order_details
          }, true);
        });
      } //single date only
      else if (start != undefined && end == undefined && branch_id == undefined) {
          inventoryOrderRepository.get_orders_only_with_start_date(start).then(function (order_details) {
            res.api(200, "orders retrived successfully", {
              order_details: order_details
            }, true);
          });
        }
};

module.exports.printOrder = function _callee6(req, res, _) {
  var invoice, _req$body5, orderInfo, products, settings, date, os, title;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          invoice = {
            logo: "./assets/logos/logo1616657787.png",
            establishment: "Syra Coffee S.L",
            branch: "Bercelona",
            company_email: "syra.sharafa@gmail.com",
            address: "Carrer Ample, 46 - Barcelona, Spain",
            order_ref: "ADEF",
            date: "20/3/2020 05:35 AM",
            subtotal: 48,
            order_by: "Mahermansour",
            client: {
              email: "guru@waioz.com"
            },
            items: [{
              product_name: "Espresso",
              quantity: 2,
              total_price: 24
            }, {
              product_name: "Falooda",
              quantity: 1,
              total_price: 24
            }],
            discount: 10,
            admin_msg: "",
            user_message: ""
          };
          _req$body5 = req.body, orderInfo = _req$body5.orderInfo, products = _req$body5.products;
          _context6.next = 4;
          return regeneratorRuntime.awrap(settingsRepository.getAllSettings());

        case 4:
          settings = _context6.sent;
          console.log(orderInfo);
          invoice.client.email = orderInfo.ordered_by_details != null ? orderInfo.ordered_by_details.barista_name : "ADMIN";
          invoice.items = orderInfo.ordered_items;
          invoice.admin_msg = orderInfo.admin_msg || "NO Comments";
          invoice.user_message = orderInfo.comment_by_barista;
          invoice.branch = orderInfo.branch_info.branch_name;
          invoice.order_ref = orderInfo._id.substring(orderInfo._id.length - 4).toUpperCase();
          invoice.date = orderInfo.created_date;
          invoice.status = orderInfo.status.toUpperCase();
          invoice.received_by = orderInfo.recieved_by_details == null ? "NA" : orderInfo.recieved_by_details.barista_name;
          settings.forEach(function (element) {
            switch (element.code) {
              case "logo":
                // invoice.logo = "./assets/logos/" + element.value
                break;

              case "Nombre del establecimiento":
                invoice.establishment = element.value;
                break;

              case "Email":
                invoice.company_email = element.value;
                break;

              case "Direccion":
                invoice.address = element.value;
                break;

              default:
                break;
            }
          });
          date = moment().format('X');
          os = require('os');
          title = invoice.branch.replace(/ /g, '').toUpperCase() + "_INVENTORY-REPORT_" + moment(orderInfo.createdAt).format("DD-MM-YYYY");
          _context6.next = 21;
          return regeneratorRuntime.awrap(createInvoice(invoice, os.tmpdir() + "/" + title + ".pdf"));

        case 21:
          return _context6.abrupt("return", res.api(200, "records retrived successfully", {
            url: constants.HOST + "assets/reciepts/" + title + ".pdf",
            title: title
          }, true));

        case 22:
        case "end":
          return _context6.stop();
      }
    }
  });
};