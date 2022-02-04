"use strict";

var express = require('express');

var _require = require('./transaction-out-controller'),
    create_txn = _require.create_txn,
    get_txn = _require.get_txn,
    delete_txn = _require.delete_txn,
    filterAPI = _require.filterAPI;

var _require2 = require('./transaction-out-validator'),
    _id = _require2._id,
    date_of_transaction = _require2.date_of_transaction,
    reason = _require2.reason,
    type = _require2.type,
    barista_id = _require2.barista_id,
    iva_id = _require2.iva_id,
    total_amount = _require2.total_amount,
    mode_of_payment = _require2.mode_of_payment,
    invoice_number = _require2.invoice_number;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_txn', [_id, date_of_transaction, reason, type, barista_id, iva_id, total_amount, mode_of_payment, invoice_number], validate, create_txn);
router.post('/get_txns', get_txn);
router.post('/delete_txn', [_id], validate, delete_txn);
router.post('/filter', filterAPI);
module.exports.txnOut = router;