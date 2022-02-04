"use strict";

var _require = require('express-validator'),
    body = _require.body;

module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.motive = body('motive').exists().withMessage('motive is mandatory').bail().trim();
module.exports.iva_id = body('iva_id').exists().withMessage('iva_id is mandatory').bail().trim();
module.exports.price = body('price').exists().withMessage('price is mandatory').bail().trim();
module.exports.payment = body('payment').exists().withMessage('payment is mandatory').bail().trim();
module.exports.device_id = body('device_id').exists().withMessage('device_id is mandatory').bail().trim();
module.exports.barista_id = body('barista_id').exists().withMessage('barista_id is mandatory').bail().trim();