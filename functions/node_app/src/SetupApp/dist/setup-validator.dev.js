"use strict";

var _require = require('express-validator'),
    body = _require.body;

module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.iva_precent = body('iva_precent').exists().withMessage('iva_precent is mandatory').bail().trim();
module.exports.expense_name = body('expense_name').exists().withMessage('expense_name is mandatory').bail().trim();
module.exports.discount_name = body('discount_name').exists().withMessage('discount_name is mandatory').bail().trim();
module.exports.amount = body('amount').exists().withMessage('amount is mandatory').bail().trim();
module.exports.type = body('type').exists().withMessage('type is mandatory').bail().trim();
module.exports.created_by = body('created_by').exists().withMessage('Admin_id is mandatory').bail().trim();