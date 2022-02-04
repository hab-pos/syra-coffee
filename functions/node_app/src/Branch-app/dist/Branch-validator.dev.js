"use strict";

var _require = require('express-validator'),
    body = _require.body;

var _require2 = require('./branch-repository'),
    branchRepository = _require2.branchRepository;

module.exports.created_by = body('created_by').exists().withMessage('Admin_id is mandatory').bail().trim();
module.exports.branch_name = body('branch_name').exists().withMessage('branch name is mandatory').bail().trim();
module.exports.device_id = body('device_id').exists().withMessage('device id is mandatory').bail().custom(function (value, _ref) {
  var req = _ref.req;
  return branchRepository.isUniqueCode(value).then(function (isUnique) {
    if (isUnique != null) {
      throw new Error('device_id already exists, please use another device');
    }
  });
}).trim();
module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();