"use strict";

var _require = require('express-validator'),
    body = _require.body;

module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.date_of_transaction = body('date_of_transaction').exists().withMessage('date_of_transaction is mandatory').bail().trim();
module.exports.reason = body('reason').exists().withMessage('reason is mandatory').bail().trim();
module.exports.type = body('type').exists().withMessage('type is mandatory').bail().trim();
module.exports.barista_id = body('barista_id').exists().withMessage('barista_id is mandatory').bail().trim();
module.exports.iva_id = body('iva_id').exists().withMessage('type is mandatory').bail().trim();
module.exports.total_amount = body('total_amount').exists().withMessage('total_amount is mandatory').bail().trim();
module.exports.mode_of_payment = body('mode_of_payment').exists().withMessage('mode_of_payment is mandatory').bail().trim();
module.exports.invoice_number = body('invoice_number').exists().withMessage('invoice_number is mandatory').bail().trim();