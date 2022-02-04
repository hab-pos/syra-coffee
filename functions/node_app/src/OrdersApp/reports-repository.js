
const { BaristaModel } = require("../BaristaApp/Barista-model");
const { ExpenseTableModel } = require("../ExpenseApp/Expense-model");
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
const { constants } = require('../../Utils/constants')

class ReportRepository {

    async getTotalBillings(dates, branch) {

        console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return TransactionInModel.findAll({
                        where: {
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
                        },
                        attributes:
                            [
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                            ],
                        include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                }, attributes: [
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                ]
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
                            }
                        },
                        attributes:
                            [
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                            ],
                        include: [
                            {
                                model: OrdersModel, as: "order_info",  where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },attributes: [
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                ]
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
                            branch_id: branch,
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
                        },
                        attributes:
                            [
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                            ],
                        include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                } ,attributes: [
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                ]
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
                            }
                        },
                        attributes:
                            [
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                            ],
                        include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                } ,attributes: [
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                ]
                            },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return TransactionInModel.findAll({
                where:
                {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                attributes:
                    [
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                    ],
                include: [
                    {
                        model: OrdersModel, as: "order_info",  where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },attributes: [
                            [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                        ]
                    },
                ]
            })
        }
        else {
            console.log("branch Only Block")

            return TransactionInModel.findAll({
                where: {
                    branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                attributes:
                    [
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                    ],
                include: [
                    {
                        model: OrdersModel, as: "order_info",  where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },attributes: [
                            [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                        ]
                    },
                ]
            })
        }
    }


    lastWeekDashboardReport(dates, branch) {


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
                            branch_id: branch
                        },
                        attributes:
                            [
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                            ],
                        include: [
                            {
                                model: OrdersModel, as: "order_info",  where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },attributes: [
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                ]
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
                        attributes:
                            [
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                            ],
                        include: [
                            {
                                model: OrdersModel, as: "order_info",  where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },attributes: [
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                ]
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
                            branch_id: branch
                        },
                        attributes:
                            [
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                            ],
                        include: [
                            {
                                model: OrdersModel, as: "order_info",  where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },attributes: [
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                ]
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
                        attributes:
                            [
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                            ],
                        include: [
                            {
                                model: OrdersModel, as: "order_info",  where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },attributes: [
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                ]
                            },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block123123", moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day'))

            return TransactionInModel.findAll({
                where: {
                    createdAt: {
                        [Op.and]:
                            [
                                {
                                    [Op.gte]: moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    },
                },
                attributes:
                    [
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                    ],
                include: [
                    {
                        model: OrdersModel, as: "order_info",  where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },attributes: [
                            [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                        ]
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
                                    [Op.gte]: moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).startOf('day')
                                },
                                {
                                    [Op.lte]: moment().subtract('1', 'day').utc().tz(constants.TIME_ZONE).endOf('day')
                                }
                            ],
                    },
                    branch_id: branch
                },
                attributes:
                    [
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        [Sequelize.fn('count', Sequelize.col('TransactionInModel._id')), 'count'],
                    ],
                include: [
                    {
                        model: OrdersModel, as: "order_info",  where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },attributes: [
                            [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                        ]
                    },
                ]
            })
        }
    }

    get_branch_wise_report(dates, branch) {
        console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return TransactionInModel.findAll({
                        where: {
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
                        },
                        group: ['branch_id'],
                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                                attributes: [
                                    'branch_id',
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                    [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                                ],
                                group: ['branch_id']
                            },
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    //done
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
                            }
                        },
                        group: ['branch_id'],
                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                                attributes: [
                                    'branch_id',
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                    [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                                ],
                                group: ['branch_id']
                            },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")


                    //done
                    return TransactionInModel.findAll({
                        where: {
                            branch_id: branch,
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
                        },
                        group: ['branch_id'],

                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                                attributes: [
                                    'branch_id',
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                    [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                                ],
                                group: ['branch_id']
                            },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")
                    //done
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
                            }
                        },
                        group: ['branch_id'],

                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                                attributes: [
                                    'branch_id',
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                    [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                                ],
                                group: ['branch_id']
                            },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")
            //done
            return TransactionInModel.findAll({
                where:
                {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                group: ['branch_id'],

                attributes:
                    [
                        'branch_id',
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                    ],
                include: [
                    { model: BrancheModel, as: "branch_info" },
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                        attributes: [
                            'branch_id',
                            [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                            [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                        ],
                        group: ['branch_id']
                    },
                ]
            })
        }
        else {
            console.log("branch Only Block")
            //done
            return TransactionInModel.findAll({
                where: {
                    branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                group: ['branch_id'],

                attributes:
                    [
                        'branch_id',
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                    ],
                include: [
                    { model: BrancheModel, as: "branch_info" },
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                        attributes: [
                            'branch_id',
                            [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                            [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                        ],
                        group: ['branch_id']
                    },
                ]
            })
        }
    }


    get_branch_wise_report_graph(dates, branch) {
        console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return TransactionInModel.findAll({
                        where: {
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
                        },
                        include: [
                            { model: BrancheModel, as: "branch_info" },
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
                    //done
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
                            }
                        },
                        include: [
                            { model: BrancheModel, as: "branch_info" },
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


                    //done
                    return TransactionInModel.findAll({
                        where: {
                            branch_id: branch,
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
                        },
                        include: [
                            { model: BrancheModel, as: "branch_info" },
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
                    //done
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
                            }
                        },
                        include: [
                            { model: BrancheModel, as: "branch_info" },
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
            //done
            return TransactionInModel.findAll({
                where:
                {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
               
                include: [
                    { model: BrancheModel, as: "branch_info" },
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
            //done
            return TransactionInModel.findAll({
                where: {
                    branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
               
                include: [
                    { model: BrancheModel, as: "branch_info" },
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
    lastWeekBranchReport(dates, branch) {


        if (dates) {
            let startDate = moment(dates.start)
            let endDate = moment(dates.end)
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return TransactionInModel.findAll({
                        where: {
                            branch_id: branch,
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
                        group: ['branch_id'],
                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                                attributes: [
                                    'branch_id',
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                    [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                                ],
                                group: ['branch_id']
                            },
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    //done
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
                        group: ['branch_id'],
                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                                attributes: [
                                    'branch_id',
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                    [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                                ],
                                group: ['branch_id']
                            },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")
                    //done
                    return TransactionInModel.findAll({
                        where: {
                            branch_id: branch,
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
                        group: ['branch_id'],

                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                                attributes: [
                                    'branch_id',
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                    [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                                ],
                                group: ['branch_id']
                            },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")

                    //done
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
                        group: ['branch_id'],

                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                                [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                            {
                                model: OrdersModel, as: "order_info",
                                where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                },
                                attributes: [
                                    'branch_id',
                                    [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                                    [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                                ],
                                group: ['branch_id']
                            },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            //done
            console.log("no date and no branch  Block")

            return TransactionInModel.findAll({
                where:
                {
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
                },
                group: ['branch_id'],

                attributes:
                    [
                        'branch_id',
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                    ],
                include: [
                    { model: BrancheModel, as: "branch_info" },
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                        attributes: [
                            'branch_id',
                            [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                            [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                        ],
                        group: ['branch_id']
                    },
                ]
            })
        }
        else {
            //dome
            console.log("branch Only Block")

            return TransactionInModel.findAll({
                where: {
                    branch_id: branch,
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
                },
                group: ['branch_id'],

                attributes:
                    [
                        'branch_id',
                        [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                    ],
                include: [
                    { model: BrancheModel, as: "branch_info" },
                    {
                        model: OrdersModel, as: "order_info",
                        where: {
                            [Op.not]:
                                [
                                    { order_status: "cancelled" },
                                ]
                        },
                        attributes: [
                            'branch_id',
                            [Sequelize.fn('sum', Sequelize.col('total_price_with_out_tax')), 'total_amount'],
                            [Sequelize.fn('count', Sequelize.col('order_id')), 'count'],
                        ],
                        group: ['branch_id']
                    },
                ]
            })
        }
    }






    //expense


    get_branch_wise_expense_report(dates, branch) {
        console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return ExpenseTableModel.findAll({
                        where: {
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
                        },
                        group: ['branch_id'],
                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    //done
                    return ExpenseTableModel.findAll({
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
                        },
                        group: ['branch_id'],
                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")

                    return ExpenseTableModel.findAll({
                        where: {
                            branch_id: branch,
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
                        },
                        group: ['branch_id'],
                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")

                    return ExpenseTableModel.findAll({
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
                        },
                        group: ['branch_id'],
                        attributes:
                            [
                                'branch_id',
                                [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return ExpenseTableModel.findAll({
                where: {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                group: ['branch_id'],
                attributes:
                    [
                        'branch_id',
                        [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                    ],
                include: [
                    { model: BrancheModel, as: "branch_info" },
                ]
            })
        }
        else {
            console.log("branch Only Block")
            //done

            return ExpenseTableModel.findAll({
                where: {
                    branch_id: branch,

                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                group: ['branch_id'],
                attributes:
                    [
                        'branch_id',
                        [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                    ],
                include: [
                    { model: BrancheModel, as: "branch_info" },
                ]
            })

        }
    }


    lastWeekBranchExpenseReport(dates, branch) {


        if (dates) {
            let startDate = moment(dates.start)
            let endDate = moment(dates.end)
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return ExpenseTableModel.findAll({
                        where: {
                            branch_id: branch,
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
                        group: ['branch_id'],
                        attributes:
                            [
                                "branch_id",
                                [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    //done
                    let startDate = moment(dates.start)
                    let endDate = moment(dates.end)

                    return ExpenseTableModel.findAll({
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
                        group: ['branch_id'],
                        attributes:
                            [
                                "branch_id",
                                [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")
                    //done

                    return ExpenseTableModel.findAll({
                        where: {
                            createdAt: {
                                branch_id: branch,
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
                        group: ['branch_id'],
                        attributes:
                            [
                                "branch_id",
                                [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")

                    return ExpenseTableModel.findAll({
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
                        group: ['branch_id'],
                        attributes:
                            [
                                "branch_id",
                                [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                            ],
                        include: [
                            { model: BrancheModel, as: "branch_info" },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            //done
            console.log("no date and no branch  Block")

            return ExpenseTableModel.findAll({
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
                },
                group: ['branch_id'],
                attributes:
                    [
                        "branch_id",
                        [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                    ],
                include: [
                    { model: BrancheModel, as: "branch_info" },
                ]
            })
        }
        else {
            //dome
            console.log("branch Only Block")

            return ExpenseTableModel.findAll({
                where: {
                    branch_id: branch,
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
                },
                group: ['branch_id'],
                attributes:
                    [
                        "branch_id",
                        [Sequelize.fn('sum', Sequelize.col('price')), 'total_amount'],
                    ],
                include: [
                    { model: BrancheModel, as: "branch_info" },
                ]
            })
        }
    }


    async getTotalBillingsGraph(dates, branch) {

        console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return TransactionInModel.findAll({
                        where: {
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
                        },
                       
                        include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
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
                            }
                        },
                      
                        include: [
                            {
                                model: OrdersModel, as: "order_info",  where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                }
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
                            branch_id: branch,
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
                        },
                        
                        include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                } ,
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
                            }
                        },
                       
                        include: [
                            {
                                model: OrdersModel, as: "order_info", where: {
                                    [Op.not]:
                                        [
                                            { order_status: "cancelled" },
                                        ]
                                } ,
                            },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")

            return TransactionInModel.findAll({
                where:
                {
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
               
                include: [
                    {
                        model: OrdersModel, as: "order_info",  where: {
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
                    branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
               
                include: [
                    {
                        model: OrdersModel, as: "order_info",  where: {
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
module.exports.OrderReportRepository = new ReportRepository()