const { expenseRepository } = require('./Expense-repository')
const moment = require('moment');
const { CashFlowModel } = require("../OrdersApp/orders-model")
const {TransactionOutModel} = require("../Transaction-outApp/transaction-out-model")
module.exports.createExpense = async function (req, res, _) {
    const { motive_name, expense_date, motive, iva_id, price, payment, device_id, barista_id, mode_of_payment, invoice_number } = req.body
    let requestObj = Object()

    let date_of_expense = moment(expense_date, 'MM/DD/YYYY')

    console.log(req.body,date_of_expense)
    expenseRepository.get_branchInfo(device_id).then(branch => {
        if (branch) {
            requestObj.expense_date = date_of_expense
            requestObj.motive = motive
            requestObj.iva_id = iva_id
            requestObj.price = price
            requestObj.branch_id = branch._id
            requestObj.payment = payment
            requestObj.barista_id = barista_id
            expenseRepository.createExpense(requestObj).then(info => {

                let txn = new Object()

                txn.date_of_transaction = date_of_expense
                txn.type = "expense"
                txn.barista_id = barista_id
                txn.iva_id = iva_id
                txn.total_amount = price
                txn.mode_of_payment = mode_of_payment || "CASH"
                txn.invoice_number = invoice_number || "-"
                txn.reason = motive_name
                txn.branch_id = branch._id
                txn.expense_id = info._id 
                expenseRepository.createTxn(txn).then(transaction => {
                    expenseRepository.getExpenses(info._id, branch._id).then(Expense_info => {
                        res.api(200, "Expense added successfully", Expense_info, true)
                    })
                })
            })
        }
        else {
            res.api(200, "IPAD Not registered to Branch", null, false)
        }
    })
}

module.exports.getExpenses = async function (req, res, _) {
    const { id, device_id } = req.body
    console.log(device_id)
    let branch = await expenseRepository.get_branchInfo(device_id)
    if (branch) {
        let cashFlow = await CashFlowModel.findAll({where : {branch_id : branch._id,close_time : null}, order: [
            ["createdAt", "DESC"]
        ],limit : 1})
        if(cashFlow.length > 0)
        {
            let openTime = moment(cashFlow[0].open_time)
            expenseRepository.getExpenses(id, branch._id,openTime).then(expense_details => {
                res.api(200, "Expense retrived successfully", expense_details, true)
            })
        }
        else{
            res.api(200, "Expense retrived successfully", [], true)
        }
    }
    else {
        res.api(200, "IPAD Not registered to Branch", null, false)
    }
}
module.exports.updateExpense = async function (req, res, _) {
    expenseRepository.updateExpense(req.body).then(update_success => {
        (update_success[0] > 0) ? res.api(200, "updated successfully", null, true) : res.api(404, "no expense found", null, false)
    })
}

module.exports.deleteExpense = async function (req, res, _) {
    const { id,expense_name,created_at,device_id } = req.body
    let branch = await expenseRepository.get_branchInfo(device_id)
    let response = await expenseRepository.deleteExpense(id)
    await TransactionOutModel.destroy({
        where : {
            reason : expense_name,
            type : "expense",
            expense_id : id,
            branch_id : branch._id
        }
    })
    response > 0 ? res.api(200, "expense info deleted successfully", null, true) : res.api(404, "No expense found", null, false)

}