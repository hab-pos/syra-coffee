class ValidationError extends Error {
  constructor (validationMessages) {
    super('validation.failed')
    this.name = 'VALIDATION_ERROR'
    this.validationMessages = validationMessages
  }

  handler (err, req, res, next) {
    const errors = err.validationMessages
      
    return res.api(
      422,
      'validation.errors',
      {
        url: req.url,
        method: req.method,
        errors: errors
      }
    )
  }
}

module.exports.ValidationError = ValidationError