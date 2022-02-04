const { transactionOutRepository } = require('./transaction-out-repository')

module.exports.create_txn = async function (req, res, _) {
    const { date_of_transaction, reason, type, barista_id, iva_id, total_amount, mode_of_payment, invoice_number } = req.body

    transactionOutRepository.addTxn(date_of_transaction, reason, type, barista_id, iva_id, total_amount, mode_of_payment, invoice_number).then(transaction => {
        res.api(200, "transaction stored successfully", { transaction }, true)
    })
}

module.exports.get_txn = async function (req, res, _) {
    transactionOutRepository.getTxns().then(transaction => {
        res.api(200, "transaction retrived successfully", { transaction }, true)
    })
}
module.exports.delete_txn = async function (req, res, _) {
    const { id } = req.body
    transactionOutRepository.deleteTxn(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "transaction deleted successfully", null, true) : res.api(404, "No transaction found", null, false)
    })
}
module.exports.filterAPI = async function (req, res, _) {
    const { branch, dates } = req.body
    let transaction = await transactionOutRepository.filterHelper(branch, dates)
    res.api(200, "transaction retrived successfully", transaction, true)
}