"use strict";

var _require = require('express-validator'),
    body = _require.body;

var _require2 = require('./Admin-repository'),
    adminRepository = _require2.adminRepository;

module.exports.email_id = body('email_id').exists().withMessage('Email is mandatory').bail().custom(function (value, _ref) {
  var req = _ref.req;
  return adminRepository.isUniqueEmail(value).then(function (isUnique) {
    if (isUnique != null) {
      throw new Error('Email already exists');
    }
  });
});
module.exports.validEmail = body('email_id').exists().withMessage('Email is mandatory').bail().trim().isEmail().withMessage("Invalid Email");
module.exports.user_name = body('user_name').exists().withMessage('required').notEmpty().withMessage("cannot be empty").bail().custom(function (value, _ref2) {
  var req = _ref2.req;
  return adminRepository.isUniqueName(value).then(function (isUnique) {
    if (isUnique != null) {
      throw new Error('user_name already exists');
    }
  });
}).trim();
module.exports.password = body('password').notEmpty().withMessage("cannot be empty").exists().withMessage('password cannot be empty').bail().trim();
module.exports.admin_recipt_message = body('admin_recipt_message').exists().isLength({
  min: 1
}).withMessage('Admin message is Mandatory').bail().trim();
module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();