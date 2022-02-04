const { body } = require('express-validator')
const {settingsRepository} = require('./settings-repository')

module.exports.code = body('code')
  .exists().isLength({ min: 1 }).withMessage('Setting title cannot be empty')
  .bail()
  .trim().custom((value, { _ }) => {
      return settingsRepository.isUniqueCode(value).then(isUnique => {
        if (isUnique != null) {
            throw new Error('This setting is already added')
          }
      })
  })

module.exports.value = body('value')
  .exists().isLength({ min: 1 }).withMessage('Setting name cannot be empty')
  .bail()
  .trim()

  module.exports._id = body('id')
  .exists().isLength({ min: 1 }).withMessage('Id cannot be empty')
  .bail()
  .trim()