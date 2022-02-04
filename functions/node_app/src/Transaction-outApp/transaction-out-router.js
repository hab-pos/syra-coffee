const express = require('express')
const {create_txn,get_txn,delete_txn,filterAPI} = require('./transaction-out-controller')
const {_id,date_of_transaction,reason,type,barista_id,iva_id,total_amount,mode_of_payment,invoice_number} = require('./transaction-out-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_txn',[_id,date_of_transaction,reason,type,barista_id,iva_id,total_amount,mode_of_payment,invoice_number],validate ,create_txn)
router.post('/get_txns' , get_txn)
router.post('/delete_txn', [_id] , validate ,delete_txn)
router.post('/filter',filterAPI)
module.exports. txnOut = router