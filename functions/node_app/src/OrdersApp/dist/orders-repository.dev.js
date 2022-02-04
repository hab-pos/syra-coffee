"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require("../BaristaApp/Barista-model"),
    BaristaModel = _require.BaristaModel;

var _require2 = require('../Branch-app/Branch-model'),
    BrancheModel = _require2.BrancheModel;

var _require3 = require("./orders-model"),
    OrdersModel = _require3.OrdersModel,
    AppliedDiscountsModel = _require3.AppliedDiscountsModel,
    OrderedProductsModel = _require3.OrderedProductsModel,
    TransactionInModel = _require3.TransactionInModel;

var _require4 = require("../ProductApp/product-model"),
    productsModel = _require4.productsModel;

var _require5 = require("../Category_app/category-model"),
    CategoryModel = _require5.CategoryModel;

var _require6 = require("../SetupApp/setup-model"),
    IVAModel = _require6.IVAModel,
    DiscountModel = _require6.DiscountModel;

var _require7 = require("../Transaction-outApp/transaction-out-model"),
    TransactionOutModel = _require7.TransactionOutModel;

var Sequelize = require('sequelize');

var Op = Sequelize.Op;

var moment = require('moment');

var sequential = require("sequential-ids");

var _require8 = require('../../Utils/constants'),
    constants = _require8.constants;

var OrderRepository =
/*#__PURE__*/
function () {
  function OrderRepository() {
    _classCallCheck(this, OrderRepository);
  }

  _createClass(OrderRepository, [{
    key: "get_branchInfo",
    value: function get_branchInfo(device_id) {
      return regeneratorRuntime.async(function get_branchInfo$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", BrancheModel.findOne({
                where: {
                  device_id: device_id
                },
                order: [["createdAt", "DESC"]]
              }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      });
    }
  }, {
    key: "update_order_staus",
    value: function update_order_staus(id, status) {
      var cancel_reason = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
      return OrdersModel.update({
        order_status: status,
        cancel_reason: cancel_reason
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "change_payment_method",
    value: function change_payment_method(id, Payment_method, invoice_number) {
      return OrdersModel.update({
        Payment_method: Payment_method,
        invoice_number: invoice_number
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "create_order",
    value: function create_order(request) {
      return OrdersModel.create({
        date_of_order: request.date_of_order,
        user_id: request.user_id,
        barista_id: request.barista_id,
        products_ids: request.products_ids.join(","),
        products_data: JSON.stringify(request.products_data),
        price_data: JSON.stringify(request.price_data),
        invoice_number: request.invoice_number,
        Payment_method: request.payment_method,
        discount_id: request.discount_id,
        discount_data: JSON.stringify(request.discount_data),
        order_status: request.order_status,
        total_price: request.total_price,
        total_price_with_out_tax: request.total_price_with_out_tax,
        branch_id: request.branch_id,
        reference: request.reference || ""
      });
    }
  }, {
    key: "generate_reference",
    value: function generate_reference(previous) {
      var generator = new sequential.Generator({
        digits: 3,
        letters: 1,
        restore: previous
      });
      return generator.generate();
    }
  }, {
    key: "get_orders",
    value: function get_orders(order_id, branch_id, status, openTime) {
      if (order_id) {
        return OrdersModel.findOne({
          where: {
            _id: order_id
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
        if (status) {
          if (status == "closed") {
            return OrdersModel.findAll({
              where: _defineProperty({
                branch_id: branch_id,
                createdAt: _defineProperty({}, Op.gte, openTime)
              }, Op.or, [{
                order_status: "closed"
              }, {
                order_status: "ongoing"
              }]),
              order: [["createdAt", "DESC"]],
              include: [{
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: BaristaModel,
                as: "barista_info"
              }]
            });
          } else {
            return OrdersModel.findAll({
              where: {
                branch_id: branch_id,
                order_status: status,
                createdAt: _defineProperty({}, Op.gte, openTime)
              },
              order: [["createdAt", "DESC"]],
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
          return OrdersModel.findAll({
            where: {
              branch_id: branch_id,
              createdAt: _defineProperty({}, Op.gte, openTime)
            },
            order: [["createdAt", "DESC"]],
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
    }
  }, {
    key: "create_applied_discounts",
    value: function create_applied_discounts(order_id, discount_id, barista_id, tota_discount_amount) {
      return AppliedDiscountsModel.create({
        order_id: order_id,
        discount_id: discount_id,
        barista_id: barista_id,
        tota_discount_amount: tota_discount_amount
      });
    }
  }, {
    key: "get_appliedDiscounts",
    value: function get_appliedDiscounts() {}
  }, {
    key: "createOrderedProduct",
    value: function createOrderedProduct(date, order_id, product_id, category_id, iva_id, quantity, price, payment_method, branch_id) {
      return OrderedProductsModel.create({
        date: moment().format("DD/MM/YYYY"),
        date_graph: moment().format("DD/MM"),
        hour_graph: moment().format("HH"),
        order_id: order_id,
        product_id: product_id,
        category_id: category_id,
        iva_id: iva_id,
        quantity: quantity,
        price: price,
        payment_method: payment_method,
        branch_id: branch_id
      });
    }
  }, {
    key: "createInTransaction",
    value: function createInTransaction(order_id, time_elapsed, barista_id, status, total_amount, branch_id, Payment_method) {
      TransactionInModel.create({
        order_id: order_id,
        time_elapsed: time_elapsed,
        barista_id: barista_id,
        status: status,
        total_amount: total_amount,
        branch_id: branch_id,
        Payment_method: Payment_method
      });
    }
  }, {
    key: "get_transactions",
    value: function get_transactions(branch_id) {
      return regeneratorRuntime.async(function get_transactions$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!branch_id) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt("return", TransactionInModel.findAll({
                where: {
                  branch_id: _defineProperty({}, Op["in"], branch_id),
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                order: [["createdAt", "DESC"]],
                include: [{
                  model: OrdersModel,
                  as: "order_info"
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }]
              }));

            case 4:
              return _context2.abrupt("return", TransactionInModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                order: [["createdAt", "DESC"]],
                include: [{
                  model: OrdersModel,
                  as: "order_info"
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }]
              }));

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      });
    }
  }, {
    key: "gatherPrice",
    value: function gatherPrice(products_data, discount_id, discount_data) {
      var price_details = [];
      var totalPriceWithoutIVA = 0;
      var totalPriceWithIVA = 0;
      var price_info = new Object();
      products_data.forEach(function (element) {
        var item = new Object();
        item._id = element._id;
        item.product_name = element.product_name;
        item.discount_id = element.discount_id;
        item.discount_name = element.discount_name;
        item.discount_price = element.discount_price;
        item.discount_type = element.discount_type;
        item.have_discount = element.have_discount;
        var discountAmt = 0.0;

        if (element.have_discount == 1) {
          if (element.discount_type == 'euro') {
            discountAmt = Number(element.discount_price);
          } else {
            discountAmt = Number(element.price) * Number(element.discount_price) / 100;
          }
        }

        var price = Number(element.quantity) * Number(element.price) - discountAmt;
        item.price = price.toFixed(2);
        totalPriceWithoutIVA += price - item.price * Number(element.iva_percent) / (100 + Number(element.iva_percent));
        totalPriceWithIVA += price;
        price_details.push(item);
      });
      price_info.price_data = price_details;
      price_info.total_price_with_iva = totalPriceWithIVA.toFixed(2);
      price_info.total_price_without_iva = totalPriceWithoutIVA.toFixed(2);
      var couponAmount = 0;
      var couponAmountWOTax = 0;

      if (discount_data != null && discount_id.length > 0 && discount_data.length > 0) {
        discount_data.forEach(function (element) {
          if (element.type == "euro") {
            couponAmount += element.amount * element.quantity;
            couponAmountWOTax += element.amount * element.quantity;
          } else {
            couponAmount += totalPriceWithIVA * Number(element.amount) / 100 * element.quantity;
            couponAmountWOTax += totalPriceWithoutIVA * Number(element.amount) / 100 * element.quantity;
          }
        });
      }

      console.log(couponAmount);
      price_info.total_payable = couponAmount <= totalPriceWithIVA ? (totalPriceWithIVA - Number(couponAmount)).toFixed(2) : totalPriceWithIVA.toFixed(2);
      price_info.total_pay_without_tax = couponAmount <= totalPriceWithoutIVA ? (totalPriceWithoutIVA - Number(couponAmountWOTax)).toFixed(2) : totalPriceWithoutIVA.toFixed(2);
      return price_info;
    }
  }, {
    key: "gatherOrderInput",
    value: function gatherOrderInput(bodyContent) {
      var user_id = bodyContent.user_id,
          barista_id = bodyContent.barista_id,
          products_ids = bodyContent.products_ids,
          invoice_number = bodyContent.invoice_number,
          Payment_method = bodyContent.Payment_method,
          discount_id = bodyContent.discount_id,
          order_status = bodyContent.order_status,
          products_data = bodyContent.products_data,
          discount_data = bodyContent.discount_data,
          time_elapsed = bodyContent.time_elapsed,
          reference = bodyContent.reference;
      var orderRequest = new Object();
      orderRequest.date_of_order = moment();
      orderRequest.user_id = user_id || null;
      orderRequest.barista_id = barista_id;
      orderRequest.reference = reference;
      orderRequest.products_ids = products_ids, orderRequest.products_data = products_data;
      orderRequest.invoice_number = invoice_number || "";
      orderRequest.payment_method = Payment_method || "CASH";
      orderRequest.discount_id = discount_id.join(",");
      orderRequest.discount_data = discount_data;
      orderRequest.price_data = this.gatherPrice(products_data, discount_id, discount_data);
      orderRequest.total_price = orderRequest.price_data.total_payable;
      orderRequest.total_price_with_out_tax = orderRequest.price_data.total_price_without_iva;
      orderRequest.order_status = order_status;
      orderRequest.time_elapsed = time_elapsed;
      return orderRequest;
    }
  }, {
    key: "get_branch_wise_txn",
    value: function get_branch_wise_txn(branch) {
      return TransactionInModel.findAll({
        where: {
          branch_id: _defineProperty({}, Op["in"], branch),
          createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
        },
        order: [["createdAt", "DESC"]],
        include: [{
          model: OrdersModel,
          as: "order_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filter_with_start_end_branch",
    value: function filter_with_start_end_branch(start, end, branch_id) {
      return TransactionInModel.findAll({
        where: {
          branch_id: _defineProperty({}, Op["in"], branch_id),
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(end).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["createdAt", "DESC"]],
        include: [{
          model: OrdersModel,
          as: "order_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filter_with_start_and_end",
    value: function filter_with_start_and_end(start, end) {
      return TransactionInModel.findAll({
        where: {
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(end).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["createdAt", "DESC"]],
        include: [{
          model: OrdersModel,
          as: "order_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filter_with_start",
    value: function filter_with_start(start) {
      return TransactionInModel.findAll({
        where: {
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(start).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["createdAt", "DESC"]],
        include: [{
          model: OrdersModel,
          as: "order_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "filter_with_start_branch",
    value: function filter_with_start_branch(start, branch_id) {
      return TransactionInModel.findAll({
        where: {
          branch_id: _defineProperty({}, Op["in"], branch_id),
          createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(start).utc().tz(constants.TIME_ZONE).endOf('day'))])
        },
        order: [["createdAt", "DESC"]],
        include: [{
          model: OrdersModel,
          as: "order_info"
        }, {
          model: BaristaModel,
          as: "barista_info"
        }]
      });
    }
  }, {
    key: "get_vat_report_last_month",
    value: function get_vat_report_last_month(dates, branch) {
      var _where7;

      return regeneratorRuntime.async(function get_vat_report_last_month$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              console.log(dates, branch);

              if (!dates) {
                _context3.next = 21;
                break;
              }

              if (!(dates.start != null && dates.end != null)) {
                _context3.next = 12;
                break;
              }

              if (!(branch != null)) {
                _context3.next = 8;
                break;
              }

              console.log("date and branch  Block");
              return _context3.abrupt("return", OrderedProductsModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: productsModel,
                  as: "product_info"
                }, {
                  model: CategoryModel,
                  as: "category_info"
                }, {
                  model: IVAModel,
                  as: "iva_info"
                }]
              }));

            case 8:
              console.log("Dates only");
              return _context3.abrupt("return", OrderedProductsModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: productsModel,
                  as: "product_info"
                }, {
                  model: CategoryModel,
                  as: "category_info"
                }, {
                  model: IVAModel,
                  as: "iva_info"
                }]
              }));

            case 10:
              _context3.next = 19;
              break;

            case 12:
              if (!(branch != null)) {
                _context3.next = 17;
                break;
              }

              console.log("Start and branch Only Block");
              return _context3.abrupt("return", OrderedProductsModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: productsModel,
                  as: "product_info"
                }, {
                  model: CategoryModel,
                  as: "category_info"
                }, {
                  model: IVAModel,
                  as: "iva_info"
                }]
              }));

            case 17:
              console.log("Start Only Block");
              return _context3.abrupt("return", OrderedProductsModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: productsModel,
                  as: "product_info"
                }, {
                  model: CategoryModel,
                  as: "category_info"
                }, {
                  model: IVAModel,
                  as: "iva_info"
                }]
              }));

            case 19:
              _context3.next = 28;
              break;

            case 21:
              if (!(branch == null && dates == null)) {
                _context3.next = 26;
                break;
              }

              console.log("no date and no branch  Block");
              return _context3.abrupt("return", OrderedProductsModel.findAll({
                where: {
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: productsModel,
                  as: "product_info"
                }, {
                  model: CategoryModel,
                  as: "category_info"
                }, {
                  model: IVAModel,
                  as: "iva_info"
                }]
              }));

            case 26:
              console.log("branch Only Block");
              return _context3.abrupt("return", OrderedProductsModel.findAll({
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: (_where7 = {
                    branch_id: branch
                  }, _defineProperty(_where7, Op.not, [{
                    order_status: "cancelled"
                  }]), _defineProperty(_where7, "createdAt", _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))), _where7)
                }, {
                  model: productsModel,
                  as: "product_info"
                }, {
                  model: CategoryModel,
                  as: "category_info"
                }, {
                  model: IVAModel,
                  as: "iva_info"
                }]
              }));

            case 28:
            case "end":
              return _context3.stop();
          }
        }
      });
    }
  }, {
    key: "get_payout_report_last_month",
    value: function get_payout_report_last_month(dates, branch) {
      var _where8, _where9, _where10, _where11, _where12, _where13;

      return regeneratorRuntime.async(function get_payout_report_last_month$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              if (!dates) {
                _context4.next = 20;
                break;
              }

              if (!(dates.start != null && dates.end != null)) {
                _context4.next = 11;
                break;
              }

              if (!(branch != null)) {
                _context4.next = 7;
                break;
              }

              console.log("date and branch  Block");
              return _context4.abrupt("return", OrdersModel.findAll({
                attributes: ['Payment_method', [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable']],
                group: ['Payment_method'],
                where: (_where8 = {}, _defineProperty(_where8, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where8, "branch_id", branch), _defineProperty(_where8, "createdAt", _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])), _where8)
              }));

            case 7:
              console.log("Dates only");
              return _context4.abrupt("return", OrdersModel.findAll({
                attributes: ['Payment_method', [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable']],
                group: ['Payment_method'],
                where: (_where9 = {}, _defineProperty(_where9, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where9, "createdAt", _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])), _where9)
              }));

            case 9:
              _context4.next = 18;
              break;

            case 11:
              if (!(branch != null)) {
                _context4.next = 16;
                break;
              }

              console.log("Start and branch Only Block");
              return _context4.abrupt("return", OrdersModel.findAll({
                attributes: ['Payment_method', [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable']],
                group: ['Payment_method'],
                where: (_where10 = {
                  branch_id: branch
                }, _defineProperty(_where10, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where10, "createdAt", _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])), _where10)
              }));

            case 16:
              console.log("Start Only Block");
              return _context4.abrupt("return", OrdersModel.findAll({
                attributes: ['Payment_method', [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable']],
                group: ['Payment_method'],
                where: (_where11 = {}, _defineProperty(_where11, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where11, "createdAt", _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])), _where11)
              }));

            case 18:
              _context4.next = 27;
              break;

            case 20:
              if (!(branch == null && dates == null)) {
                _context4.next = 25;
                break;
              }

              console.log("no date and no branch  Block");
              return _context4.abrupt("return", OrdersModel.findAll({
                attributes: ['Payment_method', [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable']],
                group: ['Payment_method'],
                where: (_where12 = {}, _defineProperty(_where12, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where12, "createdAt", _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))), _where12)
              }));

            case 25:
              console.log("branch Only Block");
              return _context4.abrupt("return", OrdersModel.findAll({
                attributes: ['Payment_method', [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable']],
                group: ['Payment_method'],
                where: (_where13 = {}, _defineProperty(_where13, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where13, "branch_id", branch), _defineProperty(_where13, "createdAt", _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))), _where13)
              }));

            case 27:
            case "end":
              return _context4.stop();
          }
        }
      });
    }
  }, {
    key: "getTxnAmount",
    value: function getTxnAmount(dates, branch) {
      var _where14, _where15, _where16, _where17, _where18, _where19;

      return regeneratorRuntime.async(function getTxnAmount$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              if (!dates) {
                _context5.next = 20;
                break;
              }

              if (!(dates.start != null && dates.end != null)) {
                _context5.next = 11;
                break;
              }

              if (!(branch != null)) {
                _context5.next = 7;
                break;
              }

              console.log("date and branch  Block");
              return _context5.abrupt("return", OrdersModel.findOne({
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth']],
                where: (_where14 = {}, _defineProperty(_where14, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where14, "branch_id", branch), _defineProperty(_where14, "createdAt", _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])), _where14)
              }));

            case 7:
              console.log("Dates only1231231231");
              return _context5.abrupt("return", OrdersModel.findOne({
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth']],
                where: (_where15 = {}, _defineProperty(_where15, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where15, "createdAt", _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])), _where15)
              }));

            case 9:
              _context5.next = 18;
              break;

            case 11:
              if (!(branch != null)) {
                _context5.next = 16;
                break;
              }

              console.log("Start and branch Only Block");
              return _context5.abrupt("return", OrdersModel.findOne({
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth']],
                where: (_where16 = {}, _defineProperty(_where16, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where16, "branch_id", branch), _defineProperty(_where16, "createdAt", _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])), _where16)
              }));

            case 16:
              console.log("Start Only Block");
              return _context5.abrupt("return", OrdersModel.findOne({
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth']],
                where: (_where17 = {}, _defineProperty(_where17, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where17, "createdAt", _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])), _where17)
              }));

            case 18:
              _context5.next = 27;
              break;

            case 20:
              if (!(branch == null && dates == null)) {
                _context5.next = 25;
                break;
              }

              console.log("no date and no branch  Block");
              return _context5.abrupt("return", OrdersModel.findOne({
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth']],
                where: (_where18 = {}, _defineProperty(_where18, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where18, "createdAt", _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))), _where18)
              }));

            case 25:
              console.log("branch Only Block");
              return _context5.abrupt("return", OrdersModel.findOne({
                attributes: [[Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth']],
                where: (_where19 = {}, _defineProperty(_where19, Op.not, [{
                  order_status: "cancelled"
                }]), _defineProperty(_where19, "branch_id", branch), _defineProperty(_where19, "createdAt", _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))), _where19)
              }));

            case 27:
            case "end":
              return _context5.stop();
          }
        }
      });
    }
  }, {
    key: "getInflow",
    value: function getInflow(branch_id, open_time) {
      return TransactionInModel.findAll({
        attributes: ['Payment_method', [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'inflow']],
        group: ['Payment_method'],
        where: {
          createdAt: _defineProperty({}, Op.gte, moment(open_time).toDate()),
          branch_id: branch_id
        },
        include: [{
          model: OrdersModel,
          as: "order_info",
          where: _defineProperty({}, Op.not, [{
            order_status: "cancelled"
          }])
        }]
      });
    }
  }, {
    key: "getOutflow",
    value: function getOutflow(branch_id, open_time) {
      return TransactionOutModel.findAll({
        attributes: ["mode_of_payment", [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.col('total_amount')), 'outflow']],
        group: ['mode_of_payment'],
        where: {
          createdAt: _defineProperty({}, Op.gte, moment(open_time).toDate()),
          branch_id: branch_id
        }
      });
    }
  }, {
    key: "get_discounts_grouped",
    value: function get_discounts_grouped(branch, dates) {
      // console.log(dates, branch)
      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return AppliedDiscountsModel.findAll({
              attributes: ["discount_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
              group: ['discount_id'],
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({
                  branch_id: branch
                }, Op.not, [{
                  order_status: "cancelled"
                }])
              }, {
                model: BaristaModel,
                as: "barista_info"
              }, {
                model: DiscountModel,
                as: "discount_info"
              }]
            });
          } else {
            console.log("Dates only");
            return AppliedDiscountsModel.findAll({
              attributes: ["discount_id", "tota_discount_amount", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
              group: ['discount_id'],
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }, {
                model: BaristaModel,
                as: "barista_info"
              }, {
                model: DiscountModel,
                as: "discount_info"
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block");
            return AppliedDiscountsModel.findAll({
              attributes: ["discount_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
              group: ['discount_id'],
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({
                  branch_id: branch
                }, Op.not, [{
                  order_status: "cancelled"
                }])
              }, {
                model: BaristaModel,
                as: "barista_info"
              }, {
                model: DiscountModel,
                as: "discount_info"
              }]
            });
          } else {
            console.log("Start Only Block");
            return AppliedDiscountsModel.findAll({
              attributes: ["discount_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
              group: ['discount_id'],
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }, {
                model: BaristaModel,
                as: "barista_info"
              }, {
                model: DiscountModel,
                as: "discount_info"
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        console.log("no date and no branch  Block");
        return AppliedDiscountsModel.findAll({
          attributes: ["discount_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
          group: ['discount_id'],
          where: {
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          include: [{
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }])
          }, {
            model: BaristaModel,
            as: "barista_info"
          }, {
            model: DiscountModel,
            as: "discount_info"
          }]
        });
      } else {
        console.log("branch Only Block");
        return AppliedDiscountsModel.findAll({
          attributes: ["discount_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
          group: ['discount_id'],
          where: {
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          include: [{
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({
              branch_id: branch
            }, Op.not, [{
              order_status: "cancelled"
            }])
          }, {
            model: BaristaModel,
            as: "barista_info"
          }, {
            model: DiscountModel,
            as: "discount_info"
          }]
        });
      }
    }
  }, {
    key: "get_discounts_grouped_barista",
    value: function get_discounts_grouped_barista(branch, dates) {
      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return AppliedDiscountsModel.findAll({
              attributes: ["barista_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
              group: ['barista_id'],
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({
                  branch_id: branch
                }, Op.not, [{
                  order_status: "cancelled"
                }])
              }, {
                model: BaristaModel,
                as: "barista_info"
              }, {
                model: DiscountModel,
                as: "discount_info"
              }]
            });
          } else {
            console.log("Dates only");
            return AppliedDiscountsModel.findAll({
              attributes: ["barista_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
              group: ['barista_id'],
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }, {
                model: BaristaModel,
                as: "barista_info"
              }, {
                model: DiscountModel,
                as: "discount_info"
              }]
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block");
            return AppliedDiscountsModel.findAll({
              attributes: ["barista_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
              group: ['barista_id'],
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({
                  branch_id: branch
                }, Op.not, [{
                  order_status: "cancelled"
                }])
              }, {
                model: BaristaModel,
                as: "barista_info"
              }, {
                model: DiscountModel,
                as: "discount_info"
              }]
            });
          } else {
            console.log("Start Only Block");
            return AppliedDiscountsModel.findAll({
              attributes: ["barista_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
              group: ['barista_id'],
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }, {
                model: BaristaModel,
                as: "barista_info"
              }, {
                model: DiscountModel,
                as: "discount_info"
              }]
            });
          }
        }
      } else if (branch == null && dates == null) {
        console.log("no date and no branch  Block");
        return AppliedDiscountsModel.findAll({
          attributes: ["barista_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
          group: ['barista_id'],
          where: {
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          include: [{
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }])
          }, {
            model: BaristaModel,
            as: "barista_info"
          }, {
            model: DiscountModel,
            as: "discount_info"
          }]
        });
      } else {
        console.log("branch Only Block");
        return AppliedDiscountsModel.findAll({
          attributes: ["barista_id", [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
          group: ['barista_id'],
          where: {
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
          },
          include: [{
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({
              branch_id: branch
            }, Op.not, [{
              order_status: "cancelled"
            }])
          }, {
            model: BaristaModel,
            as: "barista_info"
          }, {
            model: DiscountModel,
            as: "discount_info"
          }]
        });
      }
    }
  }, {
    key: "get_discounts_report",
    value: function get_discounts_report(branch, dates) {
      return regeneratorRuntime.async(function get_discounts_report$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              if (!dates) {
                _context6.next = 20;
                break;
              }

              if (!(dates.start != null && dates.end != null)) {
                _context6.next = 11;
                break;
              }

              if (!(branch != null)) {
                _context6.next = 7;
                break;
              }

              console.log("date and branch  Block");
              return _context6.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: ["barista_id", "discount_id", [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                group: ['barista_id', 'discount_id'],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 7:
              console.log("Dates only");
              return _context6.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: ["barista_id", "discount_id", [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                group: ['barista_id', 'discount_id'],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 9:
              _context6.next = 18;
              break;

            case 11:
              if (!(branch != null)) {
                _context6.next = 16;
                break;
              }

              console.log("Start and branch Only Block");
              return _context6.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: ["barista_id", "discount_id", [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                group: ['barista_id', 'discount_id'],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 16:
              console.log("Start Only Block");
              return _context6.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: ["barista_id", "discount_id", [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                group: ['barista_id', 'discount_id'],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 18:
              _context6.next = 27;
              break;

            case 20:
              if (!(branch == null && dates == null)) {
                _context6.next = 25;
                break;
              }

              console.log("no date and no branch  Block");
              return _context6.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: ["barista_id", "discount_id", [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                group: ['barista_id', 'discount_id'],
                where: {
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 25:
              console.log("branch Only Block");
              return _context6.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: ["barista_id", "discount_id", [Sequelize.fn('COUNT', '_id'), 'count'], [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                group: ['barista_id', 'discount_id'],
                where: {
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 27:
            case "end":
              return _context6.stop();
          }
        }
      });
    }
  }, {
    key: "get_last_moth_discount_report_total",
    value: function get_last_moth_discount_report_total(branch, dates) {
      var startDate, endDate, _startDate, _endDate;

      return regeneratorRuntime.async(function get_last_moth_discount_report_total$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              if (!dates) {
                _context7.next = 24;
                break;
              }

              startDate = moment(dates.start);
              endDate = moment(dates.end);

              if (!(dates.start != null && dates.end != null)) {
                _context7.next = 15;
                break;
              }

              if (!(branch != null)) {
                _context7.next = 9;
                break;
              }

              console.log("date and branch  Block");
              return _context7.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 9:
              console.log("Dates only");
              _startDate = moment(dates.start);
              _endDate = moment(dates.end);
              return _context7.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(_endDate.diff(_startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(_endDate.diff(_startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 13:
              _context7.next = 22;
              break;

            case 15:
              if (!(branch != null)) {
                _context7.next = 20;
                break;
              }

              console.log("Start and branch Only Block");
              return _context7.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 20:
              console.log("Start Only Block");
              return _context7.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 22:
              _context7.next = 31;
              break;

            case 24:
              if (!(branch == null && dates == null)) {
                _context7.next = 29;
                break;
              }

              console.log("no date and no branch  Block");
              return _context7.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 29:
              console.log("branch Only Block");
              return _context7.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 31:
            case "end":
              return _context7.stop();
          }
        }
      });
    }
  }, {
    key: "get_this_moth_discount_report_total",
    value: function get_this_moth_discount_report_total(branch, dates) {
      return regeneratorRuntime.async(function get_this_moth_discount_report_total$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              if (!dates) {
                _context8.next = 20;
                break;
              }

              if (!(dates.start != null && dates.end != null)) {
                _context8.next = 11;
                break;
              }

              if (!(branch != null)) {
                _context8.next = 7;
                break;
              }

              console.log("date and branch  Block");
              return _context8.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 7:
              console.log("Dates only");
              return _context8.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 9:
              _context8.next = 18;
              break;

            case 11:
              if (!(branch != null)) {
                _context8.next = 16;
                break;
              }

              console.log("Start and branch Only Block");
              return _context8.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 16:
              console.log("Start Only Block");
              return _context8.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 18:
              _context8.next = 27;
              break;

            case 20:
              if (!(branch == null && dates == null)) {
                _context8.next = 25;
                break;
              }

              console.log("no date and no branch  Block");
              return _context8.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({}, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 25:
              console.log("branch Only Block");
              return _context8.abrupt("return", AppliedDiscountsModel.findAll({
                attributes: [[Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount']],
                where: {
                  createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day'))
                },
                include: [{
                  model: OrdersModel,
                  as: "order_info",
                  where: _defineProperty({
                    branch_id: branch
                  }, Op.not, [{
                    order_status: "cancelled"
                  }])
                }, {
                  model: BaristaModel,
                  as: "barista_info"
                }, {
                  model: DiscountModel,
                  as: "discount_info"
                }]
              }));

            case 27:
            case "end":
              return _context8.stop();
          }
        }
      });
    }
  }, {
    key: "get_last_record",
    value: function get_last_record(branch_id) {
      return regeneratorRuntime.async(function get_last_record$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              return _context9.abrupt("return", OrdersModel.findAll({
                where: {
                  branch_id: branch_id
                },
                order: [["createdAt", "DESC"]],
                limit: 1
              }));

            case 1:
            case "end":
              return _context9.stop();
          }
        }
      });
    }
  }, {
    key: "getGlobalSales",
    value: function getGlobalSales(dates, branch) {
      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: _defineProperty({}, Op["in"], branch)
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          } else {
            console.log("Dates only");
            return TransactionInModel.findAll({
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
            });
          }
        } else {
          if (branch != null) {
            console.log("Start and branch Only Block");
            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: _defineProperty({}, Op["in"], branch)
              },
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
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
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
        console.log("no date and no branch  Block");
        return TransactionInModel.findAll({
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
        });
      } else {
        console.log("branch Only Block");
        return TransactionInModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')),
            branch_id: _defineProperty({}, Op["in"], branch)
          },
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
  }, {
    key: "getGlobalSalesPrevious",
    value: function getGlobalSalesPrevious(dates, branch) {
      if (dates) {
        var startDate = moment(dates.start);
        var endDate = moment(dates.end);

        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: _defineProperty({}, Op["in"], branch)
              },
              include: [{
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          } else {
            console.log("Dates only");

            var _startDate2 = moment(dates.start);

            var _endDate2 = moment(dates.end);

            return TransactionInModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract(_endDate2.diff(_startDate2, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).subtract(_endDate2.diff(_startDate2, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
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
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: _defineProperty({}, Op["in"], branch)
              },
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
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
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
        console.log("no date and no branch  Block");
        return TransactionInModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          include: [{
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }])
          }]
        });
      } else {
        console.log("branch Only Block");
        return TransactionInModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day'))]),
            branch_id: _defineProperty({}, Op["in"], branch)
          },
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
  }, {
    key: "get_category_sales",
    value: function get_category_sales(dates, branch) {
      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return OrderedProductsModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: _defineProperty({}, Op["in"], branch)
              },
              include: [{
                model: CategoryModel,
                as: "category_info"
              }, {
                model: IVAModel,
                as: "iva_info"
              }, {
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
            console.log("Dates only");
            return OrderedProductsModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: CategoryModel,
                as: "category_info"
              }, {
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: IVAModel,
                as: "iva_info"
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
            console.log("Start and branch Only Block");
            return OrderedProductsModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: _defineProperty({}, Op["in"], branch)
              },
              include: [{
                model: CategoryModel,
                as: "category_info"
              }, {
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: IVAModel,
                as: "iva_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          } else {
            console.log("Start Only Block");
            return OrderedProductsModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: CategoryModel,
                as: "category_info"
              }, {
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: IVAModel,
                as: "iva_info"
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
        console.log("no date and no branch  Block");
        return OrderedProductsModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          include: [{
            model: CategoryModel,
            as: "category_info"
          }, {
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: IVAModel,
            as: "iva_info"
          }, {
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }])
          }]
        });
      } else {
        console.log("branch Only Block");
        return OrderedProductsModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().utc().tz(constants.TIME_ZONE).endOf('day'))]),
            branch_id: _defineProperty({}, Op["in"], branch)
          },
          include: [{
            model: CategoryModel,
            as: "category_info"
          }, {
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: IVAModel,
            as: "iva_info"
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
    key: "get_product_sales",
    value: function get_product_sales(dates, branch) {
      if (dates) {
        if (dates.start != null && dates.end != null) {
          if (branch != null) {
            console.log("date and branch  Block");
            return OrderedProductsModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: _defineProperty({}, Op["in"], branch)
              },
              include: [{
                model: productsModel,
                as: "product_info"
              }, {
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: IVAModel,
                as: "iva_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          } else {
            console.log("Dates only");
            return OrderedProductsModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: productsModel,
                as: "product_info"
              }, {
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: IVAModel,
                as: "iva_info"
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
            console.log("Start and branch Only Block");
            return OrderedProductsModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))]),
                branch_id: _defineProperty({}, Op["in"], branch)
              },
              include: [{
                model: productsModel,
                as: "product_info"
              }, {
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: IVAModel,
                as: "iva_info"
              }, {
                model: OrdersModel,
                as: "order_info",
                where: _defineProperty({}, Op.not, [{
                  order_status: "cancelled"
                }])
              }]
            });
          } else {
            console.log("Start Only Block");
            return OrderedProductsModel.findAll({
              where: {
                createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day'))])
              },
              include: [{
                model: productsModel,
                as: "product_info"
              }, {
                model: BrancheModel,
                as: "branch_info"
              }, {
                model: IVAModel,
                as: "iva_info"
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
        console.log("no date and no branch  Block");
        return OrderedProductsModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().utc().tz(constants.TIME_ZONE).endOf('day'))])
          },
          include: [{
            model: productsModel,
            as: "product_info"
          }, {
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: IVAModel,
            as: "iva_info"
          }, {
            model: OrdersModel,
            as: "order_info",
            where: _defineProperty({}, Op.not, [{
              order_status: "cancelled"
            }])
          }]
        });
      } else {
        console.log("branch Only Block");
        return OrderedProductsModel.findAll({
          where: {
            createdAt: _defineProperty({}, Op.and, [_defineProperty({}, Op.gte, moment().utc().tz(constants.TIME_ZONE).startOf('day')), _defineProperty({}, Op.lte, moment().utc().tz(constants.TIME_ZONE).endOf('day'))]),
            branch_id: _defineProperty({}, Op["in"], branch)
          },
          include: [{
            model: productsModel,
            as: "product_info"
          }, {
            model: BrancheModel,
            as: "branch_info"
          }, {
            model: IVAModel,
            as: "iva_info"
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
  }]);

  return OrderRepository;
}();

module.exports.orderRepository = new OrderRepository();