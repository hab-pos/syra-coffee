const { DiscountModel } = require('./setup-model')
const { setupRepository } = require('./setup-repository')

module.exports.addIVA = async function (req, res, _) {
    const { iva_precent,created_by } = req.body
    setupRepository.check_uniquenes_iva(iva_precent).then(response => {
        console.log("response",response)
        if(response.length == 0){
            setupRepository.addIva(iva_precent,created_by).then(info => {
                res.api(200, "IVA saved successfully", { info }, true)
            })
        }
        else{
            res.api(200, "IVA Already available", null , false)
        }
    })
}

module.exports.getIVA = async function (req, res, _) {
    setupRepository.get_iva().then(ivalist => {
        res.api(200, "IVA retrived successfully", { ivalist }, true)
    })
}
module.exports.deleteIVA = async function (req, res, _) {
    const { id } = req.body
    setupRepository.deleteIVA(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "IVA deleted successfully", null, true) : res.api(404, "No IVA found", null, false)
    })
}


module.exports.addExpense = async function (req, res, _) {
    const {expense_name,created_by } = req.body
    setupRepository.check_uniquenes_Expense(expense_name).then(response => {
        if(response.length == 0){
            setupRepository.addExpense(expense_name,created_by).then(info => {
                res.api(200, "Expense saved successfully", { info }, true)
            })
        }
        else{
            res.api(200, "Expense Already available", null, false)
        }
    })
   
}

module.exports.getExpense = async function (req, res, _) {
    setupRepository.get_Expense().then(expense_list => {
        res.api(200, "Expense retrived successfully", { expense_list }, true)
    })
}
module.exports.deleteExpense = async function (req, res, _) {
    const { id } = req.body
    setupRepository.deleteExpense(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "Expense deleted successfully", null, true) : res.api(404, "No Expense found", null, false)
    })
}

module.exports.update_order = async function (req, res, _) {
    const {order } = req.body

    for (let index = 0; index < order.length; index++) {
        const element = order[index];
        await DiscountModel.update({position : element.order},{where : {_id : element.id}})
    }
    res.api(200, "success", "success", true)

}

module.exports.addDiscount = async function (req, res, _) {
    const {discount_name,amount,type,created_by } = req.body
    setupRepository.check_uniquenes_discount(discount_name).then(response => {
        if(response.length == 0){
            setupRepository.addDiscount(discount_name,amount,type,created_by).then(info => {
                res.api(200, "Discount saved successfully", { info }, true)
            })
        }
        else{
            res.api(200, "Discount Already available", null, false)
        }
    })
   
}

module.exports.getDiscounts = async function (req, res, _) {
    setupRepository.get_Discounts().then(discount_list => {
        res.api(200, "Discount retrived successfully", { discount_list }, true)
    })
}
module.exports.deleteDiscounts = async function (req, res, _) {
    const { id } = req.body
    setupRepository.deleteDiscount(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "Discount deleted successfully", null, true) : res.api(404, "No Discount found", null, false)
    })
}


module.exports.getExpenseAndIva = async function(req,res, _){
    let response = new Object()
    setupRepository.get_iva().then(ivalist => {
        response.iva_list = ivalist
        setupRepository.get_Expense().then(expense_list => {
            response.expense_list = expense_list
            res.api(200, "Expense retrived successfully", response , true)
        })
    })
}