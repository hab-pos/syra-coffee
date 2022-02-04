const { OrdersModel, OrderedProductsModel, TransactionInModel, AppliedDiscountsModel } = require("./orders-model")
const { orderRepository } = require("./orders-repository")
const { BrancheModel } = require("../Branch-app/Branch-model");
const { BaristaModel } = require("../BaristaApp/Barista-model");
const { CashFlowModel } = require("./orders-model")
const { InventoryReportModel } = require("../Inventory-report/inventory-report-model")
const { UserOrdersModel,UserModel, AppliedBeans, UserorderedProducts } = require("../User_App/User-model")
const { createInvoice } = require("./createInvoice");
const { settingsRepository } = require('../Settings-app/settings-repository')
const { setupRepository } = require('../SetupApp/setup-repository')
const { constants } = require('../../Utils/constants')
const { OrderReportRepository } = require("./reports-repository")
let os = require('os')

const _ = require('lodash');
const moment = require('moment');
const nodemailer = require('nodemailer');
const { threshold } = require("jimp");
const { response } = require("express");
const { IVAModel } = require("../SetupApp/setup-model");
var admin = require('firebase-admin');

module.exports.add_order = async function (req, res, _) {
    let index = 0
    let user = await UserModel.findOne({where : {_id : req.body.user_id}})
    let order_duplicate = await OrdersModel.findOne({where : {invoice_number : req.body.invoice_number || null,user_id : req.body.user_id || null }})
    if(order_duplicate != null)
    {
        return res.api(200, "order already placed!", order_duplicate, false)
    }
    else{
        orderRepository.get_branchInfo(req.body.device_id).then(branch => {
            if (branch) {
                let orderRequest = orderRepository.gatherOrderInput(req.body)
                orderRequest.branch_id = branch._id || null
                console.log(orderRequest.price_data)
                orderRepository.create_order(orderRequest).then(order_info => {
    
                    if(user != null){
                        let beans_claimed = (req.body.applied_beans != null && req.body.applied_beans != undefined) ? (orderRequest.total_price * 10) -  Number(req.body.applied_beans) : orderRequest.total_price * 10
                        let beans_earned = (Number(user.beansEarnerd) <= 0) || ((Number(user.beansEarnerd) + Number(beans_claimed)) <= 0) ? 0 : Number(user.beansEarnerd) + Number(beans_claimed)
                        UserModel.update({ beansEarnerd: beans_earned.toFixed(0) }, { where: { _id: user._id } })
                        if(req.body.applied_beans != null && req.body.applied_beans != undefined) {
                            AppliedBeans.create({
                                order_id: order_info._id,
                                beans_used: req.body.applied_beans,
                                beans_genrated: beans_earned
                            })
                        }
                        //wallet action
                        for (let index = 0; index < req.body.products_data.length; index++) {
                            const element = req.body.products_data[index];
                            console.log(element)
                            if (element.wallet_id != null && element.wallet_id != "" && element.wallet_id != undefined) {
                                UserorderedProducts.destroy({ where: { UserProductId: element.id, order_id: element.wallet_id, required_modifier_id: element.required_modifier_id || "", optional_modifier_id: element.optional_modifier_id || "", grind_id: element.grind_id || ""} })
                                UserOrdersModel.findOne({ where: { _id: element.wallet_id } }).then(order_info => {
                                    let order_data = order_info.order_data
                                    var item_index = order_data.findIndex(i => ((i.product_id == element.id) && (i.required_modifiers == element.required_modifier_id) && (i.optional_modifiers == element.optional_modifier_id) && (i.grains == element.grind_id)));
                                    order_data.splice(item_index, 1)
                                })
                               
                            }
                        }
                    }
                    orderRepository.createInTransaction(order_info._id, orderRequest.time_elapsed, orderRequest.barista_id, orderRequest.order_status, orderRequest.total_price, orderRequest.branch_id, orderRequest.payment_method)
                    //insert Applied Coupon
                    if (orderRequest.discount_id && orderRequest.discount_data) {
                        orderRepository.create_applied_discounts(order_info._id, orderRequest.discount_id, orderRequest.barista_id, Number(order_info.total_price) - Number(order_info.total_price_with_out_tax)).then(() => {
                            orderRequest.products_data.forEach(product => {
                                orderRepository.createOrderedProduct(orderRequest.date_of_order, order_info._id, product._id, product.category_id, product.iva, product.quantity, product.total_price, orderRequest.payment_method, orderRequest.branch_id).then(() => {
                                    index += 1
                                    if (index == orderRequest.products_data.length) {
                                        res.api(200, "saved successfully", order_info, true)
                                    }
                                })
                            });
                        })
                    }
                    else {
                        orderRequest.products_data.forEach(product => {
                            orderRepository.createOrderedProduct(orderRequest.date_of_order, order_info._id, product._id, product.category_id, product.iva, product.quantity, product.total_price, orderRequest.payment_method, orderRequest.branch_id).then(() => {
                                index += 1
                                if (product.have_discount == 1) {
                                    var discountAmt = 0
                                    if (product.discount_type == "percent") {
                                        discountAmt = Number(product.price) * Number(product.discount_price) / 100
                                    }
                                    else {
                                        discountAmt = product.discount_price
                                    }
                                    orderRepository.create_applied_discounts(order_info._id, product.discount_id, orderRequest.barista_id, discountAmt)
                                }
                                if (index == orderRequest.products_data.length) {
                                    res.api(200, "saved successfully", order_info, true)
                                }
                            })
                        });
                    }
                })
            }
            else {
                res.api(200, "IPAD is not registerd to any Branches", null, false)
            }
        })
    }
}
const invoice = {
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


module.exports.sendMail = async function (req, res, next) {

    const { email, order_id, device_id } = req.body

    let branch = await orderRepository.get_branchInfo(device_id)
    let order = await orderRepository.get_orders(order_id)
    let settings = await settingsRepository.getAllSettings()
    let id = await TransactionInModel.findOne({
        where: {
            order_id: order_id
        }
    })
    console.log(id)
    invoice.client.email = email
    invoice.items = order.products_data
    console.log(order.products_data)
    settings.forEach(element => {
        switch (element.code) {
            case "logo":
                invoice.logo = "./assets/logos/logo.png"
                break;
            case "Nombre del establecimiento":
                invoice.establishment = element.value
                break;
            case "Nombre del la sociedad":
                invoice.company_name = element.value
                break;
            case "Code NIF":
                invoice.nif = element.value
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

    invoice.admin_message = "¡Hola! Gracias por venir a Syra Coffee. Si desea una factura, no dude en \n escribirnos a info@syra.coffee con una foto de su recibo y sus datos de facturación y se \n la enviaremos lo antes posible. ¡Gracias!"
    invoice.branch = branch.branch_name
    invoice.order_ref = id._id
    invoice.date = moment().format("DD/MM/YYYY hh:mm a")
    invoice.subtotal = order.price_data.total_price_with_iva
    invoice.discount = (Number(order.price_data.total_price_with_iva) - Number(order.price_data.total_payable)).toFixed(2)
    console.log("data", invoice)
    let os = require('os')
    let title = "F" + invoice.order_ref + "_" + moment().format("DD-MM-YYYY") + "_SYRA-COFFEE"
    await createInvoice(invoice, os.tmpdir() + "/" + title + ".pdf");
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'facturas@syra.coffee',
            pass: 'qnbjgmwtxlkmezaa'
        }
    });

    var mailOptions = {
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

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.api(200, "cannot send Mail", error, false)
        }
        res.api(200, "Email sent", null, true)
    });
}

module.exports.get_orders = async function (req, res, _) {
    const { id, device_id, status } = req.body
    if (device_id || status) {
        let branch_info = await orderRepository.get_branchInfo(device_id)
        let last = await orderRepository.get_last_record(branch_info._id)
        console.log(last.reference)
        let discount = await setupRepository.get_Discounts()

        console.log(branch_info)
        if (branch_info) {

            let cashFlow = await CashFlowModel.findAll({
                where: { branch_id: branch_info._id, close_time: null }, order: [
                    ["createdAt", "DESC"]
                ], limit: 1
            })
            if (cashFlow.length > 0) {
                let openTime = moment(cashFlow[0].open_time)

                orderRepository.get_orders(id, branch_info._id, status, openTime).then(order_list => {
                    let reference = orderRepository.generate_reference(last.length > 0 ? last[0].reference : null)
                    res.api(200, "orders retrived successfully", { order_list, reference, discount }, true)
                })
            }
            else {
                let reference = orderRepository.generate_reference(last.length > 0 ? last[0].reference : null)
                res.api(200, "orders retrived successfully", { order_list: [], reference, discount }, true)
            }


        }
        else {
            res.api(200, "IPAD is not registerd to any Branches", null, false)
        }
    }
    else {
        let order_list = id ? await OrdersModel.findOne({
            where: { _id: id }, include: [{
                model: BrancheModel, as: "branch_info"
            }, { model: BaristaModel, as: "barista_info" }]
        }) : await OrdersModel.findAll({
            include: [{
                model: BrancheModel, as: "branch_info"
            }, { model: BaristaModel, as: "barista_info" }]
        })
        res.api(200, "orders retrived successfully", order_list, true)

    }
}
module.exports.update_order = async function (req, res, _) {
    const { id, status, cancel_reason } = req.body
    let order = await OrdersModel.findOne({where : {
        _id : id
    }})
    let user_order =  await UserOrdersModel.findOne({where: {_id : order.invoice_number}})
    let user = await UserModel.findOne({where : {_id : order.user_id }})
    orderRepository.update_order_staus(id, status, cancel_reason).then(update_success => {
        if(order.user_id != null && status == "cancelled"){
            let beans_claimed =  order.total_price * 10
            let beansEarnerd = Number(user.beansEarnerd) - Number(beans_claimed)
            UserModel.update({ beansEarnerd: beansEarnerd <= 0 ? 0 : beansEarnerd }, { where: { _id: user._id } })
        }
        if(order.Payment_method == "APP" ){
             UserOrdersModel.update({ order_status: "closed" }, { where: { _id: user_order._id } }).then(success => {
                let db = admin.database()
                var ref = db.ref("/socket_table");
                ref.child(order.user_id).set({
                    order_id : user_order._id
                });
                return (success[0] > 0) ? res.api(200, "updated successfully", null, true) : res.api(404, "no orders found", null, false)
            })
        }
        else{
            return (update_success[0] > 0) ? res.api(200, "updated successfully", null, true) : res.api(404, "no orders found", null, false)
        }
    })
}
module.exports.change_payment_method = async function (req, res, _) {
    const { id, Payment_method, invoice_number } = req.body
    orderRepository.change_payment_method(id, Payment_method, invoice_number).then(update_success => {
        (update_success[0] > 0) ? res.api(200, "updated successfully", null, true) : res.api(404, "no orders found", null, false)
    })
}
module.exports.applyPOSBeans = async function (req, res, _) {
    console.log(req.body);
    var total_bean_needed = req.body.products_data.map(item => Number(item.beanValue || 0)).reduce((prev, curr) => prev + curr, 0);
    var total_amount = req.body.products_data.map(item => Number(item.total_price)).reduce((prev, curr) => prev + curr, 0);
    let user = await UserModel.findOne({where : {
        _id : req.body.user_id
    }})
    console.log(Number(user.beansEarnerd), Number(req.body.total_bean_needed),Number(user.beansEarnerd) < Number(req.body.total_bean_needed))
    if(req.body.bean_entered < total_bean_needed){
        res.api(200, "User should have atleast "+total_bean_needed+ " beans to proceed", req.body, false) 
    }
    else if(req.body.bean_entered > total_bean_needed){
        res.api(200, "Seems like you are trying to use more beans than needed!", req.body, false) 
    }
    else{
        let discount_price = (Number(req.body.bean_entered) / 10) >= total_amount ? total_amount : (total_bean_needed / 10)
        let total_price = total_amount - discount_price
        console.log({discount_price,total_price})
        res.api(200, "Applied successfully", {"bean_earned" : total_price * 10,discount_price : "-"+discount_price.toFixed(2)+"€",total_price : total_price.toFixed(2)+"€"}, true) 
    }
}

module.exports.getTransactions = async function (req, res, _) {
    const { branch_id } = req.body
    orderRepository.get_transactions(branch_id).then(transactions => {
        res.api(200, "orders retrived successfully", transactions, true)
    })
}

module.exports.filterAPI = async function (req, res, _) {
    const { branch, dates } = req.body
    if (dates) {
        if (dates.start != null && dates.end != null) {
            if (branch != null) {
                orderRepository.filter_with_start_end_branch(dates.start, dates.end, branch).then(transaction => {
                    res.api(200, "transaction retrived successfully", transaction, true)
                })
            }
            else {
                orderRepository.filter_with_start_and_end(dates.start, dates.end).then(transaction => {
                    res.api(200, "transaction retrived successfully", transaction, true)
                })
            }
        }
        else {
            if (branch != null) {
                orderRepository.filter_with_start_branch(dates.start, branch).then(transaction => {
                    res.api(200, "transaction retrived successfully", transaction, true)
                })
            }
            else {
                orderRepository.filter_with_start(dates.start).then(transaction => {
                    res.api(200, "transaction retrived successfully", transaction, true)
                })
            }
        }
    }
    else if (branch == null && dates == null) {
        orderRepository.get_transactions(null).then(transaction => {
            res.api(200, "transaction retrived successfully", transaction, true)
        })
    }
    else {
        orderRepository.get_branch_wise_txn(branch).then(txns => {
            return res.api(200, "transaction retrived successfully", txns, true)
        })
    }
}

module.exports.get_vat_report = async function (req, res, next) {
    const { dates, branch } = req.body
    let current_month_orders = await orderRepository.get_vat_report_last_month(dates || null, branch || null)

    let response = []
    let iva_grouped = _.groupBy(current_month_orders, function (order) {
        return Number(order.iva_info.iva_percent);
    })

    for (const [key, value] of Object.entries(iva_grouped)) {
        let cummulative_amt_with_tax = 0
        let cummulative_amt_without_tax = 0

        value.forEach(element => {
            cummulative_amt_with_tax += Number(element.price)
            cummulative_amt_without_tax += (element.price_without_iva)
        });
        let tax = cummulative_amt_with_tax - cummulative_amt_without_tax

        let item = { tax_percent: Number(key).toFixed(2), tax_amount: tax.toFixed(2), total_without_tax: cummulative_amt_without_tax.toFixed(2), total_with_tax: cummulative_amt_with_tax.toFixed(2), color: value[0].iva_info.color }
        response.push(item)
    }

    return res.api(200, "records retrived successfully", response, true)
}

module.exports.get_payout_report = async function (req, res, next) {
    const { dates, branch } = req.body

    var current_month_orders = await orderRepository.get_payout_report_last_month(dates || null, branch || null)
    let total_price = await orderRepository.getTxnAmount(dates || null, branch || null)
    return res.api(200, "records retrived successfully", { list: current_month_orders, entiremount: total_price }, true)
}
module.exports.open_cash = async function (req, res, next) {
    const { device_id, open_balence, barista_id } = req.body
    let branch = await orderRepository.get_branchInfo(device_id)
    if (branch._id) {
        let response = await CashFlowModel.create({
            open_time: moment(),
            open_balance: open_balence || 0.00,
            branch_id: branch._id,
            barista_id: barista_id
        })
        return res.api(200, "Data read successfully", response, true)
    }
    else {
        res.api(200, "IPAD is not registerd to any Branches", null, false)
    }

}
module.exports.close_cash = async function (req, res, next) {
    const { id, today_income_cash, today_expense_cash, close_balance, device_id } = req.body

    let branch = await orderRepository.get_branchInfo(device_id)
    if(branch._id){
        let today = moment().format("dddd").toLowerCase()

        console.log(branch.espresso_report_date,today)
        if(branch.espresso_report_date.includes(today)){
            let record = await InventoryReportModel.findOne({where : {branch_id : branch._id,final_remaining : -1,total_consumption : -1}})
            if(record){
                return res.api(200, "Please report the espresso count before closing cash!", null, false)
            }
            else{
                let close_time = moment().toDate()
                let response = await CashFlowModel.update({
                    today_income_cash: today_income_cash,
                    today_expense_cash: today_expense_cash,
                    close_balance: close_balance,
                    close_time: close_time,
                }, {
                    where: {
                        _id: id
                    }
                })

                return res.api(200, "Data read successfully", response, true)
            }
        }
        else{
            let close_time = moment().toDate()
            let response = await CashFlowModel.update({
                today_income_cash: today_income_cash,
                today_expense_cash: today_expense_cash,
                close_balance: close_balance,
                close_time: close_time,
            }, {
                where: {
                    _id: id
                }
            })

            return res.api(200, "Data read successfully", response, true)
        }
    }
    else{
        res.api(200, "IPAD is not registerd to any Branches", null, false)
    }
    // let close_time = moment().toDate()
    // let response = await CashFlowModel.update({
    //     today_income_cash: today_income_cash,
    //     today_expense_cash: today_expense_cash,
    //     close_balance: close_balance,
    //     close_time: close_time,
    // }, {
    //     where: {
    //         _id: id
    //     }
    // })
    // return res.api(200, "Data read successfully", response, true)
}
module.exports.get_flow = async function (req, res, next) {
    const { device_id, open_time } = req.body
    let branch = await orderRepository.get_branchInfo(device_id)
    if (branch) {
        let in_flow = await orderRepository.getInflow(branch._id, open_time)
        let out_flow = await orderRepository.getOutflow(branch._id, open_time)
        console.log({ in_flow, out_flow })
        return res.api(200, "records retrived successfully", { in_flow, out_flow }, true)
    }
    else {
        return res.api(200, "IPAD Not registered", null, false)
    }

}

module.exports.getDiscountsGrouped = async function (req, res, next) {
    const { branch, dates } = req.body
    console.log(req.body, "for check")
    let response = await orderRepository.get_discounts_grouped(branch, dates)
    return res.api(200, "records retrived successfully", response, true)
}

module.exports.getDicountBaristaGrouped = async function (req, res, next) {
    const { branch, dates } = req.body
    let response = await orderRepository.get_discounts_grouped_barista(branch, dates)
    return res.api(200, "records retrived successfully", response, true)
}
module.exports.get_discounts_report = async function (req, res, next) {
    const { branch, dates } = req.body
    let response = await orderRepository.get_discounts_report(branch, dates)
    return res.api(200, "records retrived successfully", response, true)
}

module.exports.get_comparision = async function (req, res, next) {
    const { branch, dates } = req.body

    let lastMonth = (await orderRepository.get_last_moth_discount_report_total(branch, dates))[0].getDataValue("total_discount") || 0.00
    let thisMonth = (await orderRepository.get_this_moth_discount_report_total(branch, dates))[0].getDataValue("total_discount") || 0.00
    let stmt = lastMonth > thisMonth ? "LOSS" : "PROFIT"
    let percent = 0

    if (stmt == "PROFIT") {
        let change = thisMonth - lastMonth
        percent = (change / thisMonth) * 100
    }
    else {
        let change = lastMonth - thisMonth
        percent = (change / lastMonth) * 100
    }

    return res.api(200, "records retrived successfully", { lastMonth, thisMonth, percent, stmt }, true)
}


module.exports.generateAccountPDF = async function (req, res, next) {

    let total_price = 0
    function get_price(value) {
        let price = 0
        value.forEach(element => {
            price += Number(element.total_amount.replace(',', '.'))
        });
        total_price += price
        return price
    }


    var { branch, dates, iva_report, cash_report, total_cost, email } = req.body
    const { transactionOutRepository } = require("../Transaction-outApp/transaction-out-repository")
    let blist = null
    if (branch) {
        blist = branch.map(function (element) { return element._id })
    }

    if (iva_report == null && cash_report == null) {
        let current_month_orders = await orderRepository.get_vat_report_last_month(dates, blist)

        let response = []
        let iva_grouped = _.groupBy(current_month_orders, function (order) {
            return Number(order.iva_info.iva_percent);
        })

        for (const [key, value] of Object.entries(iva_grouped)) {
            let cummulative_amt_with_tax = 0
            let cummulative_amt_without_tax = 0

            value.forEach(element => {
                cummulative_amt_with_tax += Number(element.price)
                cummulative_amt_without_tax += (element.price_without_iva)
            });
            let tax = cummulative_amt_with_tax - cummulative_amt_without_tax

            let item = { tax_percent: Number(key).toFixed(2), tax_amount: tax.toFixed(2), total_without_tax: cummulative_amt_without_tax.toFixed(2), total_with_tax: cummulative_amt_with_tax.toFixed(2), color: value[0].iva_info.color }
            response.push(item)
        }
        iva_report = response

        var current_month_orders_list = await orderRepository.get_payout_report_last_month(dates, blist)
        let total = await orderRepository.getTxnAmount(dates, blist)
        cash_report = JSON.parse(JSON.stringify(current_month_orders_list))
        total_cost = total.getDataValue("EntireTxnThisMonth")
        //return res.api(200, "records retrived successfully", {iva_report,total_price,cash_report }, true)

    }
    let data = new Object()
    if (branch) {
        data = await transactionOutRepository.filterHelper(blist, dates)
    }
    else {
        data = await transactionOutRepository.filterHelper(null, dates)
    }
    // data = data.filter((data) => {
    //     return data.type != 'expense'
    // });

    let grouped = _.groupBy(data, function (order) {
        return order.mode_of_payment
    })
    let response = []
    for (const [key_mode, value] of Object.entries(grouped)) {
        let reason_grouped = _.groupBy(value, function (item) {
            return item.reason
        })

        for (const [key_reason, value] of Object.entries(reason_grouped)) {
            let item = Object()
            item.mode_of_payment = key_mode
            item.reason = key_reason
            item.count = value.length
            item.price = get_price(value).toFixed(2)
            item.percent = 0.00
            response.push(item)
        }
    }


    console.log(total_price, "price_total")
    let total_expense_count = 0
    response.forEach(element => {
        element.percent = Number(element.price / total_price * 100).toFixed(2)
        total_expense_count += element.count
    });

    // return res.api(200, "records retrived successfully", response, true)
    let pgTitle = await createPdf(iva_report, branch, dates, cash_report, total_cost, response, total_price, total_expense_count)
    console.log(email, "email", branch, "branch")
    if (email) {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            requireTLS: true,
            auth: {
                user: 'facturas@syra.coffee',
                pass: 'qnbjgmwtxlkmezaa'
            }
        });
        branch_name = "All Branches"
        if (branch == null) {
            branch_name = "All Branches"
        }
        else {
            branch_name = branch.branch_name
        }

        let start, end

        if (dates == null) {
            start = moment().utc().tz(constants.TIME_ZONE).startOf('day')
            end = moment().utc().tz(constants.TIME_ZONE).startOf('day')
        }
        else {
            if (dates.start != null & dates.end != null) {
                start = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                end = moment(dates.end).utc().tz(constants.TIME_ZONE).startOf('day')
            }
            else {
                start = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
                end = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day')
            }
        }
        var mailOptions = {
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

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.api(200, "cannot send Mail", error, false)
            }
            res.api(200, "Email sent", null, true)
        });
    }
    else {
        return res.api(200, "records retrived successfully", { url: constants.HOST + "assets/reports/report.pdf", title: pgTitle }, true)
    }
}

module.exports.getGlobalSales = async function (req, res, next) {

    function get_sum(array) {
        let sum = 0
        array.forEach(element => {
            sum += element.amount
        });

        return sum
    }

    function get_sum_totalAmt(array) {
        let sum = 0
        array.forEach(element => {
            sum += Number(element.total_amount)
        });

        console.log(sum)
        return sum
    }
    const { dates, branch } = req.body
    let sales = await orderRepository.getGlobalSales(dates, branch)
    let previous = await orderRepository.getGlobalSalesPrevious(dates, branch)
    let sales_sorted
    if (dates != null && dates.start != null && dates.end != null) {
        console.log(dates, "suceess")
        if (dates.start == dates.end) {
            sales_sorted = _(sales).groupBy("hour").map((sale, date) => ({
                hour: date.split(':')[0],
                amount: get_sum_totalAmt(sale)
            }))
        }
        else {
            sales_sorted = _(sales).groupBy("date_of_transaction").map((sale, date) => ({
                hour: moment(date, 'DD/MM/YYYY').format('DD/MM'),
                amount: get_sum_totalAmt(sale)
            }))
        }

    }
    else {
        sales_sorted = _(sales).groupBy("hour").map((sale, date) => ({
            hour: date.split(':')[0],
            amount: get_sum_totalAmt(sale)
        }))
    }

    let previous_sales_sorted
    if (dates != null && dates.start != null && dates.end != null) {
        if (dates.start == dates.end) {
            previous_sales_sorted = _(previous).groupBy("hour").map((sale, date) => ({
                hour: date.split(':')[0],
                amount: get_sum_totalAmt(sale)
            }))
        }
        else {
            previous_sales_sorted = _(previous).groupBy("date_of_transaction").map((sale, date) => ({
                hour: moment(date, 'DD/MM/YYYY').format('DD/MM'),
                amount: get_sum_totalAmt(sale)
            }))
        }
    }
    else {
        previous_sales_sorted = _(previous).groupBy("hour").map((sale, date) => ({
            hour: date.split(':')[0],
            amount: get_sum_totalAmt(sale)
        }))
    }
    let sum_this_month = get_sum(sales_sorted)
    let sum_last_month = get_sum(previous_sales_sorted)

    sales_sorted = _(sales_sorted).groupBy("hour").map((sale, date) => ({
        hour: date.split(':')[0],
        amount: get_sum(sale)
    }))

    previous_sales_sorted = _(previous_sales_sorted).groupBy("hour").map((sale, date) => ({
        hour: date.split(':')[0],
        amount: get_sum(sale)
    }))
    console.log(sales_sorted);
    let sales_sorted_new = _.sortBy(JSON.parse(JSON.stringify(sales_sorted)),
        [function (o) { return o.hour; }]);
    let previous_sales_sorted_new = _.sortBy(JSON.parse(JSON.stringify(previous_sales_sorted)),
        [function (o) { return o.hour; }]);
    res.api(200, "retrived successfully", { sales_sorted: sales_sorted_new, previous_sales_sorted: previous_sales_sorted_new, sum_this_month, sum_last_month }, true)
}

module.exports.CategoryOrdersFiltered = async function (req, res, next) {
    const { dates, branch } = req.body
    let result = await orderRepository.get_category_sales(dates, branch)

    let category_grouped = await _(result).groupBy("category_id").map((category, key) => ({
        price_without_iva: _.sumBy(category, (item) => {
            return item.price_without_iva
        }),
        price_with_iva: _.sumBy(category, (item) => {
            return Number(item.price)
        }),
        category_id: key,
        info: _(category).groupBy("branch_id").map((data, key) => ({
            branch_id: key,
            branch_name: data[0].branch_info.branch_name,
            price_without_iva: _.sumBy(data, (item) => {
                return item.price_without_iva
            }),
            price_with_iva: _.sumBy(data, (item) => {
                return Number(item.price)
            }),
            count: data.length
        })),
        DateBased: _(category).groupBy("date_graph").map((data, key) => ({
            time_slot: key,
            price_without_iva: _.sumBy(data, (item) => {
                return item.price_without_iva
            }),
            price_with_iva: _.sumBy(data, (item) => {
                return Number(item.price)
            }),
            count: data.length,
            category_info: category.length > 0 ? category[0].category_info : null,
        })),
        HourBased: _(category).groupBy("hour_graph").map((data, key) => ({
            time_slot: key,
            price_without_iva: _.sumBy(data, (item) => {
                return item.price_without_iva
            }),
            price_with_iva: _.sumBy(data, (item) => {
                return Number(item.price)
            }),
            count: data.length,
            category_info: category.length > 0 ? category[0].category_info : null,
        })),
        category_info: category.length > 0 ? category[0].category_info : null,
        count: category.length
    })).sortBy((obj) => {
        return obj.price_without_iva
    })

    console.log(JSON.parse(JSON.stringify(category_grouped)))

    let worst_categories = JSON.parse(JSON.stringify(category_grouped.slice(0, 2)))
    let best_categories = JSON.parse(JSON.stringify(category_grouped.slice(-2)))

    if (best_categories.length > 0) {
        best_categories[0].color = "#3f9f97"
        best_categories[best_categories.length - 1].color = "#8cbeba"
    }
    if (worst_categories.length > 0) {
        worst_categories[0].color = "#de7c84"
        worst_categories[worst_categories.length - 1].color = "#de7c64"
    }
    res.api(200, "data retrived successfully", { category_grouped, worst_categories, best_categories: best_categories.reverse() }, true)
}

module.exports.ProductOrdersFiltered = async function (req, res, next) {
    const { dates, branch } = req.body
    let result = await orderRepository.get_product_sales(dates, branch)

    let product_grouped = await _(result).groupBy("product_id").map((product, key) => ({
        price_without_iva: _.sumBy(product, (item) => {
            return item.price_without_iva
        }),
        price_with_iva: _.sumBy(product, (item) => {
            return Number(item.price)
        }),
        info: _(product).groupBy("branch_id").map((data, key) => ({
            branch_id: key,
            branch_name: data[0].branch_info.branch_name,
            price_without_iva: _.sumBy(data, (item) => {
                return item.price_without_iva
            }),
            price_with_iva: _.sumBy(data, (item) => {
                return Number(item.price)
            }),
            count: data.length
        })),
        DateBased: _(product).groupBy("date_graph").map((data, key) => ({
            time_slot: key,
            price_without_iva: _.sumBy(data, (item) => {
                return item.price_without_iva
            }),
            price_with_iva: _.sumBy(data, (item) => {
                return Number(item.price)
            }),
            count: data.length,
            product_info: product.length > 0 ? product[0].product_info : null,
        })),
        HourBased: _(product).groupBy("hour_graph").map((data, key) => ({
            time_slot: key,
            price_without_iva: _.sumBy(data, (item) => {
                return item.price_without_iva
            }),
            price_with_iva: _.sumBy(data, (item) => {
                return Number(item.price)
            }),
            count: data.length,
            product_info: product.length > 0 ? product[0].product_info : null,
        })),
        product_id: key,
        product_info: product.length > 0 ? product[0].product_info : null,
        count: product.length
    })).sortBy((obj) => {
        return obj.price_without_iva
    })


    let worst_products = JSON.parse(JSON.stringify(product_grouped.slice(0, 2)))
    let best_products = JSON.parse(JSON.stringify(product_grouped.slice(-2)))
    if (best_products.length > 0) {
        best_products[0].color = "#3f9f97"
        best_products[1].color = "#8cbeba"
    }

    if (worst_products.length > 0) {
        worst_products[0].color = "#de7c84"
        worst_products[1].color = "#de7c64"
    }



    res.api(200, "data retrived successfully", { product_grouped, worst_products, best_products: best_products.reverse() }, true)
}

module.exports.test = async function (req, res, next) {
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

    const Sequelize = require('sequelize');
    const Op = Sequelize.Op;

    let data = await OrdersModel.findAll({
        where: {
            createdAt: {
                [Op.and]:
                    [
                        {
                            [Op.gte]: moment('21/04/2021', "DD/MM/YYYY").startOf('day')
                        },
                        {
                            [Op.lte]: moment('21/04/2021', "DD/MM/YYYY").endOf('day')
                        }
                    ],
            },
            branch_id: "d567d8a3-f154-4e00-af64-b903c28101d2",
            [Op.not]: [
                { order_status: "cancelled" }
            ]
        }
    })

    for (let index = 0; index < data.length; index++) {
        const orderItem = data[index];

        for (let index_produt = 0; index_produt < orderItem.products_data.length; index_produt++) {
            const product = orderItem.products_data[index_produt];
            if (product.have_discount == 1) {
                var discountAmt = 0
                if (product.discount_type == "percent") {
                    discountAmt = Number(product.price) * Number(product.discount_price) / 100
                }
                else {
                    discountAmt = product.discount_price
                }
                console.log(discountAmt)
                await AppliedDiscountsModel.create({
                    order_id: orderItem._id,
                    discount_id: product.discount_id,
                    barista_id: orderItem.barista_id,
                    tota_discount_amount: discountAmt,
                    createdAt: moment('21/04/2021 15:30:55', "DD/MM/YYYY HH:mm:ss"),
                    updatedAt: moment('21/04/2021 15:30:55', "DD/MM/YYYY HH:mm:ss")
                })
            }
        }
    }

    res.api(200, "data retrived successfully", data.length, true)
}


module.exports.getDashBoard = async function (req, res, next) {
    const { dates, branch } = req.body

    //this month
    let billingInfo_current = await OrderReportRepository.getTotalBillings(dates, branch)
    let billing_info_current_json = JSON.parse(JSON.stringify(billingInfo_current[0]))
    billing_info_current_json.avgTkt = Number(billing_info_current_json.total_amount) / Number(billing_info_current_json.count)

    //lastMonth

    let billingInfo_last = await OrderReportRepository.lastWeekDashboardReport(dates, branch)
    let billing_info_last_json = JSON.parse(JSON.stringify(billingInfo_last[0]))
    billing_info_last_json.avgTkt = Number(billing_info_last_json.total_amount) / Number(billing_info_last_json.count)

    //branch_base_report
    let report = await OrderReportRepository.get_branch_wise_report(dates, branch)
    let report_last = await OrderReportRepository.lastWeekBranchReport(dates, branch)


    let expense = await OrderReportRepository.get_branch_wise_expense_report(dates, branch)
    let expense_last = await OrderReportRepository.lastWeekBranchExpenseReport(dates, branch)
    res.api(200, "data retrived successfully", { billing_info_current_json, billing_info_last_json, report, report_last, expense, expense_last }, true)


}

module.exports.GetBranchGraph = async function (req, res, next) {
    const { dates, branch } = req.body
    let result = await OrderReportRepository.get_branch_wise_report_graph(dates, branch)

    let graphData = await _(result).groupBy("branch_id").map((branch_based, key) => ({
        total_price: _.sumBy(branch_based, (item) => {
            return Number(item.total_amount)
        }),
        branch_id: key,
        DateBased: _(branch_based).groupBy("date_graph").map((data, key) => ({
            time_slot: key,
            total_price: _.sumBy(data, (item) => {
                return Number(item.total_amount)
            }),
            count: data.length,
            branch_info: branch_based.length > 0 ? branch_based[0].branch_info : null
        })),
        HourBased: _(branch_based).groupBy("hour_graph").map((data, key) => ({
            time_slot: key,
            total_price: _.sumBy(data, (item) => {
                return Number(item.total_amount)
            }),
            count: data.length,
            branch_info: branch_based.length > 0 ? branch_based[0].branch_info : null
        })),
        branch_info: branch_based.length > 0 ? branch_based[0].branch_info : null,
        count: branch_based.length
    }))


    res.api(200, "data retrived successfully", graphData, true)
}

module.exports.getTotalBillingsGraph = async function (req, res, next) {
    const { dates, branch } = req.body
    let result = await OrderReportRepository.getTotalBillingsGraph(dates, branch)

    let DateBased = _(result).groupBy("date_graph").map((data, key) => ({
        time_slot: key,
        total_price: _.sumBy(data, (item) => {
            return Number(item.total_amount)
        }),
        count: data.length,
    })).sortBy(function (data) {
        return data.time_slot
    })
    let HourBased = _(result).groupBy("hour_graph").map((data, key) => ({
        time_slot: key,
        total_price: _.sumBy(data, (item) => {
            return Number(item.total_amount)
        }),
        count: data.length,
    })).sortBy(function (data) {
        return data.time_slot
    })


    res.api(200, "data retrived successfully", { DateBased, HourBased }, true)
}



module.exports.updateDateHour = async function (req, res, next) {
    console.log("success")
    let data = await OrderedProductsModel.findAll()
    await data.forEach(element => {
        OrderedProductsModel.update(
            {
                hour_graph: moment(element.createdAt).utc().tz(constants.TIME_ZONE).format("HH")
            }, {
            where: {
                "_id": element._id
            }
        }
        )
    });
    res.api(200, "data retrived successfully", null, true)
}
function createPdf(iva_report, branch, dates, cash_report, total_cost, expense, total_expense, total_expense_count) {
    const fs = require("fs");
    const PDFDocument = require("pdfkit");
    var doc = new PDFDocument();
    let docBranch = ""
    let docDate = ""
    if (branch) {
        let b_list = branch.map(function (element) { return element.branch_name })

        doc
            .fontSize(14.5).font('Helvetica-Bold')
            .text("Syra Coffee - " + b_list.join(",") + "", 30, 30)
        docBranch = b_list.join(",")
    }
    else {
        doc
            .fontSize(14.5).font('Helvetica-Bold')
            .text("Syra Coffee - All Branches", 30, 30)
        docBranch = "All Branches"

    }

    if (dates == null) {
        doc
            .fontSize(11.5).font('Helvetica-Bold')
            .text("Informe contable del " + moment().utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY"), 30, 60)
        docDate = moment().utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY")
    }
    else {
        if (dates.start != null && dates.end != null) {
            doc
                .fontSize(11.5).font('Helvetica-Bold')
                .text("Informe contable del " + moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY") + "-" + moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day').format("DD-MM-YYYY"), 30, 60)
            docDate = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY") + "-TO-" + moment(dates.end).utc().tz(constants.TIME_ZONE).endOf('day').format("DD-MM-YYYY")

        }
        else {
            doc
                .fontSize(11.5).font('Helvetica-Bold')
                .text("Informe contable del " + moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY"), 30, 60)
            docDate = moment(dates.start).utc().tz(constants.TIME_ZONE).startOf('day').format("DD-MM-YYYY")
        }
    }

    let docTile = docBranch.toUpperCase() + "_INFORME-CONTABLE_" + docDate
    doc
        .fontSize(10)
        .text("Informe de IVA", 30, 100)
    generateHr(doc, 100 + 20);

    position = 100 + 20
    if (iva_report.length > 0) {
        position = loadIVA(doc, iva_report)
    }
    else {
        doc
            .fontSize(10)
            .text("No Informe de IVA", 30, position + 15)
    }


    doc
        .fontSize(10)
        .text("Informe de métodos de pago", 30, position + 45)
    generateHr(doc, position + 65);

    payout_position = position + 65
    if (cash_report.length > 0) {
        payout_position = loadPayout(doc, cash_report, total_cost, position + 55)
    }
    else {
        doc
            .fontSize(10)
            .text("Informe de métodos de pago", 30, position + 80)
    }

    doc
        .fontSize(10)
        .text("Salida de caja", 30, payout_position + 45)
    generateHr(doc, payout_position + 65);
    if (expense.length > 0) {
        loadExpense(doc, expense, payout_position + 80, total_expense, total_expense_count)
    }
    else {
        doc
            .fontSize(10)
            .text("No Salida de caja", 30, payout_position + 80)
    }

    let os = require('os')
    doc.pipe(fs.createWriteStream(os.tmpdir() + '/report.pdf'));

    doc.end();

    return docTile
}
function loadExpense(doc, data, y, total_price, total_expense_count) {
    doc
        .fontSize(10)
        .text("Motivo", 30, y, { width: 135, align: "left" })
        .text("Métodos de pago", 160, y)
        .text("Número", 270, y, { width: 110, align: "left" })
        .text("Porcentaje", 360, y, { width: 125, align: "left" })
        .text("Cantidad", 490, y, { width: 130, align: "left" });

    // let total_count = 0
    // let totalAmt = 0

    let temp = new Object()
    temp.reason = "Total"
    temp.mode_of_payment = ""
    temp.count = total_expense_count
    temp.percent = "100.00"
    temp.price = total_price.toFixed(2)

    data.push(temp)
    doc.font('Helvetica')
    var position = 0
    var thrasholdRow = 0
    let another = 0
    for (i = 0; i < data.length; i++) {
        const item = data[i];
        console.log((y) + (i + 1) * 25, "actual")
        if (((y) + (i + 1) * 25) <= 710) {

            position = (y) + (i + 1) * 25;

            if (((y) + (i + 1) * 25) == 710) {
                thrasholdRow = i
                console.log("threshold ==", thrasholdRow)
            }

        }
        else {

            console.log("differnce", i - thrasholdRow)
            if (i - thrasholdRow == 1) {
                position = (70) + (i - thrasholdRow) * 25;
                another = position - 25
            }
            else {
                position = (another) + (i - thrasholdRow) * 25;
            }

        }

        if (i == data.length - 1) {
            doc.font('Helvetica-Bold')
        }
        doc
            .fontSize(10)
            .text(item.reason, 30, position, { width: 135, align: "left" })
            .text(item.mode_of_payment.toUpperCase(), 160, position == 710 ? 70 : position)
            .text(item.count, 270, position == 710 ? 70 : position, { width: 110, align: "left" })
            .text(item.percent + " %", 360, position == 710 ? 70 : position, { width: 125, align: "left" })
            .text(item.price + " €", 490, position == 710 ? 70 : position, { width: 130, align: "left" });
    }
}

function loadPayout(doc, cash_report, total_cost, y) {
    generateTableRow(
        doc,
        y + 25,
        "Métodos de pago",
        "",
        "Número",
        "Porcentaje de facturación",
        "Importe",
    );

    doc.font('Helvetica')

    let total_count = 0
    let totalAmt = 0

    var position = 0
    for (i = 0; i < cash_report.length; i++) {
        const item = cash_report[i];
        console.log(item, "At report trst")
        position = (y + 25) + (i + 1) * 25;
        total_count += Number(item.count)
        totalAmt += Number(item.total_payable)
        generateTableRow(
            doc,
            position,
            item.Payment_method,
            "",
            item.count,
            (item.total_payable / total_cost * 100).toFixed(2) + " %",
            Number(item.total_payable).toFixed(2) + " €",
        );
    }

    doc.font('Helvetica-Bold')
    generateTableRow(
        doc,
        position + 30,
        "TOTAL",
        "",
        total_count,
        "100.00 %",
        totalAmt.toFixed(2) + " €",
    );

    return position + 30
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(0.5)
        .moveTo(30, y)
        .lineTo(560, y)
        .stroke();
}

function loadIVA(doc, iva_report) {
    console.log(iva_report)
    generateTableRow(
        doc,
        130,
        "IVA",
        "TYPE",
        "IVA repercutido",
        "Facturación antes de impuestos",
        "Facturación después de impuestos"
    );

    doc.font('Helvetica')

    let tot_tax = 0
    let tot_amt_wo_tax = 0
    let tot_amt_w_tax = 0

    let top_of_content = 0
    var position = 0
    for (i = 0; i < iva_report.length; i++) {
        const item = iva_report[i];
        position = 140 + (i + 1) * 25;
        top_of_content += (i + 1) * 25;
        tot_tax += Number(item.tax_amount)
        tot_amt_wo_tax += Number(item.total_without_tax)
        tot_amt_w_tax += Number(item.total_with_tax)
        generateTableRow(
            doc,
            position,
            item.tax_percent + " %",
            i == parseInt(iva_report.length / 2) ? "SOLID" : "",
            item.tax_amount + " €",
            item.total_without_tax + " €",
            item.total_with_tax + " €",
        );
    }
    doc.font('Helvetica-Bold')
    generateTableRow(
        doc,
        position + 30,
        "TOTAL",
        "",
        tot_tax.toFixed(2) + " €",
        tot_amt_wo_tax.toFixed(2) + " €",
        tot_amt_w_tax.toFixed(2) + " €",
    );

    return position + 30
}

function generateTableRow(
    doc,
    y,
    item,
    description,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 30, y)
        .text(description, 85, y)
        .text(unitCost, 165, y, { width: 110, align: "left" })
        .text(quantity, 300, y, { width: 125, align: "left" })
        .text(lineTotal, 435, y, { width: 130, align: "left" });
}