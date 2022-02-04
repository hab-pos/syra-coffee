const { validationResult } = require('express-validator')
const { ValidationError } = require('./validation.error')

module.exports.validate = function (req, res, next) {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }

  errors.array().map(error => {
    error.rule = error.msg
    error.msg = `validation.${error.param}.${error.msg}`
    delete error.value
  })

  return res.api(422,errors.array().length > 0 ? errors.array()[0].rule : "Validation Error",{ "info" : errors.array()},false)
  //let  A =  ValidationError();
  //next(new ValidationError(errors.array()))
}
