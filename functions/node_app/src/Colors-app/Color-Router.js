const express = require('express')
const { add_color,get_colors,update_color,delete_color } = require('./Color-controller')
const { code, _id} = require('./Color-Validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_color', [code] ,validate ,add_color)
router.post('/get_colors',get_colors)
router.post('/update_color',[_id],validate,update_color)
router.post('/delete_color',[_id],validate,delete_color)

module.exports.colorRouter = router