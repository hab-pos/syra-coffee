"use strict";

var _require = require('express-validator'),
    body = _require.body;

module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.order_date = body('order_date').exists().withMessage('order_date name is mandatory').bail().trim();
module.exports.device_id = body('device_id').exists().withMessage('device_id is mandatory').bail().trim();
module.exports.received_by = body('received_by').exists().withMessage('received_by is mandatory').bail().trim();
module.exports.ordered_by = body('ordered_by').exists().withMessage('ordered_by is mandatory').bail().trim();
module.exports.delivery_date = body('delivery_date').exists().withMessage('delivery_date is mandatory').bail().trim();
module.exports.number_of_products = body('number_of_products').exists().withMessage('available branches is mandatory').bail().trim();
module.exports.comment_by_barista = body('comment_by_barista').exists().withMessage('comment_by_barista is mandatory').bail().trim();
module.exports.admin_msg = body('admin_msg').exists().withMessage('admin_msg is mandatory').bail().trim();
module.exports.ordered_items = body('ordered_items').exists().withMessage('ordered_items is mandatory').bail();