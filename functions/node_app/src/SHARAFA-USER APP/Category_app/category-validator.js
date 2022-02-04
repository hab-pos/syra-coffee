const { body } = require('express-validator')

module.exports._id = body('id')
.exists().isLength({ min: 1 }).withMessage('Id cannot be empty')
.bail()
.trim()

  module.exports.category_name = body('category_name')
  .exists().withMessage('category name is mandatory')
  .bail()
  .trim()

  module.exports.image_name = body('image_name')
  .exists().withMessage('Image name mandatory')
  .bail()
  .trim()

  module.exports.image_url = body('image_url')
  .exists().withMessage('Image URL is mandatory')
  .bail()
  .trim()


  module.exports.is_Active = body('is_Active')
  .exists().withMessage('isActive is mandatory')
  .bail()
  .trim()

  module.exports.order = body('order')
  .exists().withMessage('order is mandatory')
  .bail().trim()

  module.exports.is_deleted = body('is_deleted')
  .exists().withMessage('is_deleted is mandatory')
  .bail().trim()
