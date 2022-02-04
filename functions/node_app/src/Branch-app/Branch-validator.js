const { body } = require('express-validator')
const { branchRepository } = require('./branch-repository')

module.exports.created_by = body('created_by')
  .exists().withMessage('Admin_id is mandatory')
  .bail().trim()

  module.exports.branch_name = body('branch_name')
  .exists().withMessage('branch name is mandatory')
  .bail()
  .trim()

  module.exports.device_id = body('device_id')
  .exists().withMessage('device id is mandatory')
  .bail()
  .custom((value, { req }) => {
    return branchRepository.isUniqueCode(value)
      .then(isUnique => {
        if (isUnique != null) {
          throw new Error('device_id already exists, please use another device')
        }
      })
  })
  .trim()

  module.exports._id = body('id')
  .exists().isLength({ min: 1 }).withMessage('Id cannot be empty')
  .bail()
  .trim()