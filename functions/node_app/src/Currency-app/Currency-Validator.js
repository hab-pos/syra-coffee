const { body } = require('express-validator')
const {currencyRepository} = require('./Currency-repository')

module.exports.code = body('code')
  .exists().isLength({ min: 1 }).withMessage('currency code cannot be empty')
  .bail()
  .trim().custom((value, { _ }) => {
      return currencyRepository.isUniqueCode(value).then(isUnique => {
        if (isUnique != null) {
            throw new Error('This currency is already added')
          }
      })
  }).withMessage("currency code is mandatory")

  module.exports.symbol = body('symbol')
  .exists().isLength({ min: 1 }).withMessage('symbol cannot be empty')
  .bail()
  .trim()

  module.exports._id = body('id')
  .exists().isLength({ min: 1 }).withMessage('Id cannot be empty')
  .bail()
  .trim()