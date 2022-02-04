"use strict";

var _require = require('express-validator'),
    body = _require.body;

module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.modifier_name = body('modifier_name').exists().withMessage('Name of Modifier is mandatory').bail().trim();
module.exports.price = body('price').exists().withMessage('Price mandatory').bail().trim();
module.exports.iva = body('iva').exists().withMessage('IVA is mandatory').bail().trim();
module.exports.beans_value = body('beans_value').exists().withMessage('beans_value is mandatory').bail().trim();
module.exports.is_deleted = body('is_deleted').exists().withMessage('is_deleted is mandatory').bail().trim();