"use strict";

var _require = require('express-validator'),
    body = _require.body;

module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.product_name = body('product_name').exists().withMessage('product_name name is mandatory').bail().trim();
module.exports.price = body('price').exists().withMessage('price name is mandatory').bail().trim();
module.exports.iva = body('iva').exists().withMessage('iva name is mandatory').bail().trim();
module.exports.categories = body('categories').exists().withMessage('categories is mandatory').bail().trim();
module.exports.color = body('color').exists().withMessage('color branches is mandatory').bail().trim();
module.exports.available_branches = body('available_branches').exists().withMessage('available branches is mandatory').bail().trim();
module.exports.created_by = body('created_by').exists().withMessage('created_by is mandatory').bail().trim();