"use strict";

var _require = require('express-validator'),
    body = _require.body;

module.exports.first_name = body('first_name').exists().withMessage('First Name is mandatory').bail();
module.exports.last_name = body('last_name').exists().withMessage('Last Name is mandatory').bail().trim();
module.exports.birth_day = body('birth_day').exists().withMessage('Birthday is mandatory').bail().trim();
module.exports.email = body('email').exists().withMessage('Email is mandatory').isEmail().withMessage("Invalid email format").bail().trim();
module.exports.password = body('password').exists().withMessage('password cannot be empty').isLength({
  min: 5
}).withMessage('minimum 5 characters').bail().trim();
module.exports.default_store = body('default_store').exists().withMessage('Choose your default store please').bail().trim();
module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.id = body('_id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();
module.exports.user_id = body('user_id').exists().isLength({
  min: 1
}).withMessage('User Id cannot be empty').bail().trim();
module.exports.holder_name = body('holder_name').exists().isLength({
  min: 1
}).withMessage('Holder Name cannot be empty').bail().trim();
module.exports.card_number = body('card_number').exists().isLength({
  min: 1
}).withMessage('Card Number cannot be empty').bail().trim();
module.exports.cvc = body('cvc').exists().isLength({
  min: 1
}).withMessage('cvc cannot be empty').bail().trim();
module.exports.expiry_date = body('expiry_date').exists().isLength({
  min: 1
}).withMessage('Expiry Date cannot be empty').bail().trim();