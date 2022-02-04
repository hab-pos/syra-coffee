const { InventoryReportModel } = require('./inventory-report-model')
const { BrancheModel } = require('../Branch-app/Branch-model');
const { InventoryOrderModel } = require("../InventoryOrderApp/inventory-order-model")
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const moment = require('moment');
const { constants } = require('../../Utils/constants')

class InventoryReportRepository {
    create_report(request) {
        return InventoryReportModel.create({
            date_of_week: request.date_of_week,
            branch_id: request.branch_id,
            weekly_shipped: request.weekly_shipped,
            quantity_at_week_start: request.quantity_at_week_start,
            final_remaining: request.final_remaining,
            total_consumption: request.total_consumption
        })
    }
    get_report(branch_id) {
        return InventoryReportModel.findAll({
            where: { branch_id: branch_id,is_deleted : false }, order: [
                ["date_of_week", "DESC"]
            ]
        })
    }
    get_report_limit(branch_id,limit = 10) {
        return InventoryReportModel.findAll({
            where: { branch_id: branch_id,is_deleted : false }, order: [
                ["date_of_week", "DESC"]
            ],limit : limit
        })
    }
    get_branchInfo(device_id) {
        return BrancheModel.findOne({ where: { device_id: device_id } })
    }

    get_last_week_orders(branch_id,date) {

        if(date == null){
            return InventoryOrderModel.findAll({
                where: {
                    ordered_branch: branch_id, status: "delivered", order_date: {
                        [Op.gte]: moment().subtract(7, 'days').utc()
                    },
                    is_deleted : false
                }
            })
        }
        else{
            return InventoryOrderModel.findAll({
                where: {
                    ordered_branch: branch_id, status: "delivered", delivery_date: {
                        [Op.gte]: moment(date).utc()
                    },
                    is_deleted : false
                }
            })
        }

    }

    filter_with_start_and_end(start, end, branch_id) {
        return InventoryReportModel.findAll({
            where: {
                branch_id: branch_id,
                date_of_week:
                {
                    [Op.and] : 
                    [
                        {
                            [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                        {
                            [Op.lte]: moment(end).utc().tz(constants.TIME_ZONE).endOf('day')
                        }
                    ]
                    
                },
                is_deleted : false
            }, 
            order: [
                ["date_of_week", "DESC"]
            ]
        })
    }
    filter_with_start(start, branch_id) {
        return InventoryReportModel.findAll({
            where: 
            {   branch_id: branch_id,
                date_of_week:
                {
                    [Op.and] : 
                    [
                        {
                            [Op.gte]: moment(start).utc().tz(constants.TIME_ZONE).startOf('day')
                        },
                        {
                            [Op.lte]: moment(start).utc().tz(constants.TIME_ZONE).endOf('day')
                        }
                    ]
                } ,
                is_deleted : false
            }, 
            order: [
                ["date_of_week", "DESC"]
            ]
        })
    }
}

module.exports.InventoryReportRepository = new InventoryReportRepository()