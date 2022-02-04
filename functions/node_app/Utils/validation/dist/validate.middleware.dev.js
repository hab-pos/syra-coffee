"use strict";

var _require = require('express-validator'),
    validationResult = _require.validationResult;

var _require2 = require('./validation.error'),
    ValidationError = _require2.ValidationError;

module.exports.validate = function (req, res, next) {
  var errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  errors.array().map(function (error) {
    error.rule = error.msg;
    error.msg = "validation.".concat(error.param, ".").concat(error.msg);
    delete error.value;
  });
  return res.api(422, errors.array().length > 0 ? errors.array()[0].rule : "Validation Error", {
    "info": errors.array()
  }, false); //let  A =  ValidationError();
  //next(new ValidationError(errors.array()))
};