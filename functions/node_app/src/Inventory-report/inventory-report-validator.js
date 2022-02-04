const { body } = require('express-validator')

module.exports._id = body('id')
  .exists().isLength({ min: 1 }).withMessage('Id cannot be empty')
  .bail()
  .trim()

module.exports.final_remaining = body('final_remaining')
  .exists().withMessage('final_remaining name is mandatory')
  .bail()
  .trim()

module.exports.device_id = body('device_id')
  .exists().withMessage('device_id is mandatory')
  .bail()
  .trim()
