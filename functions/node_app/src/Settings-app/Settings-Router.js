const express = require('express')
const { add_setting,get_settings,update_Settings,delete_settings,upload_logo_image,get_logo } = require('./Settings-controller')
const { code,value,_id } = require('./Settings-Validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_settings', [code,value] ,validate ,add_setting)
router.post('/get_settings',get_settings)
router.post('/update_settings',update_Settings)
router.post('/delete_settings',[_id],validate,delete_settings)
router.post('/upload_logo',upload_logo_image)
router.post('/get_logo',get_logo)


module.exports.SettingsRouter = router