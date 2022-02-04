const { InventoryReportRepository } = require('./inventory-report-repository')
const moment = require('moment');
const { report } = require('process');
const { InventoryReportModel } = require('./inventory-report-model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { constants } = require('../../Utils/constants')
module.exports.add_order = async function (req, res, _) {
    const { device_id, final_remaining } = req.body
    // let request = new Object()
    let branch = await InventoryReportRepository.get_branchInfo(device_id)
    if (branch) {
        // request.date_of_week = moment()
        // request.branch_id = branch._id


        let record = await InventoryReportModel.findAll({ // change record to lastrecord in case if you change the c ode as previous
            where: { branch_id: branch._id, is_deleted: false }, order: [
                ["createdAt", "DESC"]
            ], limit: 1
        })

        let total_consumption = record.length > 0 ? (record[0].quantity_at_week_start - final_remaining) : 0
        if (total_consumption < 0) {
            return res.api(200, "Your remaining is greater than the totalstock you have!", null, true)

        }
        else {
            await InventoryReportModel.update({ final_remaining: final_remaining, total_consumption: total_consumption, createdAt: moment().toDate() }, {
                where: {
                    _id: record.length > 0 ? record[0]._id : ""
                }
            })
        }

        let data_to_pass = await InventoryReportModel.findOne({ where: { _id: record.length > 0 ? record[0]._id : "" } })
        res.api(200, "report generated successfully", data_to_pass, true)


        // let date = lastrecord.length == 0 ? null : lastrecord[0].createdAt
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
    }
    else {
        res.api(200, "IPAD Not registered to Branch", null, false)
    }

}

module.exports.get_orders = async function (req, res, _) {
    const { branch_id, device_id } = req.body

    if (device_id) {
        let branch = await InventoryReportRepository.get_branchInfo(device_id)
        let reports = await InventoryReportRepository.get_report_limit(branch._id, 10)

        let reportJSON = JSON.parse(JSON.stringify(reports))
        // un comment while testflight
        for (let index = 0; index < reportJSON.length; index++) {
            var element = reportJSON[index];
            element.total_stock = Number(element.quantity_at_week_start).toFixed(2)
            element.weekly_shipped = Number(element.weekly_shipped).toFixed(2)
            element.quantity_at_week_start = (Number(element.quantity_at_week_start) - Number(element.weekly_shipped)).toFixed(2)
            element.final_remaining = element.final_remaining == -1 ? "-" : Number(element.final_remaining).toFixed(2)
            element.total_consumption = element.total_consumption == -1 ? "-" : Number(element.total_consumption).toFixed(2)
            reportJSON[index] = element

            //created Date manuplation
            if (reportJSON[index].final_remaining != -1) {
                if (index == reportJSON.length - 1) {
                    reportJSON[index].created_date = moment(reportJSON[index].date_of_week).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM")
                }
                else {
                    reportJSON[index].created_date = moment(reportJSON[index + 1].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM")
                }
            }
            else {
                if (index == reportJSON.length - 1) {
                    reportJSON[index].created_date = moment(reportJSON[index].date_of_week).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM")
                }
                else {
                    reportJSON[index].created_date = moment(reportJSON[index + 1].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM") + " - "
                }
            }
        }
        return res.api(200, "Reports retrived", reportJSON, true)
    }
    else {
        // let request = new Object()
        // let lastrecord = await InventoryReportModel.findAll({
        //     where: { branch_id: branch_id }, order: [
        //         ["createdAt", "DESC"]
        //     ], limit: 1
        // })

        // let date = lastrecord.length == 0 ? null : lastrecord[0].createdAt
        // console.log(date)
        // request.created_date = moment().format("DD/MM/YYYY")
        InventoryReportRepository.get_report(branch_id).then(reports => {
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

            let reportJSON = JSON.parse(JSON.stringify(reports))

            for (let index = 0; index < reportJSON.length; index++) {
                if (reportJSON[index].final_remaining != -1) {
                    if (index == reportJSON.length - 1) {
                        reportJSON[index].created_date = moment(reportJSON[index].date_of_week).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm")
                    }
                    else {
                        reportJSON[index].created_date = moment(reportJSON[index + 1].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm")
                    }
                }
                else {
                    if (index == reportJSON.length - 1) {
                        reportJSON[index].created_date = moment(reportJSON[index].date_of_week).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - " + moment(reportJSON[index].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm")
                    }
                    else {
                        reportJSON[index].created_date = moment(reportJSON[index + 1].createdAt).utc().tz(constants.TIME_ZONE).format("DD/MM HH:mm") + " - "
                    }
                }
            }
            res.api(200, "Reports retrived", reportJSON, true)
        })
    }
}

module.exports.filter_reports = async function (req, res, _) {
    const { selected_date, branch_id } = req.body

    if (selected_date.start && selected_date.end) {
        InventoryReportRepository.filter_with_start_and_end(selected_date.start, selected_date.end, branch_id).then(reports => {
            res.api(200, "Reports retrived", reports, true)
        })
    }
    else {
        InventoryReportRepository.filter_with_start(selected_date.start, branch_id).then(reports => {
            res.api(200, "Reports retrived", reports, true)
        })
    }
}

module.exports.update = async function (req, res, _) {
    let data = await InventoryReportModel.findOne({ where: { _id: req.body._id } })
    let request

    console.log(req.body)
    if (req.body.final_remaining < 0) {
        return res.api(200, "Invalid remaining Value", {}, false)
    }
    else if(req.body.final_remaining > data.quantity_at_week_start){
        return res.api(200, "Remaining cannot exceed total quantity!", {}, false)
    }
    else {
        if (data.final_remaining != -1) {
            request = { weekly_shipped: Number(req.body.weekly_shipping), quantity_at_week_start: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping), final_remaining: Number(req.body.final_remaining), total_consumption: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping) - Number(req.body.final_remaining) }
        }
        else {
            console.log(data)
            if (req.body.final_remaining != null && req.body.final_remaining != undefined && req.body.final_remaining != '-') {
                request = { weekly_shipped: Number(req.body.weekly_shipping), quantity_at_week_start: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping), final_remaining: Number(req.body.final_remaining), total_consumption: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping) - Number(req.body.final_remaining) }
            }
            else {
                request = { weekly_shipped: Number(req.body.weekly_shipping), quantity_at_week_start: Number(data.quantity_at_week_start) - Number(data.weekly_shipped) + Number(req.body.weekly_shipping) }
            }
        }
        // console.log(request, data)
        await InventoryReportModel.update(request, { where: { _id: req.body._id } })
        let current_report = await InventoryReportModel.findOne({ where: { _id: req.body._id } })

        if (current_report.final_remaining != data.final_remaining) {
            let upcommingReports = await InventoryReportModel.findAll({
                where: {
                    createdAt: {
                        [Op.gt]: current_report.createdAt
                    }, branch_id: current_report.branch_id
                },
                order: [
                    ["date_of_week", "ASC"]
                ], limit: 1
            })

            if (upcommingReports.length > 0) {
                const element = upcommingReports[0];
                let request_next_update = { weekly_shipped: Number(element.weekly_shipped), quantity_at_week_start: Number(element.weekly_shipped) + Number(current_report.final_remaining), final_remaining: Number(element.final_remaining), total_consumption: Number(element.weekly_shipped) + Number(current_report.final_remaining) - Number(element.final_remaining) }
                current_report.final_remaining = element.final_remaining
                await InventoryReportModel.update(request_next_update, { where: { _id: element._id } })
            }
        }
        return res.api(200, "Reports updated successfully", {}, true)
    }
}
module.exports.deleteAct = async function (req, res, _) {

    await InventoryReportModel.destroy({ where: { _id: req.body._id } })
    res.api(200, "Reports deleted successfully", null, true)
}