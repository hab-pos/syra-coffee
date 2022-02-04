"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var _require = require("./orders-model"),
    OrdersModel = _require.OrdersModel,
    OrderedProductsModel = _require.OrderedProductsModel,
    TransactionInModel = _require.TransactionInModel,
    AppliedDiscountsModel = _require.AppliedDiscountsModel;

var _require2 = require("./orders-repository"),
    orderRepository = _require2.orderRepository;

var _require3 = require("../Branch-app/Branch-model"),
    BrancheModel = _require3.BrancheModel;

var _require4 = require("../BaristaApp/Barista-model"),
    BaristaModel = _require4.BaristaModel;

var _require5 = require("./orders-model"),
    CashFlowModel = _require5.CashFlowModel;

var _require6 = require("../Inventory-report/inventory-report-model"),
    InventoryReportModel = _require6.InventoryReportModel;

var _require7 = require("../User_App/User-model"),
    UserOrdersModel = _require7.UserOrdersModel,
    UserModel = _require7.UserModel;

var _require8 = require("./createInvoice"),
    createInvoice = _require8.createInvoice;

var _require9 = require('../Settings-app/settings-repository'),
    settingsRepository = _require9.settingsRepository;

var _require10 = require('../SetupApp/setup-repository'),
    setupRepository = _require10.setupRepository;

var _require11 = require('../../Utils/constants'),
    constants = _require11.constants;

var _require12 = require("./reports-repository"),
    OrderReportRepository = _require12.OrderReportRepository;

var os = require('os');

var _ = require('lodash');

var moment = require('moment');

var nodemailer = require('nodemailer');

var _require13 = require("jimp"),
    threshold = _require13.threshold;

var _require14 = require("express"),
    response = _require14.response;

var _require15 = require("../SetupApp/setup-model"),
    IVAModel = _require15.IVAModel;

var admin = require('firebase-admin');

module.exports.add_order = function _callee(req, res, _) {
  var index, user;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          index = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id
            }
          }));

        case 3:
          user = _context.sent;
          orderRepository.get_branchInfo(req.body.device_id).then(function (branch) {
            if (branch) {
              var orderRequest = orderRepository.gatherOrderInput(req.body);
              orderRequest.branch_id = branch._id || null;
              console.log(orderRequest.price_data);
              orderRepository.create_order(orderRequest).then(function (order_info) {
                if (user != null) {
                  var beans_claimed = req.body.applied_beans != null && req.body.applied_beans != undefined ? orderRequest.total_price * 10 - Number(req.body.applied_beans) : orderRequest.total_price * 10;
                  var beans_earned = Number(user.beansEarnerd) <= 0 || Number(user.beansEarnerd) + Number(beans_claimed) <= 0 ? 0 : Number(user.beansEarnerd) + Number(beans_claimed);
                  UserModel.update({
                    beansEarnerd: beans_earned.toFixed(0)
                  }, {
                    where: {
                      _id: user._id
                    }
                  }); //update applied beans functionality
                }

                orderRepository.createInTransaction(order_info._id, orderRequest.time_elapsed, orderRequest.barista_id, orderRequest.order_status, orderRequest.total_price, orderRequest.branch_id, orderRequest.payment_method); //insert Applied Coupon

                if (orderRequest.discount_id && orderRequest.discount_data) {
                  orderRepository.create_applied_discounts(order_info._id, orderRequest.discount_id, orderRequest.barista_id, Number(order_info.total_price) - Number(order_info.total_price_with_out_tax)).then(function () {
                    orderRequest.products_data.forEach(function (product) {
                      orderRepository.createOrderedProduct(orderRequest.date_of_order, order_info._id, product._id, product.category_id, product.iva, product.quantity, product.total_price, orderRequest.payment_method, orderRequest.branch_id).then(function () {
                        index += 1;

                        if (index == orderRequest.products_data.length) {
                          res.api(200, "saved successfully", order_info, true);
                        }
                      });
                    });
                  });
                } else {
                  orderRequest.products_data.forEach(function (product) {
                    orderRepository.createOrderedProduct(orderRequest.date_of_order, order_info._id, product._id, product.category_id, product.iva, product.quantity, product.total_price, orderRequest.payment_method, orderRequest.branch_id).then(function () {
                      index += 1;

                      if (product.have_discount == 1) {
                        var discountAmt = 0;

                        if (product.discount_type == "percent") {
                          discountAmt = Number(product.price) * Number(product.discount_price) / 100;
                        } else {
                          discountAmt = product.discount_price;
                        }

                        orderRepository.create_applied_discounts(order_info._id, product.discount_id, orderRequest.barista_id, discountAmt);
                      }

                      if (index == orderRequest.products_data.length) {
                        res.api(200, "saved successfully", order_info, true);
                      }
                    });
                  });
                }
              });
            } else {
              res.api(200, "IPAD is not registerd to any Branches", null, false);
            }
          });

        case 5:
        case "end":
          return _context.stop();
      }
    }
  });
};

var invoice = {
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
  branch: "Bercelona",
  order_ref: "A-043",
  date: "20/3/2020 05:35 AM",
  subtotal: 48,
  company_name: "",
  nif: "",
  discount: 10,
  logo: "./assets/logos/logo1616657787.png",
  establishment: "Syra Coffee S.L",
  company_email: "syra.sharafa@gmail.com",
  address: "Carrer Ample, 46 - Barcelona, Spain",
  admin_msg: ""
};

module.exports.sendMail = function _callee2(req, res, next) {
  var _req$body, email, order_id, device_id, branch, order, settings, id, os, title, transporter, mailOptions;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, email = _req$body.email, order_id = _req$body.order_id, device_id = _req$body.device_id;
          _context2.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_branchInfo(device_id));

        case 3:
          branch = _context2.sent;
          _context2.next = 6;
          return regeneratorRuntime.awrap(orderRepository.get_orders(order_id));

        case 6:
          order = _context2.sent;
          _context2.next = 9;
          return regeneratorRuntime.awrap(settingsRepository.getAllSettings());

        case 9:
          settings = _context2.sent;
          _context2.next = 12;
          return regeneratorRuntime.awrap(TransactionInModel.findOne({
            where: {
              order_id: order_id
            }
          }));

        case 12:
          id = _context2.sent;
          console.log(id);
          invoice.client.email = email;
          invoice.items = order.products_data;
          console.log(order.products_data);
          settings.forEach(function (element) {
            switch (element.code) {
              case "logo":
                invoice.logo = "./assets/logos/logo.png";
                break;

              case "Nombre del establecimiento":
                invoice.establishment = element.value;
                break;

              case "Nombre del la sociedad":
                invoice.company_name = element.value;
                break;

              case "Code NIF":
                invoice.nif = element.value;
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
          invoice.admin_message = "¡Hola! Gracias por venir a Syra Coffee. Si desea una factura, no dude en \n escribirnos a info@syra.coffee con una foto de su recibo y sus datos de facturación y se \n la enviaremos lo antes posible. ¡Gracias!";
          invoice.branch = branch.branch_name;
          invoice.order_ref = id._id;
          invoice.date = moment().format("DD/MM/YYYY hh:mm a");
          invoice.subtotal = order.price_data.total_price_with_iva;
          invoice.discount = (Number(order.price_data.total_price_with_iva) - Number(order.price_data.total_payable)).toFixed(2);
          console.log("data", invoice);
          os = require('os');
          title = "F" + invoice.order_ref + "_" + moment().format("DD-MM-YYYY") + "_SYRA-COFFEE";
          _context2.next = 29;
          return regeneratorRuntime.awrap(createInvoice(invoice, os.tmpdir() + "/" + title + ".pdf"));

        case 29:
          transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: 'facturas@syra.coffee',
              pass: 'qnbjgmwtxlkmezaa'
            }
          });
          mailOptions = {
            from: 'facturas@syra.coffee',
            to: req.body.email,
            subject: 'Your Receipt From Syra Coffee',
            text: "Thank you for visiting us today, hope to see you again soon! \n\nYou can also visit our online store www.syra.coffee for a wider selection of equipement and coffee - it's free and next-day delivery for orders placed before 15H00.\n\nHave a fantastice day!\n\nSyra Coffee Team.",
            attachments: [{
              filename: title + '.pdf',
              path: os.tmpdir() + "/" + title + ".pdf",
              contentType: 'application/pdf'
            }]
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.api(200, "cannot send Mail", error, false);
            }

            res.api(200, "Email sent", null, true);
          });

        case 32:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.get_orders = function _callee3(req, res, _) {
  var _req$body2, id, device_id, status, branch_info, last, discount, cashFlow, openTime, reference, order_list;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _req$body2 = req.body, id = _req$body2.id, device_id = _req$body2.device_id, status = _req$body2.status;

          if (!(device_id || status)) {
            _context3.next = 23;
            break;
          }

          _context3.next = 4;
          return regeneratorRuntime.awrap(orderRepository.get_branchInfo(device_id));

        case 4:
          branch_info = _context3.sent;
          _context3.next = 7;
          return regeneratorRuntime.awrap(orderRepository.get_last_record(branch_info._id));

        case 7:
          last = _context3.sent;
          console.log(last.reference);
          _context3.next = 11;
          return regeneratorRuntime.awrap(setupRepository.get_Discounts());

        case 11:
          discount = _context3.sent;
          console.log(branch_info);

          if (!branch_info) {
            _context3.next = 20;
            break;
          }

          _context3.next = 16;
          return regeneratorRuntime.awrap(CashFlowModel.findAll({
            where: {
              branch_id: branch_info._id,
              close_time: null
            },
            order: [["createdAt", "DESC"]],
            limit: 1
          }));

        case 16:
          cashFlow = _context3.sent;

          if (cashFlow.length > 0) {
            openTime = moment(cashFlow[0].open_time);
            orderRepository.get_orders(id, branch_info._id, status, openTime).then(function (order_list) {
              var reference = orderRepository.generate_reference(last.length > 0 ? last[0].reference : null);
              res.api(200, "orders retrived successfully", {
                order_list: order_list,
                reference: reference,
                discount: discount
              }, true);
            });
          } else {
            reference = orderRepository.generate_reference(last.length > 0 ? last[0].reference : null);
            res.api(200, "orders retrived successfully", {
              order_list: [],
              reference: reference,
              discount: discount
            }, true);
          }

          _context3.next = 21;
          break;

        case 20:
          res.api(200, "IPAD is not registerd to any Branches", null, false);

        case 21:
          _context3.next = 34;
          break;

        case 23:
          if (!id) {
            _context3.next = 29;
            break;
          }

          _context3.next = 26;
          return regeneratorRuntime.awrap(OrdersModel.findOne({
            where: {
              _id: id
            },
            include: [{
              model: BrancheModel,
              as: "branch_info"
            }, {
              model: BaristaModel,
              as: "barista_info"
            }]
          }));

        case 26:
          _context3.t0 = _context3.sent;
          _context3.next = 32;
          break;

        case 29:
          _context3.next = 31;
          return regeneratorRuntime.awrap(OrdersModel.findAll({
            include: [{
              model: BrancheModel,
              as: "branch_info"
            }, {
              model: BaristaModel,
              as: "barista_info"
            }]
          }));

        case 31:
          _context3.t0 = _context3.sent;

        case 32:
          order_list = _context3.t0;
          res.api(200, "orders retrived successfully", order_list, true);

        case 34:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.update_order = function _callee4(req, res, _) {
  var _req$body3, id, status, cancel_reason, order, user_order, user;

  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, id = _req$body3.id, status = _req$body3.status, cancel_reason = _req$body3.cancel_reason;
          _context4.next = 3;
          return regeneratorRuntime.awrap(OrdersModel.findOne({
            where: {
              _id: id
            }
          }));

        case 3:
          order = _context4.sent;
          _context4.next = 6;
          return regeneratorRuntime.awrap(UserOrdersModel.findOne({
            where: {
              _id: order.invoice_number
            }
          }));

        case 6:
          user_order = _context4.sent;
          _context4.next = 9;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: order.user_id
            }
          }));

        case 9:
          user = _context4.sent;
          orderRepository.update_order_staus(id, status, cancel_reason).then(function (update_success) {
            if (order.user_id != null) {
              var beans_claimed = order.total_price * 10;
              var beansEarnerd = Number(user.beansEarnerd) - Number(beans_claimed);
              UserModel.update({
                beansEarnerd: beansEarnerd <= 0 ? 0 : beansEarnerd
              }, {
                where: {
                  _id: user._id
                }
              });
            }

            if (order.Payment_method == "APP") {
              UserOrdersModel.update({
                order_status: "closed"
              }, {
                where: {
                  _id: user_order._id
                }
              }).then(function (success) {
                var db = admin.database();
                var ref = db.ref("/socket_table");
                ref.child(order.user_id).set({
                  order_id: user_order._id
                });
                return success[0] > 0 ? res.api(200, "updated successfully", null, true) : res.api(404, "no orders found", null, false);
              });
            } else {
              return update_success[0] > 0 ? res.api(200, "updated successfully", null, true) : res.api(404, "no orders found", null, false);
            }
          });

        case 11:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.change_payment_method = function _callee5(req, res, _) {
  var _req$body4, id, Payment_method, invoice_number;

  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body4 = req.body, id = _req$body4.id, Payment_method = _req$body4.Payment_method, invoice_number = _req$body4.invoice_number;
          orderRepository.change_payment_method(id, Payment_method, invoice_number).then(function (update_success) {
            update_success[0] > 0 ? res.api(200, "updated successfully", null, true) : res.api(404, "no orders found", null, false);
          });

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports.applyPOSBeans = function _callee6(req, res, _) {
  var total_bean_needed, total_amount, user, discount_price, total_price;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          console.log(req.body);
          total_bean_needed = req.body.products_data.map(function (item) {
            return Number(item.beanValue || 0);
          }).reduce(function (prev, curr) {
            return prev + curr;
          }, 0);
          total_amount = req.body.products_data.map(function (item) {
            return Number(item.total_price);
          }).reduce(function (prev, curr) {
            return prev + curr;
          }, 0);
          _context6.next = 5;
          return regeneratorRuntime.awrap(UserModel.findOne({
            where: {
              _id: req.body.user_id
            }
          }));

        case 5:
          user = _context6.sent;
          console.log(total_bean_needed, Number(req.body.bean_entered), total_bean_needed < req.body.bean_entered);

          if (user.beansEarnerd < Number(req.body.bean_entered)) {
            res.api(200, "User has only " + user.beansEarnerd, req.body, false);
          } else if (req.body.bean_entered < total_bean_needed) {
            res.api(200, "User should use " + total_bean_needed + " beans to proceed", req.body, false);
          } else {
            discount_price = Number(req.body.bean_entered) / 10 >= total_amount ? total_amount : total_bean_needed / 10;
            total_price = total_amount - discount_price;
            console.log({
              discount_price: discount_price,
              total_price: total_price
            });
            res.api(200, "Applied successfully", {
              "bean_earned": total_price * 10,
              discount_price: "-" + discount_price.toFixed(2) + "€",
              total_price: total_price.toFixed(2) + "€"
            }, true);
          }

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
};

module.exports.getTransactions = function _callee7(req, res, _) {
  var branch_id;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          branch_id = req.body.branch_id;
          orderRepository.get_transactions(branch_id).then(function (transactions) {
            res.api(200, "orders retrived successfully", transactions, true);
          });

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
};

module.exports.filterAPI = function _callee8(req, res, _) {
  var _req$body5, branch, dates;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _req$body5 = req.body, branch = _req$body5.branch, dates = _req$body5.dates;

          if (dates) {
            if (dates.start != null && dates.end != null) {
              if (branch != null) {
                orderRepository.filter_with_start_end_branch(dates.start, dates.end, branch).then(function (transaction) {
                  res.api(200, "transaction retrived successfully", transaction, true);
                });
              } else {
                orderRepository.filter_with_start_and_end(dates.start, dates.end).then(function (transaction) {
                  res.api(200, "transaction retrived successfully", transaction, true);
                });
              }
            } else {
              if (branch != null) {
                orderRepository.filter_with_start_branch(dates.start, branch).then(function (transaction) {
                  res.api(200, "transaction retrived successfully", transaction, true);
                });
              } else {
                orderRepository.filter_with_start(dates.start).then(function (transaction) {
                  res.api(200, "transaction retrived successfully", transaction, true);
                });
              }
            }
          } else if (branch == null && dates == null) {
            orderRepository.get_transactions(null).then(function (transaction) {
              res.api(200, "transaction retrived successfully", transaction, true);
            });
          } else {
            orderRepository.get_branch_wise_txn(branch).then(function (txns) {
              return res.api(200, "transaction retrived successfully", txns, true);
            });
          }

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  });
};

module.exports.get_vat_report = function _callee9(req, res, next) {
  var _req$body6, dates, branch, current_month_orders, response, iva_grouped, _i, _Object$entries, _Object$entries$_i, key, value, cummulative_amt_with_tax, cummulative_amt_without_tax, tax, item;

  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _req$body6 = req.body, dates = _req$body6.dates, branch = _req$body6.branch;
          _context9.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_vat_report_last_month(dates || null, branch || null));

        case 3:
          current_month_orders = _context9.sent;
          response = [];
          iva_grouped = _.groupBy(current_month_orders, function (order) {
            return Number(order.iva_info.iva_percent);
          });

          for (_i = 0, _Object$entries = Object.entries(iva_grouped); _i < _Object$entries.length; _i++) {
            _Object$entries$_i = _slicedToArray(_Object$entries[_i], 2), key = _Object$entries$_i[0], value = _Object$entries$_i[1];
            cummulative_amt_with_tax = 0;
            cummulative_amt_without_tax = 0;
            value.forEach(function (element) {
              cummulative_amt_with_tax += Number(element.price);
              cummulative_amt_without_tax += element.price_without_iva;
            });
            tax = cummulative_amt_with_tax - cummulative_amt_without_tax;
            item = {
              tax_percent: Number(key).toFixed(2),
              tax_amount: tax.toFixed(2),
              total_without_tax: cummulative_amt_without_tax.toFixed(2),
              total_with_tax: cummulative_amt_with_tax.toFixed(2),
              color: value[0].iva_info.color
            };
            response.push(item);
          }

          return _context9.abrupt("return", res.api(200, "records retrived successfully", response, true));

        case 8:
        case "end":
          return _context9.stop();
      }
    }
  });
};

module.exports.get_payout_report = function _callee10(req, res, next) {
  var _req$body7, dates, branch, current_month_orders, total_price;

  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _req$body7 = req.body, dates = _req$body7.dates, branch = _req$body7.branch;
          _context10.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_payout_report_last_month(dates || null, branch || null));

        case 3:
          current_month_orders = _context10.sent;
          _context10.next = 6;
          return regeneratorRuntime.awrap(orderRepository.getTxnAmount(dates || null, branch || null));

        case 6:
          total_price = _context10.sent;
          return _context10.abrupt("return", res.api(200, "records retrived successfully", {
            list: current_month_orders,
            entiremount: total_price
          }, true));

        case 8:
        case "end":
          return _context10.stop();
      }
    }
  });
};

module.exports.open_cash = function _callee11(req, res, next) {
  var _req$body8, device_id, open_balence, barista_id, branch, _response;

  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _req$body8 = req.body, device_id = _req$body8.device_id, open_balence = _req$body8.open_balence, barista_id = _req$body8.barista_id;
          _context11.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_branchInfo(device_id));

        case 3:
          branch = _context11.sent;

          if (!branch._id) {
            _context11.next = 11;
            break;
          }

          _context11.next = 7;
          return regeneratorRuntime.awrap(CashFlowModel.create({
            open_time: moment(),
            open_balance: open_balence || 0.00,
            branch_id: branch._id,
            barista_id: barista_id
          }));

        case 7:
          _response = _context11.sent;
          return _context11.abrupt("return", res.api(200, "Data read successfully", _response, true));

        case 11:
          res.api(200, "IPAD is not registerd to any Branches", null, false);

        case 12:
        case "end":
          return _context11.stop();
      }
    }
  });
};

module.exports.close_cash = function _callee12(req, res, next) {
  var _req$body9, id, today_income_cash, today_expense_cash, close_balance, device_id, branch, today, record, close_time, _response2, _close_time, _response3;

  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _req$body9 = req.body, id = _req$body9.id, today_income_cash = _req$body9.today_income_cash, today_expense_cash = _req$body9.today_expense_cash, close_balance = _req$body9.close_balance, device_id = _req$body9.device_id;
          _context12.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_branchInfo(device_id));

        case 3:
          branch = _context12.sent;

          if (!branch._id) {
            _context12.next = 29;
            break;
          }

          today = moment().format("dddd").toLowerCase();
          console.log(branch.espresso_report_date, today);

          if (!branch.espresso_report_date.includes(today)) {
            _context12.next = 22;
            break;
          }

          _context12.next = 10;
          return regeneratorRuntime.awrap(InventoryReportModel.findOne({
            where: {
              branch_id: branch._id,
              final_remaining: -1,
              total_consumption: -1
            }
          }));

        case 10:
          record = _context12.sent;

          if (!record) {
            _context12.next = 15;
            break;
          }

          return _context12.abrupt("return", res.api(200, "Please report the espresso count before closing cash!", null, false));

        case 15:
          close_time = moment().toDate();
          _context12.next = 18;
          return regeneratorRuntime.awrap(CashFlowModel.update({
            today_income_cash: today_income_cash,
            today_expense_cash: today_expense_cash,
            close_balance: close_balance,
            close_time: close_time
          }, {
            where: {
              _id: id
            }
          }));

        case 18:
          _response2 = _context12.sent;
          return _context12.abrupt("return", res.api(200, "Data read successfully", _response2, true));

        case 20:
          _context12.next = 27;
          break;

        case 22:
          _close_time = moment().toDate();
          _context12.next = 25;
          return regeneratorRuntime.awrap(CashFlowModel.update({
            today_income_cash: today_income_cash,
            today_expense_cash: today_expense_cash,
            close_balance: close_balance,
            close_time: _close_time
          }, {
            where: {
              _id: id
            }
          }));

        case 25:
          _response3 = _context12.sent;
          return _context12.abrupt("return", res.api(200, "Data read successfully", _response3, true));

        case 27:
          _context12.next = 30;
          break;

        case 29:
          res.api(200, "IPAD is not registerd to any Branches", null, false);

        case 30:
        case "end":
          return _context12.stop();
      }
    }
  });
};

module.exports.get_flow = function _callee13(req, res, next) {
  var _req$body10, device_id, open_time, branch, in_flow, out_flow;

  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _req$body10 = req.body, device_id = _req$body10.device_id, open_time = _req$body10.open_time;
          _context13.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_branchInfo(device_id));

        case 3:
          branch = _context13.sent;

          if (!branch) {
            _context13.next = 15;
            break;
          }

          _context13.next = 7;
          return regeneratorRuntime.awrap(orderRepository.getInflow(branch._id, open_time));

        case 7:
          in_flow = _context13.sent;
          _context13.next = 10;
          return regeneratorRuntime.awrap(orderRepository.getOutflow(branch._id, open_time));

        case 10:
          out_flow = _context13.sent;
          console.log({
            in_flow: in_flow,
            out_flow: out_flow
          });
          return _context13.abrupt("return", res.api(200, "records retrived successfully", {
            in_flow: in_flow,
            out_flow: out_flow
          }, true));

        case 15:
          return _context13.abrupt("return", res.api(200, "IPAD Not registered", null, false));

        case 16:
        case "end":
          return _context13.stop();
      }
    }
  });
};

module.exports.getDiscountsGrouped = function _callee14(req, res, next) {
  var _req$body11, branch, dates, response;

  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _req$body11 = req.body, branch = _req$body11.branch, dates = _req$body11.dates;
          console.log(req.body, "for check");
          _context14.next = 4;
          return regeneratorRuntime.awrap(orderRepository.get_discounts_grouped(branch, dates));

        case 4:
          response = _context14.sent;
          return _context14.abrupt("return", res.api(200, "records retrived successfully", response, true));

        case 6:
        case "end":
          return _context14.stop();
      }
    }
  });
};

module.exports.getDicountBaristaGrouped = function _callee15(req, res, next) {
  var _req$body12, branch, dates, response;

  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _req$body12 = req.body, branch = _req$body12.branch, dates = _req$body12.dates;
          _context15.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_discounts_grouped_barista(branch, dates));

        case 3:
          response = _context15.sent;
          return _context15.abrupt("return", res.api(200, "records retrived successfully", response, true));

        case 5:
        case "end":
          return _context15.stop();
      }
    }
  });
};

module.exports.get_discounts_report = function _callee16(req, res, next) {
  var _req$body13, branch, dates, response;

  return regeneratorRuntime.async(function _callee16$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _req$body13 = req.body, branch = _req$body13.branch, dates = _req$body13.dates;
          _context16.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_discounts_report(branch, dates));

        case 3:
          response = _context16.sent;
          return _context16.abrupt("return", res.api(200, "records retrived successfully", response, true));

        case 5:
        case "end":
          return _context16.stop();
      }
    }
  });
};

module.exports.get_comparision = function _callee17(req, res, next) {
  var _req$body14, branch, dates, lastMonth, thisMonth, stmt, percent, change, _change;

  return regeneratorRuntime.async(function _callee17$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _req$body14 = req.body, branch = _req$body14.branch, dates = _req$body14.dates;
          _context17.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_last_moth_discount_report_total(branch, dates));

        case 3:
          _context17.t0 = _context17.sent[0].getDataValue("total_discount");

          if (_context17.t0) {
            _context17.next = 6;
            break;
          }

          _context17.t0 = 0.00;

        case 6:
          lastMonth = _context17.t0;
          _context17.next = 9;
          return regeneratorRuntime.awrap(orderRepository.get_this_moth_discount_report_total(branch, dates));

        case 9:
          _context17.t1 = _context17.sent[0].getDataValue("total_discount");

          if (_context17.t1) {
            _context17.next = 12;
            break;
          }

          _context17.t1 = 0.00;

        case 12:
          thisMonth = _context17.t1;
          stmt = lastMonth > thisMonth ? "LOSS" : "PROFIT";
          percent = 0;

          if (stmt == "PROFIT") {
            change = thisMonth - lastMonth;
            percent = change / thisMonth * 100;
          } else {
            _change = lastMonth - thisMonth;
            percent = _change / lastMonth * 100;
          }

          return _context17.abrupt("return", res.api(200, "records retrived successfully", {
            lastMonth: lastMonth,
            thisMonth: thisMonth,
            percent: percent,
            stmt: stmt
          }, true));

        case 17:
        case "end":
          return _context17.stop();
      }
    }
  });
};

module.exports.generateAccountPDF = function _callee18(req, res, next) {
  var total_price, get_price, _req$body15, branch, dates, iva_report, cash_report, total_cost, email, _require16, transactionOutRepository, blist, current_month_orders, _response4, iva_grouped, _i2, _Object$entries2, _Object$entries2$_i, key, value, cummulative_amt_with_tax, cummulative_amt_without_tax, tax, item, current_month_orders_list, total, data, grouped, response, _i3, _Object$entries3, _Object$entries3$_i, key_mode, _value, reason_grouped, _i4, _Object$entries4, _Object$entries4$_i, key_reason, _value2, _item, total_expense_count, pgTitle, transporter, start, end, mailOptions;

  return regeneratorRuntime.async(function _callee18$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          get_price = function _ref(value) {
            var price = 0;
            value.forEach(function (element) {
              price += Number(element.total_amount.replace(',', '.'));
            });
            total_price += price;
            return price;
          };

          total_price = 0;
          _req$body15 = req.body, branch = _req$body15.branch, dates = _req$body15.dates, iva_report = _req$body15.iva_report, cash_report = _req$body15.cash_report, total_cost = _req$body15.total_cost, email = _req$body15.email;
          _require16 = require("../Transaction-outApp/transaction-out-repository"), transactionOutRepository = _require16.transactionOutRepository;
          blist = null;

          if (branch) {
            blist = branch.map(function (element) {
              return element._id;
            });
          }

          if (!(iva_report == null && cash_report == null)) {
            _context18.next = 22;
            break;
          }

          _context18.next = 9;
          return regeneratorRuntime.awrap(orderRepository.get_vat_report_last_month(dates, blist));

        case 9:
          current_month_orders = _context18.sent;
          _response4 = [];
          iva_grouped = _.groupBy(current_month_orders, function (order) {
            return Number(order.iva_info.iva_percent);
          });

          for (_i2 = 0, _Object$entries2 = Object.entries(iva_grouped); _i2 < _Object$entries2.length; _i2++) {
            _Object$entries2$_i = _slicedToArray(_Object$entries2[_i2], 2), key = _Object$entries2$_i[0], value = _Object$entries2$_i[1];
            cummulative_amt_with_tax = 0;
            cummulative_amt_without_tax = 0;
            value.forEach(function (element) {
              cummulative_amt_with_tax += Number(element.price);
              cummulative_amt_without_tax += element.price_without_iva;
            });
            tax = cummulative_amt_with_tax - cummulative_amt_without_tax;
            item = {
              tax_percent: Number(key).toFixed(2),
              tax_amount: tax.toFixed(2),
              total_without_tax: cummulative_amt_without_tax.toFixed(2),
              total_with_tax: cummulative_amt_with_tax.toFixed(2),
              color: value[0].iva_info.color
            };

            _response4.push(item);
          }

          iva_report = _response4;
          _context18.next = 16;
          return regeneratorRuntime.awrap(orderRepository.get_payout_report_last_month(dates, blist));

        case 16:
          current_month_orders_list = _context18.sent;
          _context18.next = 19;
          return regeneratorRuntime.awrap(orderRepository.getTxnAmount(dates, blist));

        case 19:
          total = _context18.sent;
          cash_report = JSON.parse(JSON.stringify(current_month_orders_list));
          total_cost = total.getDataValue("EntireTxnThisMonth"); //return res.api(200, "records retrived successfully", {iva_report,total_price,cash_report }, true)

        case 22:
          data = new Object();

          if (!branch) {
            _context18.next = 29;
            break;
          }

          _context18.next = 26;
          return regeneratorRuntime.awrap(transactionOutRepository.filterHelper(blist, dates));

        case 26:
          data = _context18.sent;
          _context18.next = 32;
          break;

        case 29:
          _context18.next = 31;
          return regeneratorRuntime.awrap(transactionOutRepository.filterHelper(null, dates));

        case 31:
          data = _context18.sent;

        case 32:
          // data = data.filter((data) => {
          //     return data.type != 'expense'
          // });
          grouped = _.groupBy(data, function (order) {
            return order.mode_of_payment;
          });
          response = [];

          for (_i3 = 0, _Object$entries3 = Object.entries(grouped); _i3 < _Object$entries3.length; _i3++) {
            _Object$entries3$_i = _slicedToArray(_Object$entries3[_i3], 2), key_mode = _Object$entries3$_i[0], _value = _Object$entries3$_i[1];
            reason_grouped = _.groupBy(_value, function (item) {
              return item.reason;
            });

            for (_i4 = 0, _Object$entries4 = Object.entries(reason_grouped); _i4 < _Object$entries4.length; _i4++) {
              _Object$entries4$_i = _slicedToArray(_Object$entries4[_i4], 2), key_reason = _Object$entries4$_i[0], _value2 = _Object$entries4$_i[1];
              _item = Object();
              _item.mode_of_payment = key_mode;
              _item.reason = key_reason;
              _item.count = _value2.length;
              _item.price = get_price(_value2).toFixed(2);
              _item.percent = 0.00;
              response.push(_item);
            }
          }

          console.log(total_price, "price_total");
          total_expense_count = 0;
          response.forEach(function (element) {
            element.percent = Number(element.price / total_price * 100).toFixed(2);
            total_expense_count += element.count;
          }); // return res.api(200, "records retrived successfully", response, true)

          _context18.next = 40;
          return regeneratorRuntime.awrap(createPdf(iva_report, branch, dates, cash_report, total_cost, response, total_price, total_expense_count));

        case 40:
          pgTitle = _context18.sent;
          console.log(email, "email", branch, "branch");

          if (!email) {
            _context18.next = 51;
            break;
          }

          transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
              user: 'facturas@syra.coffee',
              pass: 'qnbjgmwtxlkmezaa'
            }
          });
          branch_name = "All Branches";

          if (branch == null) {
            branch_name = "All Branches";
          } else {
            branch_name = branch.branch_name;
          }

          if (dates == null) {
            start = moment().utc().tz(constants.TIME_ZONE).startOf('day');
            end = moment().utc().tz(constants.TIME_ZONE).startOf('day');
          } else {
            if (dates.start != null & dates.end != null) {
              start = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day');
              end = moment(dates.end).utc().tz(constants.TIME_ZONE).startOf('day');
            } else {
              start = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day');
              end = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day');
            }
          }

          mailOptions = {
            from: 'facturas@syra.coffee',
            to: email,
            subject: 'Report',
            text: 'Here with we have attached a accounting report for the duration' + moment(start).format("DD/MM/YYYY") + " to " + moment(end).format("DD/MM/YYYY") + " for " + branch_name,
            attachments: [{
              filename: pgTitle + '.pdf',
              path: os.tmpdir() + '/report.pdf',
              contentType: 'application/pdf'
            }]
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.api(200, "cannot send Mail", error, false);
            }

            res.api(200, "Email sent", null, true);
          });
          _context18.next = 52;
          break;

        case 51:
          return _context18.abrupt("return", res.api(200, "records retrived successfully", {
            url: constants.HOST + "assets/reports/report.pdf",
            title: pgTitle
          }, true));

        case 52:
        case "end":
          return _context18.stop();
      }
    }
  });
};

module.exports.getGlobalSales = function _callee19(req, res, next) {
  var get_sum, get_sum_totalAmt, _req$body16, dates, branch, sales, previous, sales_sorted, previous_sales_sorted, sum_this_month, sum_last_month, sales_sorted_new, previous_sales_sorted_new;

  return regeneratorRuntime.async(function _callee19$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          get_sum_totalAmt = function _ref3(array) {
            var sum = 0;
            array.forEach(function (element) {
              sum += Number(element.total_amount);
            });
            console.log(sum);
            return sum;
          };

          get_sum = function _ref2(array) {
            var sum = 0;
            array.forEach(function (element) {
              sum += element.amount;
            });
            return sum;
          };

          _req$body16 = req.body, dates = _req$body16.dates, branch = _req$body16.branch;
          _context19.next = 5;
          return regeneratorRuntime.awrap(orderRepository.getGlobalSales(dates, branch));

        case 5:
          sales = _context19.sent;
          _context19.next = 8;
          return regeneratorRuntime.awrap(orderRepository.getGlobalSalesPrevious(dates, branch));

        case 8:
          previous = _context19.sent;

          if (dates != null && dates.start != null && dates.end != null) {
            console.log(dates, "suceess");

            if (dates.start == dates.end) {
              sales_sorted = _(sales).groupBy("hour").map(function (sale, date) {
                return {
                  hour: date.split(':')[0],
                  amount: get_sum_totalAmt(sale)
                };
              });
            } else {
              sales_sorted = _(sales).groupBy("date_of_transaction").map(function (sale, date) {
                return {
                  hour: moment(date, 'DD/MM/YYYY').format('DD/MM'),
                  amount: get_sum_totalAmt(sale)
                };
              });
            }
          } else {
            sales_sorted = _(sales).groupBy("hour").map(function (sale, date) {
              return {
                hour: date.split(':')[0],
                amount: get_sum_totalAmt(sale)
              };
            });
          }

          if (dates != null && dates.start != null && dates.end != null) {
            if (dates.start == dates.end) {
              previous_sales_sorted = _(previous).groupBy("hour").map(function (sale, date) {
                return {
                  hour: date.split(':')[0],
                  amount: get_sum_totalAmt(sale)
                };
              });
            } else {
              previous_sales_sorted = _(previous).groupBy("date_of_transaction").map(function (sale, date) {
                return {
                  hour: moment(date, 'DD/MM/YYYY').format('DD/MM'),
                  amount: get_sum_totalAmt(sale)
                };
              });
            }
          } else {
            previous_sales_sorted = _(previous).groupBy("hour").map(function (sale, date) {
              return {
                hour: date.split(':')[0],
                amount: get_sum_totalAmt(sale)
              };
            });
          }

          sum_this_month = get_sum(sales_sorted);
          sum_last_month = get_sum(previous_sales_sorted);
          sales_sorted = _(sales_sorted).groupBy("hour").map(function (sale, date) {
            return {
              hour: date.split(':')[0],
              amount: get_sum(sale)
            };
          });
          previous_sales_sorted = _(previous_sales_sorted).groupBy("hour").map(function (sale, date) {
            return {
              hour: date.split(':')[0],
              amount: get_sum(sale)
            };
          });
          console.log(sales_sorted);
          sales_sorted_new = _.sortBy(JSON.parse(JSON.stringify(sales_sorted)), [function (o) {
            return o.hour;
          }]);
          previous_sales_sorted_new = _.sortBy(JSON.parse(JSON.stringify(previous_sales_sorted)), [function (o) {
            return o.hour;
          }]);
          res.api(200, "retrived successfully", {
            sales_sorted: sales_sorted_new,
            previous_sales_sorted: previous_sales_sorted_new,
            sum_this_month: sum_this_month,
            sum_last_month: sum_last_month
          }, true);

        case 19:
        case "end":
          return _context19.stop();
      }
    }
  });
};

module.exports.CategoryOrdersFiltered = function _callee20(req, res, next) {
  var _req$body17, dates, branch, result, category_grouped, worst_categories, best_categories;

  return regeneratorRuntime.async(function _callee20$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _req$body17 = req.body, dates = _req$body17.dates, branch = _req$body17.branch;
          _context20.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_category_sales(dates, branch));

        case 3:
          result = _context20.sent;
          _context20.next = 6;
          return regeneratorRuntime.awrap(_(result).groupBy("category_id").map(function (category, key) {
            return {
              price_without_iva: _.sumBy(category, function (item) {
                return item.price_without_iva;
              }),
              price_with_iva: _.sumBy(category, function (item) {
                return Number(item.price);
              }),
              category_id: key,
              info: _(category).groupBy("branch_id").map(function (data, key) {
                return {
                  branch_id: key,
                  branch_name: data[0].branch_info.branch_name,
                  price_without_iva: _.sumBy(data, function (item) {
                    return item.price_without_iva;
                  }),
                  price_with_iva: _.sumBy(data, function (item) {
                    return Number(item.price);
                  }),
                  count: data.length
                };
              }),
              DateBased: _(category).groupBy("date_graph").map(function (data, key) {
                return {
                  time_slot: key,
                  price_without_iva: _.sumBy(data, function (item) {
                    return item.price_without_iva;
                  }),
                  price_with_iva: _.sumBy(data, function (item) {
                    return Number(item.price);
                  }),
                  count: data.length,
                  category_info: category.length > 0 ? category[0].category_info : null
                };
              }),
              HourBased: _(category).groupBy("hour_graph").map(function (data, key) {
                return {
                  time_slot: key,
                  price_without_iva: _.sumBy(data, function (item) {
                    return item.price_without_iva;
                  }),
                  price_with_iva: _.sumBy(data, function (item) {
                    return Number(item.price);
                  }),
                  count: data.length,
                  category_info: category.length > 0 ? category[0].category_info : null
                };
              }),
              category_info: category.length > 0 ? category[0].category_info : null,
              count: category.length
            };
          }).sortBy(function (obj) {
            return obj.price_without_iva;
          }));

        case 6:
          category_grouped = _context20.sent;
          console.log(JSON.parse(JSON.stringify(category_grouped)));
          worst_categories = JSON.parse(JSON.stringify(category_grouped.slice(0, 2)));
          best_categories = JSON.parse(JSON.stringify(category_grouped.slice(-2)));

          if (best_categories.length > 0) {
            best_categories[0].color = "#3f9f97";
            best_categories[best_categories.length - 1].color = "#8cbeba";
          }

          if (worst_categories.length > 0) {
            worst_categories[0].color = "#de7c84";
            worst_categories[worst_categories.length - 1].color = "#de7c64";
          }

          res.api(200, "data retrived successfully", {
            category_grouped: category_grouped,
            worst_categories: worst_categories,
            best_categories: best_categories.reverse()
          }, true);

        case 13:
        case "end":
          return _context20.stop();
      }
    }
  });
};

module.exports.ProductOrdersFiltered = function _callee21(req, res, next) {
  var _req$body18, dates, branch, result, product_grouped, worst_products, best_products;

  return regeneratorRuntime.async(function _callee21$(_context21) {
    while (1) {
      switch (_context21.prev = _context21.next) {
        case 0:
          _req$body18 = req.body, dates = _req$body18.dates, branch = _req$body18.branch;
          _context21.next = 3;
          return regeneratorRuntime.awrap(orderRepository.get_product_sales(dates, branch));

        case 3:
          result = _context21.sent;
          _context21.next = 6;
          return regeneratorRuntime.awrap(_(result).groupBy("product_id").map(function (product, key) {
            return {
              price_without_iva: _.sumBy(product, function (item) {
                return item.price_without_iva;
              }),
              price_with_iva: _.sumBy(product, function (item) {
                return Number(item.price);
              }),
              info: _(product).groupBy("branch_id").map(function (data, key) {
                return {
                  branch_id: key,
                  branch_name: data[0].branch_info.branch_name,
                  price_without_iva: _.sumBy(data, function (item) {
                    return item.price_without_iva;
                  }),
                  price_with_iva: _.sumBy(data, function (item) {
                    return Number(item.price);
                  }),
                  count: data.length
                };
              }),
              DateBased: _(product).groupBy("date_graph").map(function (data, key) {
                return {
                  time_slot: key,
                  price_without_iva: _.sumBy(data, function (item) {
                    return item.price_without_iva;
                  }),
                  price_with_iva: _.sumBy(data, function (item) {
                    return Number(item.price);
                  }),
                  count: data.length,
                  product_info: product.length > 0 ? product[0].product_info : null
                };
              }),
              HourBased: _(product).groupBy("hour_graph").map(function (data, key) {
                return {
                  time_slot: key,
                  price_without_iva: _.sumBy(data, function (item) {
                    return item.price_without_iva;
                  }),
                  price_with_iva: _.sumBy(data, function (item) {
                    return Number(item.price);
                  }),
                  count: data.length,
                  product_info: product.length > 0 ? product[0].product_info : null
                };
              }),
              product_id: key,
              product_info: product.length > 0 ? product[0].product_info : null,
              count: product.length
            };
          }).sortBy(function (obj) {
            return obj.price_without_iva;
          }));

        case 6:
          product_grouped = _context21.sent;
          worst_products = JSON.parse(JSON.stringify(product_grouped.slice(0, 2)));
          best_products = JSON.parse(JSON.stringify(product_grouped.slice(-2)));

          if (best_products.length > 0) {
            best_products[0].color = "#3f9f97";
            best_products[1].color = "#8cbeba";
          }

          if (worst_products.length > 0) {
            worst_products[0].color = "#de7c84";
            worst_products[1].color = "#de7c64";
          }

          res.api(200, "data retrived successfully", {
            product_grouped: product_grouped,
            worst_products: worst_products,
            best_products: best_products.reverse()
          }, true);

        case 12:
        case "end":
          return _context21.stop();
      }
    }
  });
};

module.exports.test = function _callee22(req, res, next) {
  var Sequelize, Op, data, index, orderItem, index_produt, product, discountAmt;
  return regeneratorRuntime.async(function _callee22$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          //     const {dates,branch} = req.body
          //     const Sequelize = require('sequelize');
          //     const Op = Sequelize.Op;
          //    let result = await OrderedProductsModel.findAll({where : {
          //     [Op.not]: [
          //         { price :  0},
          //       ]
          //    },include : [
          //     { model: OrdersModel, as: "order_info" },
          //     { model: IVAModel, as: "iva_info" },
          //    ]})
          //    for (let index_op = 0; index_op < result.length; index_op++) {
          //        const element_op = result[index_op];
          //        for (let index = 0; index < element_op.order_info.products_data.length; index++) {
          //            const element = element_op.order_info.products_data[index];
          //            if(element_op.product_id == element._id && element.have_discount == 1){
          //             await OrderedProductsModel.update({price : element.total_price},{where : {
          //                 "_id" : element_op._id,
          //             }})
          //         }
          //        }
          //    }
          //     res.api(200,"data retrived successfully",result,true)
          // const { dates, branch } = req.body
          // const Sequelize = require('sequelize');
          // const Op = Sequelize.Op;
          // let result = await AppliedDiscountsModel.findAll({
          //     where: {
          //         tota_discount_amount: 0,
          //     }, include: [
          //         { model: OrdersModel, as: "order_info" },
          //     ]
          // })
          // for (let index_op = 0; index_op < result.length; index_op++) {
          //     const element_op = result[index_op];
          //     for (let index = 0; index < element_op.order_info.products_data.length; index++) {
          //         const element = element_op.order_info.products_data[index];
          //         if (element.have_discount == 1) {
          //             let amt = 0
          //             if (element.discount_type == "euro") {
          //                 amt = element.discount_price
          //             }
          //             else {
          //                 amt = Number(element.price) * Number(element.discount_price) / 100
          //             }
          //             await AppliedDiscountsModel.update({ tota_discount_amount: amt }, {
          //                 where: {
          //                     "_id": element_op._id,
          //                 }
          //             })
          //         }
          //     }
          // }
          // res.api(200, "data retrived successfully", result, true)
          Sequelize = require('sequelize');
          Op = Sequelize.Op;
          _context22.next = 4;
          return regeneratorRuntime.awrap(OrdersModel.findAll({
            where: _defineProperty({
              createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment('21/04/2021', "DD/MM/YYYY").startOf('day')), _defineProperty({}, Op.lte, moment('21/04/2021', "DD/MM/YYYY").endOf('day'))]),
              branch_id: "d567d8a3-f154-4e00-af64-b903c28101d2"
            }, Op.not, [{
              order_status: "cancelled"
            }])
          }));

        case 4:
          data = _context22.sent;
          index = 0;

        case 6:
          if (!(index < data.length)) {
            _context22.next = 23;
            break;
          }

          orderItem = data[index];
          index_produt = 0;

        case 9:
          if (!(index_produt < orderItem.products_data.length)) {
            _context22.next = 20;
            break;
          }

          product = orderItem.products_data[index_produt];

          if (!(product.have_discount == 1)) {
            _context22.next = 17;
            break;
          }

          discountAmt = 0;

          if (product.discount_type == "percent") {
            discountAmt = Number(product.price) * Number(product.discount_price) / 100;
          } else {
            discountAmt = product.discount_price;
          }

          console.log(discountAmt);
          _context22.next = 17;
          return regeneratorRuntime.awrap(AppliedDiscountsModel.create({
            order_id: orderItem._id,
            discount_id: product.discount_id,
            barista_id: orderItem.barista_id,
            tota_discount_amount: discountAmt,
            createdAt: moment('21/04/2021 15:30:55', "DD/MM/YYYY HH:mm:ss"),
            updatedAt: moment('21/04/2021 15:30:55', "DD/MM/YYYY HH:mm:ss")
          }));

        case 17:
          index_produt++;
          _context22.next = 9;
          break;

        case 20:
          index++;
          _context22.next = 6;
          break;

        case 23:
          res.api(200, "data retrived successfully", data.length, true);

        case 24:
        case "end":
          return _context22.stop();
      }
    }
  });
};

module.exports.getDashBoard = function _callee23(req, res, next) {
  var _req$body19, dates, branch, billingInfo_current, billing_info_current_json, billingInfo_last, billing_info_last_json, report, report_last, expense, expense_last;

  return regeneratorRuntime.async(function _callee23$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _req$body19 = req.body, dates = _req$body19.dates, branch = _req$body19.branch; //this month

          _context23.next = 3;
          return regeneratorRuntime.awrap(OrderReportRepository.getTotalBillings(dates, branch));

        case 3:
          billingInfo_current = _context23.sent;
          billing_info_current_json = JSON.parse(JSON.stringify(billingInfo_current[0]));
          billing_info_current_json.avgTkt = Number(billing_info_current_json.total_amount) / Number(billing_info_current_json.count); //lastMonth

          _context23.next = 8;
          return regeneratorRuntime.awrap(OrderReportRepository.lastWeekDashboardReport(dates, branch));

        case 8:
          billingInfo_last = _context23.sent;
          billing_info_last_json = JSON.parse(JSON.stringify(billingInfo_last[0]));
          billing_info_last_json.avgTkt = Number(billing_info_last_json.total_amount) / Number(billing_info_last_json.count); //branch_base_report

          _context23.next = 13;
          return regeneratorRuntime.awrap(OrderReportRepository.get_branch_wise_report(dates, branch));

        case 13:
          report = _context23.sent;
          _context23.next = 16;
          return regeneratorRuntime.awrap(OrderReportRepository.lastWeekBranchReport(dates, branch));

        case 16:
          report_last = _context23.sent;
          _context23.next = 19;
          return regeneratorRuntime.awrap(OrderReportRepository.get_branch_wise_expense_report(dates, branch));

        case 19:
          expense = _context23.sent;
          _context23.next = 22;
          return regeneratorRuntime.awrap(OrderReportRepository.lastWeekBranchExpenseReport(dates, branch));

        case 22:
          expense_last = _context23.sent;
          res.api(200, "data retrived successfully", {
            billing_info_current_json: billing_info_current_json,
            billing_info_last_json: billing_info_last_json,
            report: report,
            report_last: report_last,
            expense: expense,
            expense_last: expense_last
          }, true);

        case 24:
        case "end":
          return _context23.stop();
      }
    }
  });
};

module.exports.GetBranchGraph = function _callee24(req, res, next) {
  var _req$body20, dates, branch, result, graphData;

  return regeneratorRuntime.async(function _callee24$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          _req$body20 = req.body, dates = _req$body20.dates, branch = _req$body20.branch;
          _context24.next = 3;
          return regeneratorRuntime.awrap(OrderReportRepository.get_branch_wise_report_graph(dates, branch));

        case 3:
          result = _context24.sent;
          _context24.next = 6;
          return regeneratorRuntime.awrap(_(result).groupBy("branch_id").map(function (branch_based, key) {
            return {
              total_price: _.sumBy(branch_based, function (item) {
                return Number(item.total_amount);
              }),
              branch_id: key,
              DateBased: _(branch_based).groupBy("date_graph").map(function (data, key) {
                return {
                  time_slot: key,
                  total_price: _.sumBy(data, function (item) {
                    return Number(item.total_amount);
                  }),
                  count: data.length,
                  branch_info: branch_based.length > 0 ? branch_based[0].branch_info : null
                };
              }),
              HourBased: _(branch_based).groupBy("hour_graph").map(function (data, key) {
                return {
                  time_slot: key,
                  total_price: _.sumBy(data, function (item) {
                    return Number(item.total_amount);
                  }),
                  count: data.length,
                  branch_info: branch_based.length > 0 ? branch_based[0].branch_info : null
                };
              }),
              branch_info: branch_based.length > 0 ? branch_based[0].branch_info : null,
              count: branch_based.length
            };
          }));

        case 6:
          graphData = _context24.sent;
          res.api(200, "data retrived successfully", graphData, true);

        case 8:
        case "end":
          return _context24.stop();
      }
    }
  });
};

module.exports.getTotalBillingsGraph = function _callee25(req, res, next) {
  var _req$body21, dates, branch, result, DateBased, HourBased;

  return regeneratorRuntime.async(function _callee25$(_context25) {
    while (1) {
      switch (_context25.prev = _context25.next) {
        case 0:
          _req$body21 = req.body, dates = _req$body21.dates, branch = _req$body21.branch;
          _context25.next = 3;
          return regeneratorRuntime.awrap(OrderReportRepository.getTotalBillingsGraph(dates, branch));

        case 3:
          result = _context25.sent;
          DateBased = _(result).groupBy("date_graph").map(function (data, key) {
            return {
              time_slot: key,
              total_price: _.sumBy(data, function (item) {
                return Number(item.total_amount);
              }),
              count: data.length
            };
          }).sortBy(function (data) {
            return data.time_slot;
          });
          HourBased = _(result).groupBy("hour_graph").map(function (data, key) {
            return {
              time_slot: key,
              total_price: _.sumBy(data, function (item) {
                return Number(item.total_amount);
              }),
              count: data.length
            };
          }).sortBy(function (data) {
            return data.time_slot;
          });
          res.api(200, "data retrived successfully", {
            DateBased: DateBased,
            HourBased: HourBased
          }, true);

        case 7:
        case "end":
          return _context25.stop();
      }
    }
  });
};

module.exports.updateDateHour = function _callee26(req, res, next) {
  var data;
  return regeneratorRuntime.async(function _callee26$(_context26) {
    while (1) {
      switch (_context26.prev = _context26.next) {
        case 0:
          console.log("success");
          _context26.next = 3;
          return regeneratorRuntime.awrap(OrderedProductsModel.findAll());

        case 3:
          data = _context26.sent;
          _context26.next = 6;
          return regeneratorRuntime.awrap(data.forEach(function (element) {
            OrderedProductsModel.update({
              hour_graph: moment(element.createdAt).utc().tz(constants.TIME_ZONE).format("HH")
            }, {
              where: {
                "_id": element._id
              }
            });
          }));

        case 6:
          res.api(200, "data retrived successfully", null, true);

        case 7:
        case "end":
          return _context26.stop();
      }
    }
  });
};

function createPdf(iva_report, branch, dates, cash_report, total_cost, expense, total_expense, total_expense_count) {
  var fs = require("fs");

  var PDFDocument = require("pdfkit");

  var doc = new PDFDocument();
  var docBranch = "";
  var docDate = "";

  if (branch) {
    var b_list = branch.map(function (element) {
      return element.branch_name;
    });
    doc.fontSize(14.5).font('Helvetica-Bold').text("Syra Coffee - " + b_list.join(",") + "", 30, 30);
    docBranch = b_list.join(",");
  } else {
    doc.fontSize(14.5).font('Helvetica-Bold').text("Syra Coffee - All Branches", 30, 30);
    docBranch = "All Branches";
  }

  if (dates == null) {
    doc.fontSize(11.5).font('Helvetica-Bold').text("Informe contable del " + moment().utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY"), 30, 60);
    docDate = moment().utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY");
  } else {
    if (dates.start != null && dates.end != null) {
      doc.fontSize(11.5).font('Helvetica-Bold').text("Informe contable del " + moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY") + "-" + moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day').format("DD-MM-YYYY"), 30, 60);
      docDate = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY") + "-TO-" + moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day').format("DD-MM-YYYY");
    } else {
      doc.fontSize(11.5).font('Helvetica-Bold').text("Informe contable del " + moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY"), 30, 60);
      docDate = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY");
    }
  }

  var docTile = docBranch.toUpperCase() + "_INFORME-CONTABLE_" + docDate;
  doc.fontSize(10).text("Informe de IVA", 30, 100);
  generateHr(doc, 100 + 20);
  position = 100 + 20;

  if (iva_report.length > 0) {
    position = loadIVA(doc, iva_report);
  } else {
    doc.fontSize(10).text("No Informe de IVA", 30, position + 15);
  }

  doc.fontSize(10).text("Informe de métodos de pago", 30, position + 45);
  generateHr(doc, position + 65);
  payout_position = position + 65;

  if (cash_report.length > 0) {
    payout_position = loadPayout(doc, cash_report, total_cost, position + 55);
  } else {
    doc.fontSize(10).text("Informe de métodos de pago", 30, position + 80);
  }

  doc.fontSize(10).text("Salida de caja", 30, payout_position + 45);
  generateHr(doc, payout_position + 65);

  if (expense.length > 0) {
    loadExpense(doc, expense, payout_position + 80, total_expense, total_expense_count);
  } else {
    doc.fontSize(10).text("No Salida de caja", 30, payout_position + 80);
  }

  var os = require('os');

  doc.pipe(fs.createWriteStream(os.tmpdir() + '/report.pdf'));
  doc.end();
  return docTile;
}

function loadExpense(doc, data, y, total_price, total_expense_count) {
  doc.fontSize(10).text("Motivo", 30, y, {
    width: 135,
    align: "left"
  }).text("Métodos de pago", 160, y).text("Número", 270, y, {
    width: 110,
    align: "left"
  }).text("Porcentaje", 360, y, {
    width: 125,
    align: "left"
  }).text("Cantidad", 490, y, {
    width: 130,
    align: "left"
  }); // let total_count = 0
  // let totalAmt = 0

  var temp = new Object();
  temp.reason = "Total";
  temp.mode_of_payment = "";
  temp.count = total_expense_count;
  temp.percent = "100.00";
  temp.price = total_price.toFixed(2);
  data.push(temp);
  doc.font('Helvetica');
  var position = 0;
  var thrasholdRow = 0;
  var another = 0;

  for (i = 0; i < data.length; i++) {
    var item = data[i];
    console.log(y + (i + 1) * 25, "actual");

    if (y + (i + 1) * 25 <= 710) {
      position = y + (i + 1) * 25;

      if (y + (i + 1) * 25 == 710) {
        thrasholdRow = i;
        console.log("threshold ==", thrasholdRow);
      }
    } else {
      console.log("differnce", i - thrasholdRow);

      if (i - thrasholdRow == 1) {
        position = 70 + (i - thrasholdRow) * 25;
        another = position - 25;
      } else {
        position = another + (i - thrasholdRow) * 25;
      }
    }

    if (i == data.length - 1) {
      doc.font('Helvetica-Bold');
    }

    doc.fontSize(10).text(item.reason, 30, position, {
      width: 135,
      align: "left"
    }).text(item.mode_of_payment.toUpperCase(), 160, position == 710 ? 70 : position).text(item.count, 270, position == 710 ? 70 : position, {
      width: 110,
      align: "left"
    }).text(item.percent + " %", 360, position == 710 ? 70 : position, {
      width: 125,
      align: "left"
    }).text(item.price + " €", 490, position == 710 ? 70 : position, {
      width: 130,
      align: "left"
    });
  }
}

function loadPayout(doc, cash_report, total_cost, y) {
  generateTableRow(doc, y + 25, "Métodos de pago", "", "Número", "Porcentaje de facturación", "Importe");
  doc.font('Helvetica');
  var total_count = 0;
  var totalAmt = 0;
  var position = 0;

  for (i = 0; i < cash_report.length; i++) {
    var item = cash_report[i];
    console.log(item, "At report trst");
    position = y + 25 + (i + 1) * 25;
    total_count += Number(item.count);
    totalAmt += Number(item.total_payable);
    generateTableRow(doc, position, item.Payment_method, "", item.count, (item.total_payable / total_cost * 100).toFixed(2) + " %", Number(item.total_payable).toFixed(2) + " €");
  }

  doc.font('Helvetica-Bold');
  generateTableRow(doc, position + 30, "TOTAL", "", total_count, "100.00 %", totalAmt.toFixed(2) + " €");
  return position + 30;
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(0.5).moveTo(30, y).lineTo(560, y).stroke();
}

function loadIVA(doc, iva_report) {
  console.log(iva_report);
  generateTableRow(doc, 130, "IVA", "TYPE", "IVA repercutido", "Facturación antes de impuestos", "Facturación después de impuestos");
  doc.font('Helvetica');
  var tot_tax = 0;
  var tot_amt_wo_tax = 0;
  var tot_amt_w_tax = 0;
  var top_of_content = 0;
  var position = 0;

  for (i = 0; i < iva_report.length; i++) {
    var item = iva_report[i];
    position = 140 + (i + 1) * 25;
    top_of_content += (i + 1) * 25;
    tot_tax += Number(item.tax_amount);
    tot_amt_wo_tax += Number(item.total_without_tax);
    tot_amt_w_tax += Number(item.total_with_tax);
    generateTableRow(doc, position, item.tax_percent + " %", i == parseInt(iva_report.length / 2) ? "SOLID" : "", item.tax_amount + " €", item.total_without_tax + " €", item.total_with_tax + " €");
  }

  doc.font('Helvetica-Bold');
  generateTableRow(doc, position + 30, "TOTAL", "", tot_tax.toFixed(2) + " €", tot_amt_wo_tax.toFixed(2) + " €", tot_amt_w_tax.toFixed(2) + " €");
  return position + 30;
}

function generateTableRow(doc, y, item, description, unitCost, quantity, lineTotal) {
  doc.fontSize(10).text(item, 30, y).text(description, 85, y).text(unitCost, 165, y, {
    width: 110,
    align: "left"
  }).text(quantity, 300, y, {
    width: 125,
    align: "left"
  }).text(lineTotal, 435, y, {
    width: 130,
    align: "left"
  });
}