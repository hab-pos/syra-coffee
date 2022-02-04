const { body } = require('express-validator')
const {colorRepository} = require('./Color-repository')

module.exports.code = body('color_code')
  .exists().isLength({ min: 1 }).withMessage('color code cannot be empty')
  .bail()
  .trim().custom((value, { _ }) => {
      return colorRepository.isUniqueCode(value).then(isUnique => {
        if (isUnique != null) {
            throw new Error('This color is already added')
          }
      })
  }).withMessage("Color code is mandatory")

  module.exports._id = body('id')
  .exists().isLength({ min: 1 }).withMessage('Id cannot be empty')
  .bail()
  .trim()