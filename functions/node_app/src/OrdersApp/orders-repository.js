
const { BaristaModel } = require("../BaristaApp/Barista-model");
const { BrancheModel } = require('../Branch-app/Branch-model');
const { OrdersModel, AppliedDiscountsModel, OrderedProductsModel, TransactionInModel } = require("./orders-model")
const { productsModel } = require("../ProductApp/product-model")
const { CategoryModel } = require("../Category_app/category-model")
const { IVAModel, DiscountModel } = require("../SetupApp/setup-model")
const { TransactionOutModel } = require("../Transaction-outApp/transaction-out-model")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
var sequential = require("sequential-ids");
const { constants } = require('../../Utils/constants');
const { UserModel } = require("../User_App/User-model");

class OrderRepository {

    async get_branchInfo(device_id) {
        return BrancheModel.findOne({
            where: { device_id: device_id }, order: [
                ["createdAt", "DESC"]
            ]
        })
    }

    update_order_staus(id, status, cancel_reason = null) {
        return OrdersModel.update({ order_status: status, cancel_reason: cancel_reason }, {
            where: {
                "_id": id,
            }
        })
    }

    change_payment_method(id, Payment_method, invoice_number) {
        return OrdersModel.update({ Payment_method: Payment_method, invoice_number: invoice_number }, {
            where: {
                "_id": id
            }
        })
    }
    create_order(request) {
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
        })
    }

    generate_reference(previous) {

        var generator = new sequential.Generator({
            digits: 3, letters: 1,
            restore: previous
        });

        return generator.generate()
    }
    get_orders(order_id, branch_id, status, openTime) {

        if (order_id) {
            return OrdersModel.findOne({
                where: { _id: order_id }, include: [
                    { model: BrancheModel, as: "branch_info" },
                    { model: BaristaModel, as: "barista_info" }
                ]
            })
        }
        else {
            if (status) {
                if (status == "closed") {
                    return OrdersModel.findAll({
                        where: {
                            branch_id: branch_id,
                            createdAt: {
                                [Op.gte]: openTime
                            },
                            [Op.or]: [
                                { order_status: "closed" },
                                { order_status: "ongoing" }
                            ]
                        }, order: [
                            ["createdAt", "DESC"]
                        ], include: [{
                            model: BrancheModel, as: "branch_info"
                        }, { model: BaristaModel, as: "barista_info" },{ model: UserModel, as: "user_info" }]
                    })
                }
                else {
                    return OrdersModel.findAll({
                        where: {
                            branch_id: branch_id, order_status: status,
                            createdAt: {
                                [Op.gte]: openTime
                            },
                        }, order: [
                            ["createdAt", "DESC"]
                        ], include: [{
                            model: BrancheModel, as: "branch_info"
                        }, { model: BaristaModel, as: "barista_info" },{ model: UserModel, as: "user_info" }]
                    })
                }
            }
            else {
                return OrdersModel.findAll({
                    where: {
                        branch_id: branch_id,
                        createdAt: {
                            [Op.gte]: openTime
                        },
                    }, order: [
                        ["createdAt", "DESC"]
                    ], include: [{
                        model: BrancheModel, as: "branch_info"
                    }, { model: BaristaModel, as: "barista_info" },{ model: UserModel, as: "user_info" }]
                })
            }
        }
    }

    create_applied_discounts(order_id, discount_id, barista_id, tota_discount_amount) {
        return AppliedDiscountsModel.create({
            order_id: order_id,
            discount_id: discount_id,
            barista_id: barista_id,
            tota_discount_amount: tota_discount_amount
        })
    }

    get_appliedDiscounts() {

    }
    createOrderedProduct(date, order_id, product_id, category_id, iva_id, quantity, price, payment_method, branch_id) {
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

        })
    }


    createInTransaction(order_id, time_elapsed, barista_id, status, total_amount, branch_id, Payment_method) {
        TransactionInModel.create({
            order_id: order_id,
            time_elapsed: time_elapsed,
            barista_id: barista_id,
            status: status,
            total_amount: total_amount,
            branch_id: branch_id,
            Payment_method: Payment_method
        })
    }

    async get_transactions(branch_id) {
        if (branch_id) {
            return TransactionInModel.findAll({
                where: {
                    branch_id: { [Op.in]: branch_id },
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                }, order: [
                    ["createdAt", "DESC"]
                ], include: [{
                    model: OrdersModel, as: "order_info"
                }, { model: BaristaModel, as: "barista_info" }]
            })
        }
        else {
            return TransactionInModel.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                order: [
                    ["createdAt", "DESC"]
                ],
                include: [{
                    model: OrdersModel, as: "order_info"
                }, { model: BaristaModel, as: "barista_info" }]
            })
        }
    }

    gatherPrice(products_data, discount_id, discount_data,bean_applied) {
        let price_details = []
        let totalPriceWithoutIVA = 0
        let totalPriceWithIVA = 0
        let price_info = new Object()
        products_data.forEach(element => {
            let item = new Object()
            item._id = element._id
            item.product_name = element.product_name
            item.discount_id = element.discount_id
            item.discount_name = element.discount_name
            item.discount_price = element.discount_price
            item.discount_type = element.discount_type
            item.have_discount = element.have_discount

            let discountAmt = 0.0
            if (element.have_discount == 1) {
                if (element.discount_type == 'euro') {
                    discountAmt = Number(element.discount_price)
                }
                else {
                    discountAmt = Number(element.price) * Number(element.discount_price) / 100
                }
            }
            let price = (Number(element.quantity) * Number(element.price)) - discountAmt
            item.price = price.toFixed(2)
            totalPriceWithoutIVA += price - (item.price * Number(element.iva_percent) / (100 + Number(element.iva_percent)))
            totalPriceWithIVA += price
            price_details.push(item)
        });
        price_info.price_data = price_details
        price_info.total_price_with_iva = totalPriceWithIVA.toFixed(2)
        price_info.total_price_without_iva = totalPriceWithoutIVA.toFixed(2)
        let couponAmount = 0
        let couponAmountWOTax = 0
        if (discount_data != null && discount_id.length > 0 && discount_data.length > 0) {
            discount_data.forEach(element => {
                if (element.type == "euro") {
                    couponAmount += (element.amount * element.quantity)
                    couponAmountWOTax += (element.amount * element.quantity)
                }
                else {
                    couponAmount += ((totalPriceWithIVA * Number(element.amount) / 100) * element.quantity)
                    couponAmountWOTax += ((totalPriceWithoutIVA * Number(element.amount) / 100) * element.quantity)
                }
            });

        }
        price_info.bean_applied = bean_applied 
        console.log(couponAmount,bean_applied) // logic may change for 255th line
        // price_info.total_payable = bean_applied != null ? 0 : couponAmount <= totalPriceWithIVA ? (totalPriceWithIVA - Number(couponAmount)).toFixed(2) : totalPriceWithIVA.toFixed(2)
        // price_info.total_pay_without_tax = bean_applied != null  ? 0 : couponAmount <= totalPriceWithoutIVA ? (totalPriceWithoutIVA - Number(couponAmountWOTax)).toFixed(2) : totalPriceWithoutIVA.toFixed(2)

        price_info.total_payable = bean_applied != null && bean_applied != "" && Number(bean_applied) > 0 ? 0 : couponAmount <= totalPriceWithIVA ? (totalPriceWithIVA - Number(couponAmount)).toFixed(2) : totalPriceWithIVA.toFixed(2)
        price_info.total_pay_without_tax = bean_applied != null && bean_applied != "" && Number(bean_applied) > 0 ? 0 : couponAmount <= totalPriceWithoutIVA ? (totalPriceWithoutIVA - Number(couponAmountWOTax)).toFixed(2) : totalPriceWithoutIVA.toFixed(2)
        return price_info
    }

    gatherOrderInput(bodyContent) {
        const { user_id, barista_id, products_ids, invoice_number, Payment_method, discount_id, order_status, products_data, discount_data, time_elapsed, reference } = bodyContent
        let orderRequest = new Object()
        orderRequest.date_of_order = moment()
        orderRequest.user_id = user_id || null
        orderRequest.barista_id = barista_id
        orderRequest.reference = reference
        orderRequest.products_ids = products_ids,
        orderRequest.products_data = products_data
        orderRequest.invoice_number = invoice_number || ""
        orderRequest.payment_method = Payment_method || "CASH"
        orderRequest.discount_id = discount_id.join(",")
        orderRequest.discount_data = discount_data
        orderRequest.price_data = this.gatherPrice(products_data, discount_id, discount_data,bodyContent.applied_beans)
        orderRequest.total_price = orderRequest.price_data.total_payable
        orderRequest.total_price_with_out_tax = orderRequest.price_data.total_price_without_iva
        orderRequest.order_status = order_status
        orderRequest.time_elapsed = time_elapsed
        return orderRequest
    }


    get_branch_wise_txn(branch) {
        return TransactionInModel.findAll({
            where: {
                branch_id: { [Op.in]: branch },
                createdAt: {
                    [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                }
            }, order: [
                ["createdAt", "DESC"]
            ], include: [{
                model: OrdersModel, as: "order_info"
            }, { model: BaristaModel, as: "barista_info" }]
        })
    }
    filter_with_start_end_branch(start, end, branch_id) {
        return TransactionInModel.findAll({
            where: {
                branch_id: { [Op.in]: branch_id }
                , createdAt:
                {
                    [Op.and]:
                        [
                            {
                                [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                            },
                            {
                                [Op.lte]: moment(end).utc().tz(constants.TIME_ZONE).endOf('day')
                            }
                        ],
                }
            }, order: [
                ["createdAt", "DESC"],
            ], include: [{
                model: OrdersModel, as: "order_info"
            }, { model: BaristaModel, as: "barista_info" }]
        })
    }
    filter_with_start_and_end(start, end) {

        return TransactionInModel.findAll({
            where: {
                createdAt:
                {
                    [Op.and]:
                        [
                            {
                                [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                            },
                            {
                                [Op.lte]: moment(end).utc().tz(constants.TIME_ZONE).endOf('day')
                            }
                        ],
                }
            }, order: [
                ["createdAt", "DESC"],
            ], include: [{
                model: OrdersModel, as: "order_info"
            }, { model: BaristaModel, as: "barista_info" }]
        })
    }
    filter_with_start(start) {
        return TransactionInModel.findAll({
            where: {
                createdAt:
                {
                    [Op.and]:
                        [
                            {
                                [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                            },
                            {
                                [Op.lte]: moment(start).utc().tz(constants.TIME_ZONE).endOf('day')
                            }
                        ],
                }
            }, order: [
                ["createdAt", "DESC"],
            ], include: [{
                model: OrdersModel, as: "order_info"
            }, { model: BaristaModel, as: "barista_info" }]
        })
    }
    filter_with_start_branch(start, branch_id) {
        return TransactionInModel.findAll({
            where: {
                branch_id: { [Op.in]: branch_id },
                createdAt:
                {
                    [Op.and]:
                        [
                            {
                                [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                            },
                            {
                                [Op.lte]: moment(start).utc().tz(constants.TIME_ZONE).endOf('day')
                            }
                        ],
                }
            }, order: [
                ["createdAt", "DESC"],
            ], include: [{
                model: OrdersModel, as: "order_info"
            }, { model: BaristaModel, as: "barista_info" }]
        })
    }

    async get_vat_report_last_month(dates, branch) {

        console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                            { model: productsModel, as: "product_info" },
                            { model: CategoryModel, as: "category_info" },
                            { model: IVAModel, as: "iva_info" }
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ],
                                }
                            },
                            { model: productsModel, as: "product_info" },
                            { model: CategoryModel, as: "category_info" },
                            { model: IVAModel, as: "iva_info" }
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch, [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ],
                                }
                            },
                            { model: productsModel, as: "product_info" },
                            { model: CategoryModel, as: "category_info" },
                            { model: IVAModel, as: "iva_info" }
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")

                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ],
                                }
                            },
                            { model: productsModel, as: "product_info" },
                            { model: CategoryModel, as: "category_info" },
                            { model: IVAModel, as: "iva_info" }
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return OrderedProductsModel.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                }, include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ],
                        }
                    },
                    { model: productsModel, as: "product_info" },
                    { model: CategoryModel, as: "category_info" },
                    { model: IVAModel, as: "iva_info" }
                ]
            })
        }
        else {
            console.log("branch Only Block")

            return OrderedProductsModel.findAll({
                include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            branch_id: branch,
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ],
                            createdAt: {
                                [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                            }
                        },
                    },
                    { model: productsModel, as: "product_info" },
                    { model: CategoryModel, as: "category_info" },
                    { model: IVAModel, as: "iva_info" }
                ]
            })
        }
    }

    async get_payout_report_last_month(dates, branch) {
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return OrdersModel.findAll({
                        attributes: [
                            'Payment_method',
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable'],
                        ], group: ['Payment_method'], where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ],
                            branch_id: branch,
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                    })
                }
                else {
                    console.log("Dates only")

                    return OrdersModel.findAll({
                        attributes: [
                            'Payment_method',
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable'],
                        ], group: ['Payment_method'], where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ], createdAt: {
                                    [Op.and]:
                                        [
                                            {
                                                [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                            },
                                            {
                                                [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                            }
                                        ],
                                }
                        }
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return OrdersModel.findAll({
                        attributes: [
                            'Payment_method',
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable'],
                        ], group: ['Payment_method'], where: {
                            branch_id: branch,
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ], createdAt: {
                                    [Op.and]:
                                        [
                                            {
                                                [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                            },
                                            {
                                                [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                            }
                                        ],
                                },
                        }
                    })
                }
                else {
                    console.log("Start Only Block")

                    return OrdersModel.findAll({
                        attributes: [
                            'Payment_method',
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable'],
                        ], group: ['Payment_method'], where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ], createdAt: {
                                    [Op.and]:
                                        [
                                            {
                                                [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                            },
                                            {
                                                [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                            }
                                        ],
                                },
                        }
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return OrdersModel.findAll({
                attributes: [
                    'Payment_method',
                    [Sequelize.fn('COUNT', '_id'), 'count'],
                    [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable'],
                ], group: ['Payment_method'], where: {
                    [Op.not]:
                        [
                            { order_status: "cancelled" },
                        ], createdAt: {
                            [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                }
            })
        }
        else {
            console.log("branch Only Block")

            return OrdersModel.findAll({
                attributes: [
                    'Payment_method',
                    [Sequelize.fn('COUNT', '_id'), 'count'],
                    [Sequelize.fn('sum', Sequelize.col('total_price')), 'total_payable'],
                ], group: ['Payment_method'], where: {
                    [Op.not]:
                        [
                            { order_status: "cancelled" },
                        ], branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                }
            })
        }
    }

    async getTxnAmount(dates, branch) {

        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return OrdersModel.findOne({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth'],
                        ], where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ], branch_id: branch,
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        }
                    })
                }
                else {
                    console.log("Dates only1231231231")

                    return OrdersModel.findOne({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth'],
                        ], where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ], createdAt: {
                                    [Op.and]:
                                        [
                                            {
                                                [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                            },
                                            {
                                                [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                            }
                                        ],
                                },
                        }
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return OrdersModel.findOne({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth'],
                        ], where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ], branch_id: branch,
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        }
                    })
                }
                else {
                    console.log("Start Only Block")

                    return OrdersModel.findOne({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth'],
                        ], where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ], createdAt: {
                                    [Op.and]:
                                        [
                                            {
                                                [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                            },
                                            {
                                                [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                            }
                                        ],
                                },
                        }
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")
            return OrdersModel.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth'],
                ], where: {
                    [Op.not]:
                        [
                            { order_status: "cancelled" },
                        ], createdAt: {
                            [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                }
            })
        }
        else {
            console.log("branch Only Block")

            return OrdersModel.findOne({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.col('total_price')), 'EntireTxnThisMonth'],
                ], where: {
                    [Op.not]:
                        [
                            { order_status: "cancelled" },
                        ], branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                }
            })
        }

    }

    getInflow(branch_id, open_time) {
        return TransactionInModel.findAll({
            attributes: [
                'Payment_method',
                [Sequelize.fn('COUNT', '_id'), 'count'],
                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'inflow'],
            ], group: ['Payment_method'], where: {
                createdAt: { [Op.gte]: moment(open_time).toDate() },
                branch_id: branch_id
            },
            include: [
                {
                    model: OrdersModel, as: "order_info", where: {
                        [Op.not]: [
                            { order_status: "cancelled" },
                        ]
                    }
                },
            ]
        })
    }

    getOutflow(branch_id, open_time) {
        return TransactionOutModel.findAll({
            attributes: [
                "mode_of_payment",
                [Sequelize.fn('COUNT', '_id'), 'count'],
                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'outflow'],
            ], group: ['mode_of_payment'], where: {
                createdAt: { [Op.gte]: moment(open_time).toDate() },
                branch_id: branch_id
            }
        })
    }

    get_discounts_grouped(branch, dates) {


        // console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "discount_id",
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['discount_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    branch_id: branch, [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Dates only")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "discount_id",
                            "tota_discount_amount",
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['discount_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "discount_id",
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['discount_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    branch_id: branch, [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "discount_id",
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['discount_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return AppliedDiscountsModel.findAll({
                attributes: [
                    "discount_id",
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], group: ['discount_id'], where: {
                    createdAt: { [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day') },
                }
                , include: [
                    {
                        model: OrdersModel, as: "order_info", where: {
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
        else {
            console.log("branch Only Block")

            return AppliedDiscountsModel.findAll({
                attributes: [
                    "discount_id",
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], group: ['discount_id'], where: {
                    createdAt: { [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day') },
                }
                , include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            branch_id: branch,
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
    }

    get_discounts_grouped_barista(branch, dates) {

        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")
                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "barista_id",
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['barista_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Dates only")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "barista_id",
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['barista_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "barista_id",
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['barista_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")
                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "barista_id",
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['barista_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return AppliedDiscountsModel.findAll({
                attributes: [
                    "barista_id",
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], group: ['barista_id'], where: {
                    createdAt: { [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day') },
                }
                , include: [
                    {
                        model: OrdersModel, as: "order_info", where: {
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
        else {
            console.log("branch Only Block")
            return AppliedDiscountsModel.findAll({
                attributes: [
                    "barista_id",
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], group: ['barista_id'], where: {
                    createdAt: { [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day') },
                }
                , include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            branch_id: branch, [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
    }

    async get_discounts_report(branch, dates) {

        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")
                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "barista_id",
                            "discount_id",
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['barista_id', 'discount_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Dates only")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "barista_id",
                            "discount_id",
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['barista_id', 'discount_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "barista_id",
                            "discount_id",
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['barista_id', 'discount_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")
                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            "barista_id",
                            "discount_id",
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], group: ['barista_id', 'discount_id'], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }
                        , include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return AppliedDiscountsModel.findAll({
                attributes: [
                    "barista_id",
                    "discount_id",
                    [Sequelize.fn('COUNT', '_id'), 'count'],
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], group: ['barista_id', 'discount_id'], where: {
                    createdAt: { [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day') },
                }
                , include: [
                    {
                        model: OrdersModel, as: "order_info", where: {
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
        else {
            console.log("branch Only Block")
            return AppliedDiscountsModel.findAll({
                attributes: [
                    "barista_id",
                    "discount_id",
                    [Sequelize.fn('COUNT', '_id'), 'count'],
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], group: ['barista_id', 'discount_id'], where: {
                    createdAt: { [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day') },
                }
                , include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            branch_id: branch,
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
    }

    async get_last_moth_discount_report_total(branch, dates) {

        if (dates) {
            let startDate = moment(dates.start)
            let endDate = moment(dates.end)
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    let startDate = moment(dates.start)
                    let endDate = moment(dates.end)

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")


                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return AppliedDiscountsModel.findAll({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    }
                },
                include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
        else {
            console.log("branch Only Block")

            return AppliedDiscountsModel.findAll({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    }
                }, include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            branch_id: branch,
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
    }
    async get_this_moth_discount_report_total(branch, dates) {

        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")
                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Dates only")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    branch_id: branch,
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")

                    return AppliedDiscountsModel.findAll({
                        attributes: [
                            [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                        ], where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            }
                        }, include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]: [
                                        { order_status: "cancelled" }
                                    ]
                                }
                            },
                            { model: BaristaModel, as: "barista_info" },
                            { model: DiscountModel, as: "discount_info" },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return AppliedDiscountsModel.findAll({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], where: {
                    createdAt: { [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day') },
                },
                include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
        else {
            console.log("branch Only Block")
            return AppliedDiscountsModel.findAll({
                attributes: [
                    [Sequelize.fn('sum', Sequelize.literal('abs(tota_discount_amount)')), 'total_discount'],
                ], where: {
                    createdAt: { [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day') },
                },
                include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            branch_id: branch,
                            [Op.not]: [
                                { order_status: "cancelled" }
                            ]
                        }
                    },
                    { model: BaristaModel, as: "barista_info" },
                    { model: DiscountModel, as: "discount_info" },
                ]
            })
        }
    }

    async get_last_record(branch_id) {
        return OrdersModel.findAll({
            where: { branch_id: branch_id, user_id : null,
            }, order: [
                ["createdAt", "DESC"]
            ], limit: 1
        })
    }

    getGlobalSales(dates, branch) {


        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return TransactionInModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                            branch_id: { [Op.in]: branch }
                        },
                        include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                        ]
                    })
                }
                else {
                    console.log("Dates only")

                    return TransactionInModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        },
                        include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return TransactionInModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                            branch_id: { [Op.in]: branch }
                        },
                        include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                        ]
                    })

                }
                else {
                    console.log("Start Only Block")


                    return TransactionInModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        },
                        include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return TransactionInModel.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                    },
                ]
            })
        }
        else {
            console.log("branch Only Block")
            return TransactionInModel.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                    branch_id: { [Op.in]: branch }
                },
                include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                    },
                ]
            })
        }
    }
    getGlobalSalesPrevious(dates, branch) {


        if (dates) {
            let startDate = moment(dates.start)
            let endDate = moment(dates.end)
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return TransactionInModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                            branch_id: { [Op.in]: branch }
                        },
                        include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    let startDate = moment(dates.start)
                    let endDate = moment(dates.end)

                    return TransactionInModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).subtract(endDate.diff(startDate, 'days') + 1, 'days').utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        },
                        include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return TransactionInModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                            branch_id: { [Op.in]: branch }
                        },
                        include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                        ]
                    })

                }
                else {
                    console.log("Start Only Block")


                    return TransactionInModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        },
                        include: [
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return TransactionInModel.findAll({
                where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    }
                },
                include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                    },
                ]
            })
        }
        else {
            console.log("branch Only Block")
            return TransactionInModel.findAll({
                where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().subtract('1', 'days').utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    },
                    branch_id: { [Op.in]: branch }
                },
                include: [
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                    },
                ]
            })
        }
    }

    get_category_sales(dates, branch) {
        if (dates) {

            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                            branch_id: { [Op.in]: branch }
                        }, include: [
                            { model: CategoryModel, as: "category_info" },
                            { model: IVAModel, as: "iva_info" },
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            }
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        }, include: [
                            { model: CategoryModel, as: "category_info" },
                            { model: BrancheModel, as: "branch_info" },
                            { model: IVAModel, as: "iva_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            }
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                            branch_id: { [Op.in]: branch }
                        }, include: [
                            { model: CategoryModel, as: "category_info" },
                            { model: BrancheModel, as: "branch_info" },
                            { model: IVAModel, as: "iva_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            }
                        ]
                    })

                }
                else {
                    console.log("Start Only Block")


                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        }, include: [
                            { model: CategoryModel, as: "category_info" },
                            { model: BrancheModel, as: "branch_info" },
                            { model: IVAModel, as: "iva_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            }
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return OrderedProductsModel.findAll({
                where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    }
                }, include: [
                    { model: CategoryModel, as: "category_info" },
                    { model: BrancheModel, as: "branch_info" },
                    { model: IVAModel, as: "iva_info" },
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                    }
                ]
            })
        }
        else {
            console.log("branch Only Block")

            return OrderedProductsModel.findAll({
                where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    },
                    branch_id: { [Op.in]: branch }
                }, include: [
                    { model: CategoryModel, as: "category_info" },
                    { model: BrancheModel, as: "branch_info" },
                    { model: IVAModel, as: "iva_info" },
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                    }
                ]
            })
        }
    }

    get_product_sales(dates, branch) {
        if (dates) {

            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                            branch_id: { [Op.in]: branch }
                        }, include: [
                            { model: productsModel, as: "product_info" },
                            { model: BrancheModel, as: "branch_info" },
                            { model: IVAModel, as: "iva_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            }
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        }, include: [
                            { model: productsModel, as: "product_info" },
                            { model: BrancheModel, as: "branch_info" },
                            { model: IVAModel, as: "iva_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            }
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                            branch_id: { [Op.in]: branch }
                        }, include: [
                            { model: productsModel, as: "product_info" },
                            { model: BrancheModel, as: "branch_info" },
                            { model: IVAModel, as: "iva_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            }
                        ]
                    })

                }
                else {
                    console.log("Start Only Block")


                    return OrderedProductsModel.findAll({
                        where: {
                            createdAt: {
                                [Op.and]:
                                    [
                                        {
                                            [Op.gte]: moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                                        },
                                        {
                                            [Op.lte]: moment(dates.start).utc().tz(constants.TIME_ZONE).endOf('day')
                                        }
                                    ],
                            },
                        }, include: [
                            { model: productsModel, as: "product_info" },
                            { model: BrancheModel, as: "branch_info" },
                            { model: IVAModel, as: "iva_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                            }
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return OrderedProductsModel.findAll({
                where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    }
                }, include: [
                    { model: productsModel, as: "product_info" },
                    { model: BrancheModel, as: "branch_info" },
                    { model: IVAModel, as: "iva_info" },
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                    }
                ]
            })
        }
        else {
            console.log("branch Only Block")

            return OrderedProductsModel.findAll({
                where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    },
                    branch_id: { [Op.in]: branch }
                }, include: [
                    { model: productsModel, as: "product_info" },
                    { model: BrancheModel, as: "branch_info" },
                    { model: IVAModel, as: "iva_info" },
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                    }
                ]
            })
        }
    }
}

module.exports.orderRepository = new OrderRepository()