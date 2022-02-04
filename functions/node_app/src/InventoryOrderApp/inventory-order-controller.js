const { inventoryOrderRepository } = require('./inventory-order-repository')
const { settingsRepository } = require('../Settings-app/settings-repository')
const moment = require('moment');
const { createInvoice } = require("./createInvoice");
const { constants } = require('../../Utils/constants');
const { InventoryReportModel } = require('../Inventory-report/inventory-report-model');
const { InventoryOrderModel } = require('./inventory-order-model');
const { InventoryReportRepository } = require('../Inventory-report/inventory-report-repository');

module.exports.add_order = async function (req, res, _) {
    const { device_id, ordered_by, number_of_products, comment_by_barista, ordered_items } = req.body
    let requestObj = Object()

    console.log("guru", ordered_items.length)
    if (ordered_items.length > 0) {
        inventoryOrderRepository.get_branchInfo(device_id).then(branch => {
            if (branch) {
                requestObj.order_date = moment()
                requestObj.ordered_branch = branch._id
                requestObj.received_by = null
                requestObj.ordered_by = ordered_by
                requestObj.delivery_date = null
                requestObj.number_of_products = number_of_products
                requestObj.status = "pending"
                requestObj.comment_by_barista = comment_by_barista
                requestObj.admin_msg = null
                requestObj.ordered_items = JSON.stringify(ordered_items)
                inventoryOrderRepository.createOrder(requestObj).then(info => {
                    res.api(200, "inventory order placed successfully", info, true)
                })
            }
            else {
                res.api(404, "IPAD Not registered to branch", null, false)
            }
        })
    }
    else {
        res.api(200, "please select products to order", null, true)
    }

}

module.exports.get_orders = async function (req, res, _) {
    const { id, device_id } = req.body

    console.log(req.body)
    let response = new Object()
    if (device_id) {
        inventoryOrderRepository.get_branchInfo(device_id).then(branch_info => {
            if (branch_info) {
                let inventories = []
                inventoryOrderRepository.get_branch_orders(branch_info._id).then(order_details => {
                    inventoryOrderRepository.get_inventories(null).then(inventories_list => {
                        inventories_list.forEach(element => {
                            if (element.available_branches.includes(branch_info._id)) {
                                inventories.push(element)
                            }
                        });
                        inventoryOrderRepository.get_branch_orders_not_delivered(branch_info._id).then(list => {
                            let order_parsable = JSON.parse(JSON.stringify(order_details))
                            let remaining = JSON.parse(JSON.stringify(list))
                            let total = order_parsable.concat(remaining)
                            response.order_details = total
                            response.inventories_list = inventories
                            res.api(200, "orders for your branch are retrived successfully", response, true)
                        })
                    })
                })
            }
            else {
                res.api(200, "IPAD Not registered to Branch", null, false)
            }
        })
    }
    else {
        inventoryOrderRepository.getInventoryOrders(id).then(order_details => {
            // let details = JSON.parse(JSON.stringify(order_details))
            // details.forEach(element => {
            //     if (element.status == "declained") {
            //         element.status = "declined"
            //     }
            // });
            res.api(200, "orders retrived successfully", { order_details: order_details }, true)
        })
    }
}

module.exports.reorder = async function (req, res, _) {
    const { data, id, branch_list, admin_msg, number_of_products } = req.body
    if (id != null && id != undefined && id != "") {
        await InventoryOrderModel.update({ ordered_items: JSON.stringify(data) }, { where: { _id: id } })
        let record = await InventoryOrderModel.findOne({ where: { _id: id } })
        res.api(200, "order updated successfully", { order_details: record }, true)
    }
    else {

        for (let index = 0; index < branch_list.length; index++) {
            const branch_id = branch_list[index];
            let requestObj = Object()
            requestObj.order_date = moment()
            requestObj.ordered_branch = branch_id
            requestObj.received_by = null
            requestObj.ordered_by = null
            requestObj.delivery_date = null
            requestObj.number_of_products = number_of_products
            requestObj.status = "pending"
            requestObj.comment_by_barista = null
            requestObj.admin_msg = admin_msg
            requestObj.ordered_items = JSON.stringify(data)
            console.log(data)
            await inventoryOrderRepository.createOrder(requestObj);
        }
        return res.api(200, "inventory order placed successfully", null, true)
    }

}
module.exports.update_order = async function (req, res, _) {

    if (req.body.ordered_items) {
        if (req.body.ordered_items.length == 0) {
            res.api(200, "please select the products to place order", null, true)
            res.end()
        }
        req.body.ordered_items = JSON.stringify(req.body.ordered_items)
    }
    if (req.body.status == "delivered") {
        req.body.delivery_date = moment()
    }
    let record = await InventoryOrderModel.findOne({ where: { _id: req.body.id } })
    const branch_id = record.ordered_branch
    let lastrecord_inv_report = await InventoryReportModel.findAll({
        where: { branch_id: branch_id, is_deleted: false }, order: [
            ["createdAt", "DESC"]
        ], limit: 1
    })

    current_espresso_orders_count = 0

    record.ordered_items.forEach(element => {
        if (element.inventory_name.toLowerCase() == 'espresso') {
            current_espresso_orders_count += element.qty
        }
    });

    inventory_record_unupdated = lastrecord_inv_report.length > 0 && lastrecord_inv_report[0].final_remaining == -1 && lastrecord_inv_report[0].total_consumption == -1
    inventory_unupdated_id = lastrecord_inv_report.length > 0 ? lastrecord_inv_report[0]._id : null
    inventoryOrderRepository.updateOrder(req.body).then(update_success => {
        if (req.body.status == "delivered") {
            let request = new Object()
            let inv_report_request = new Object()
            request.date_of_transaction = moment()
            request.type = "inventory-order"
            request.barista_id = req.body.received_by
            request.iva_id = req.body.iva_id
            request.mode_of_payment = req.body.mode_of_payment
            request.invoice_number = req.body.invoice_number

            let index = 0
            console.log("order_id", JSON.parse(req.body.ordered_items))
            let order_list = JSON.parse(req.body.ordered_items)
            order_list.forEach(inventory => {
                request.reason = inventory.refernce + "-" + inventory.inventory_name
                request.total_amount = Number(inventory.price) != null ? Number(inventory.price) : 0
                inventoryOrderRepository.createTxn(request).then(txn => {
                    index += 1
                    console.log("index", index, "length", req.body.ordered_items.length)
                    if (index == order_list.length) {
                        let date = lastrecord_inv_report.length > 0 ? lastrecord_inv_report[0].createdAt : null
                        inv_report_request.created_date = moment()
                        inv_report_request.date_of_week = moment()
                        InventoryReportRepository.get_report(branch_id).then(reports => {
                            InventoryReportRepository.get_last_week_orders(branch_id, date).then(order_list => {
                                let weekly_shipped = 0
                                order_list.forEach(element => {
                                    element.ordered_items.forEach(element_item => {
                                        if (element_item.inventory_name.toLowerCase() == 'espresso') {
                                            weekly_shipped += element_item.qty
                                        }
                                    });
                                });
                                inv_report_request.weekly_shipped = weekly_shipped // weeekly shipped
                                inv_report_request.quantity_at_week_start = (reports.length > 0) ? Number(reports[0].final_remaining) + Number(inv_report_request.weekly_shipped) : Number(inv_report_request.weekly_shipped) // week start
                                inv_report_request.final_remaining = -1 // final remaining
                                inv_report_request.total_consumption = -1
                                inv_report_request.branch_id = branch_id
                                if (inventory_record_unupdated) {
                                    InventoryReportModel.update({ weekly_shipped: lastrecord_inv_report[0].weekly_shipped + current_espresso_orders_count, quantity_at_week_start: lastrecord_inv_report[0].quantity_at_week_start + current_espresso_orders_count }, { where: { _id: inventory_unupdated_id } }).then(result => {
                                        return res.api(200, "updated successfully", null, true)
                                    })
                                }
                                else {
                                    if (weekly_shipped > 0) {
                                        InventoryReportRepository.create_report(inv_report_request).then(result => {
                                            return res.api(200, "updated successfully", null, true)
                                        })
                                    }
                                    else {
                                        return res.api(200, "updated successfully", null, true)
                                    }
                                }

                            })
                        })
                    }
                })
            });
        }
        else {
            (update_success[0] > 0) ? res.api(200, "updated successfully", null, true) : res.api(404, "no orders found", null, false)
        }
    })
}

module.exports.delete_order = async function (req, res, _) {
    const { id } = req.body
    inventoryOrderRepository.deleteOrder(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "order info deleted successfully", null, true) : res.api(404, "No order found", null, false)
    })
}

module.exports.get_brach_orders = function (req, res, _) {
    const { branch_id, start, end } = req.body

    //done
    if (start != undefined && end != undefined && branch_id != undefined) {
        inventoryOrderRepository.get_branches_and_dates(branch_id, start, end).then(order_details => {
            res.api(200, "orders retrived successfully", { order_details }, true)
        })
    }
    else if (start != undefined && branch_id != undefined && end == undefined) {
        inventoryOrderRepository.get_branches_and_StartDate(branch_id, start).then(order_details => {
            res.api(200, "orders retrived successfully", { order_details }, true)
        })
    }
    //done
    else if (start == undefined && end == undefined && branch_id != undefined) {
        console.log("branch only")
        inventoryOrderRepository.get_branch_orders(branch_id).then(order_details => {
            res.api(200, "orders retrived successfully", { order_details }, true)
        })
    }
    //done
    else if (start != undefined && end != undefined && branch_id == undefined) {
        console.log("date only")
        inventoryOrderRepository.get_date_orders(start, end).then(order_details => {
            res.api(200, "orders retrived successfully", { order_details }, true)
        })
    }
    //single date only
    else if (start != undefined && end == undefined && branch_id == undefined) {
        inventoryOrderRepository.get_orders_only_with_start_date(start).then(order_details => {
            res.api(200, "orders retrived successfully", { order_details }, true)
        })
    }
}

module.exports.printOrder = async function (req, res, _) {
    const invoice = {
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
            email: "guru@waioz.com",
        },
        items: [
            {
                product_name: "Espresso",
                quantity: 2,
                total_price: 24
            },
            {
                product_name: "Falooda",
                quantity: 1,
                total_price: 24
            }
        ],
        discount: 10,
        admin_msg: "",
        user_message: "",
    };

    const { orderInfo, products } = req.body
    let settings = await settingsRepository.getAllSettings()

    console.log(orderInfo)

    invoice.client.email = orderInfo.ordered_by_details != null ? orderInfo.ordered_by_details.barista_name : "ADMIN"
    invoice.items = orderInfo.ordered_items
    invoice.admin_msg = orderInfo.admin_msg || "NO Comments"
    invoice.user_message = orderInfo.comment_by_barista
    invoice.branch = orderInfo.branch_info.branch_name
    invoice.order_ref = orderInfo._id.substring(orderInfo._id.length - 4).toUpperCase()
    invoice.date = orderInfo.created_date
    invoice.status = orderInfo.status.toUpperCase()
    invoice.received_by = orderInfo.recieved_by_details == null ? "NA" : orderInfo.recieved_by_details.barista_name
    settings.forEach(element => {
        switch (element.code) {
            case "logo":
                // invoice.logo = "./assets/logos/" + element.value
                break;
            case "Nombre del establecimiento":
                invoice.establishment = element.value
                break;
            case "Email":
                invoice.company_email = element.value
                break;
            case "Direccion":
                invoice.address = element.value
                break;
            default:
                break;
        }
    });

    let date = moment().format('X')
    let os = require('os')
    let title = invoice.branch.replace(/ /g, '').toUpperCase() + "_INVENTORY-REPORT_" + moment(orderInfo.createdAt).format("DD-MM-YYYY")
    await createInvoice(invoice, os.tmpdir() + "/" + title + ".pdf");
    return res.api(200, "records retrived successfully", { url: constants.HOST + "assets/reciepts/" + title + ".pdf", title: title }, true)

}