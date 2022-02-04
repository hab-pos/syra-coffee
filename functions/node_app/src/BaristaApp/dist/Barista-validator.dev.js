"use strict";

var _require = require('express-validator'),
    body = _require.body;

var _require2 = require('./Barista-repository'),
    baristaRepository = _require2.baristaRepository;

module.exports.created_by = body('created_by').exists().withMessage('Admin_id is mandatory').bail().trim();
module.exports.barista_name = body('barista_name').exists().withMessage('barista name is mandatory').bail().trim().custom(function (value, _ref) {
  var req = _ref.req;
  return baristaRepository.isUniqueName(value).then(function (isUnique) {
    if (isUnique != null) {
      throw new Error('This barista already registered');
    }
  });
});
module.exports.barista_Validation = body('barista_name').exists().withMessage('barista name is mandatory').bail().trim();
module.exports.password = body('password').exists().withMessage('password cannot be empty').isLength({
  min: 5
}).withMessage('minimum 5 charecters').bail().trim();
module.exports._id = body('id').exists().isLength({
  min: 1
}).withMessage('Id cannot be empty').bail().trim();