"use strict";

var _require = require('express-validator'),
    body = _require.body;

module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.inventory_name = body('inventory_name').exists().withMessage('category name is mandatory').bail().trim();
module.exports.reference = body('reference').exists().withMessage('color is mandatory').bail().trim();
module.exports.unit = body('unit').exists().withMessage('available branches is mandatory').bail().trim();
module.exports.price = body('price').exists().withMessage('available branches is mandatory').bail().trim();
module.exports.category_id = body('category_id').exists().withMessage('Admin_id is mandatory').bail().trim();
module.exports.available_branches = body('available_branches').exists().withMessage('Admin_id is mandatory').bail().trim();
module.exports.created_by = body('created_by').exists().withMessage('Admin_id is mandatory').bail().trim();