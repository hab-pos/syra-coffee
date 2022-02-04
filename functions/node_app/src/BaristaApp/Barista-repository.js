const { BaristaModel, ClockinModel } = require('./Barista-model')
const { comparePassword } = require('../../Utils/Common/crypto')
const { BrancheModel } = require('../Branch-app/Branch-model');
const { TransactionInModel, OrdersModel } = require('../OrdersApp/orders-model')

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const { constants } = require('../../Utils/constants')
class BaristaRepository {
    async addBarista(barista_name, password, admin_id) {
        let count = await BaristaModel.count()
        var color = Math.floor(0x1000000 * (Math.random() + count)).toString(16);
        var colorString = '#' + ('000000' + color).slice(-6);
        return BaristaModel.create({
            barista_name: barista_name,
            password: password,
            created_by: admin_id,
            color: colorString
        });
    }

    get_all_baristas() {
        return BaristaModel.findAll({where : {is_deleted : false},
            order: [
                ["createdAt", "DESC"]
            ]
        })
    }

    get_barista_details(query) {
        return BaristaModel.findOne({ where: query })
    }
    async get_branchInfo(device_id) {
        let branch = await BrancheModel.findOne({ where: { device_id: device_id } })
        return branch
    }

    update_login_status(user_id, status) {
        return BaristaModel.update({ is_logged_in: status }, {
            where:
            {
                _id: user_id
            }
        })
    }

    update_password(id, hash) {
        return BaristaModel.update({ password: hash }, {
            where: {
                _id: id
            }
        })
    }

    update_user_name(id, user_name) {
        return BaristaModel.update({ barista_name: user_name }, {
            where: {
                _id: id
            }
        })
    }

    update_user_and_pwd(id, user_name, pwd) {
        return BaristaModel.update({ password: pwd, barista_name: user_name }, {
            where: {
                _id: id
            }
        })
    }

    delete_barista(_id) {
        return BaristaModel.update({ is_deleted : true }, {
            where: {
                _id: _id
            }
        })    
    }


    isUniqueName(name) {
        return BaristaModel.findOne({ where: { "barista_name": name } })
    }

    async compare_password(barista_name, password) {
        var barista_details = await this.get_barista_details({ "barista_name": barista_name })
        if (barista_details) {
            return await comparePassword(password, barista_details.password).then((status) => {
                return { status, barista_details }
            })
        } else {
            return { status: false, barista_details: null }
        }
    }

    //create clockin data
    addClockin(barista_id, branch_id, current_time_slot, type, is_active) {
        return ClockinModel.create({
            barista_id: barista_id,
            branch_id: branch_id,
            time_slot: current_time_slot,
            type: type,
            is_active: is_active,
            loginTime: moment().toDate()
        });
    }

    //clock_out
    clock_out(branch_id, barista_id) {
        return ClockinModel.update(
            {
                is_deleted: true,
                logoutTime: moment().toDate()
            },
            {
                where:
                {
                    branch_id: branch_id,
                    barista_id: barista_id,
                    createdAt:
                    {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                }
            }
        )
    }

    //switch_user
    switch_user(branch_id, barista_id, status) {
        //console.log(branch_id,barista_id,status)
        return ClockinModel.update(
            {
                is_active: status
            },
            {
                where:
                {
                    branch_id: branch_id,
                    barista_id: barista_id,
                    createdAt:
                    {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                }
            }
        )
    }

    //create clockin data
    getClockin(branch_id) {
        return ClockinModel.findAll(
            {
                where:
                {
                    branch_id: branch_id,
                    createdAt:
                    {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                    is_deleted: false
                },
                include:
                    [
                        { model: BrancheModel, as: "branch_info" },
                        { model: BaristaModel, as: "barista_info" }
                    ],
                order: [
                    ["createdAt", "DESC"]
                ]
            }
        )
    }

    getClockinRecord(branch_id, barista_id) {
        return ClockinModel.findOne(
            {
                where:
                {
                    branch_id: branch_id,
                    barista_id: barista_id,
                    createdAt:
                    {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                    is_deleted: false
                },
                include:
                    [
                        { model: BrancheModel, as: "branch_info" },
                        { model: BaristaModel, as: "barista_info" }
                    ],
                order: [
                    ["createdAt", "ASC"]
                ]
            }
        )
    }

    clock_out_all(branch_id) {
        return ClockinModel.update(
            {
                is_deleted: true,
                logoutTime: moment().toDate()
            },
            {
                where:
                {
                    branch_id: branch_id,
                    createdAt:
                    {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                    logoutTime: null
                }
            }
        )
    }

    getReport(dates, branch) {
        console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return ClockinModel.findAll({
                        where:
                        {
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
                            { model: BaristaModel, as: "barista_info" },
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    //done

                    return ClockinModel.findAll({
                        where:
                        {
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
                            { model: BaristaModel, as: "barista_info" },
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")
                    return ClockinModel.findAll({
                        where:
                        {
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
                            { model: BaristaModel, as: "barista_info" },
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")

                    return ClockinModel.findAll({
                        where:
                        {
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
                            { model: BaristaModel, as: "barista_info" },
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")
            //done
            return ClockinModel.findAll({
                where:
                {
                    createdAt: {
                        // [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
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
                },
                include: [
                    { model: BrancheModel, as: "branch_info" },
                    { model: BaristaModel, as: "barista_info" },
                ]
            })
        }
        else {
            console.log("branch Only Block")
            //done

            return ClockinModel.findAll({
                where:
                {
                    branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                include: [
                    { model: BrancheModel, as: "branch_info" },
                    { model: BaristaModel, as: "barista_info" },
                ]
            })
        }
    }


    getReportGraph(dates, branch) {
        console.log(dates, branch)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return ClockinModel.findAll({
                        where:
                        {
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
                                model: BrancheModel, as: "branch_info"
                            },
                            { model: BaristaModel, as: "barista_info" },
                        ],
                        order: [
                            ["loginTime", "ASC"]
                        ]
                    })
                }
                else {
                    console.log("Dates only")
                    //done

                    return ClockinModel.findAll({
                        where:
                        {
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
                            { model: BaristaModel, as: "barista_info" },
                        ],
                        order: [
                            ["loginTime", "ASC"]
                        ]
                    })
                }
            }
            else {
                if (branch != null) {
                    console.log("Start and branch Only Block")
                    return ClockinModel.findAll({
                        where:
                        {
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
                                model: BrancheModel, as: "branch_info"
                            },
                            { model: BaristaModel, as: "barista_info" },
                        ],
                        order: [
                            ["loginTime", "ASC"]
                        ]
                    })
                }
                else {
                    console.log("Start Only Block")

                    return ClockinModel.findAll({
                        where:
                        {
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
                            { model: BaristaModel, as: "barista_info" },
                        ],
                        order: [
                            ["loginTime", "ASC"]
                        ]
                    })
                }
            }
        }
        else if (branch == null && dates == null) {
            console.log("no date and no branch  Block")
            //done
            return ClockinModel.findAll({
                where:
                {
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
                },
                include: [
                    { model: BrancheModel, as: "branch_info" },
                    { model: BaristaModel, as: "barista_info" },
                ],
                order: [
                    ["loginTime", "ASC"]
                ]
            })
        }
        else {
            console.log("branch Only Block")
            //done

            return ClockinModel.findAll({
                where:
                {
                    branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                include: [
                    {
                        model: BrancheModel, as: "branch_info"
                    },
                    { model: BaristaModel, as: "barista_info" },
                ],
                order: [
                    ["loginTime", "ASC"]
                ]
            })
        }
    }


    //in

    getBarista_transaction(dates, branch, barista_id) {
        console.log(dates, branch, barista_id)
        if (dates) {
            if (dates.start != null && dates.end != null) {
                if (branch != null) {

                    console.log("date and branch  Block")

                    return TransactionInModel.findAll({
                        where: {
                            branch_id: branch,
                            barista_id: barista_id,
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
                        }, attributes: [
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        ],
                        include: [
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
                    //done


                    return TransactionInModel.findAll({
                        where: {
                            barista_id: barista_id,
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
                        attributes: [
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        ],
                        include: [
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

                    return TransactionInModel.findAll({
                        where: {
                            barista_id: barista_id,
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
                            },
                        },
                        attributes: [
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        ],
                        include: [
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
                    return TransactionInModel.findAll({
                        where: {
                            barista_id: barista_id,
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
                        }, attributes: [
                            [Sequelize.fn('COUNT', '_id'), 'count'],
                            [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                        ],
                        include: [
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
            //done

            return TransactionInModel.findAll({
                where: {
                    barista_id: barista_id,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    },
                }, attributes: [
                    [Sequelize.fn('COUNT', '_id'), 'count'],
                    [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                ],
                include: [
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
            //done

            return TransactionInModel.findAll({
                where: {
                    barista_id: barista_id,
                    branch_id: branch,
                    createdAt: {
                        [Op.gte]: moment().utc().tz(constants.TIME_ZONE).startOf('day')
                    }
                },
                attributes: [
                    [Sequelize.fn('COUNT', '_id'), 'count'],
                    [Sequelize.fn('sum', Sequelize.col('total_amount')), 'total_amount'],
                ],
                include: [
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

module.exports.baristaRepository = new BaristaRepository()