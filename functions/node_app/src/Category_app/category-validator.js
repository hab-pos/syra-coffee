const { body } = require('express-validator')

module.exports._id = body('id')
.exists().isLength({ min: 1 }).withMessage('Id cannot be empty')
.bail()
.trim()

  module.exports.category_name = body('category_name')
  .exists().withMessage('category name is mandatory')
  .bail()
  .trim()

  module.exports.color = body('color')
  .exists().withMessage('color is mandatory')
  .bail()
  .trim()

  module.exports.available_branches = body('available_branches')
  .exists().withMessage('available branches is mandatory')
  .bail()
  .trim()


  module.exports.is_Active = body('is_Active')
  .exists().withMessage('available branches is mandatory')
  .bail()
  .trim()

  module.exports.created_by = body('created_by')
  .exists().withMessage('Admin_id is mandatory')
  .bail().trim()
