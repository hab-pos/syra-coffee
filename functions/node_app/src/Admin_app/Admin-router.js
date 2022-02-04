const express = require('express')
const { add_admin, admin_login,get_admin_details_by_id,logout,delete_admin,update_admin_details } = require('./Admin-controller')
const { validEmail,email_id,user_name,admin_recipt_message,password,_id } = require('./Admin-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_Admin', [email_id, user_name, validEmail ,admin_recipt_message, password] ,validate ,add_admin)
router.post('/login', [ validEmail,password], validate, admin_login)
router.post('/logout', [_id], validate, logout)
router.post('/get_admin_details',[_id], validate,get_admin_details_by_id)
router.post('/delete_admin',[_id], validate,delete_admin)
router.post('/update_admin_details',[_id],validate,update_admin_details)

module.exports.adminRouter = router