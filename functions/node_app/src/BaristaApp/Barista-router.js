const express = require('express')
const { addBarista,barista_login,logout,get_barista_details_by_id,delete_barista,update_barista_password,
    update_test,get_report,get_all_barista,clockout,switch_user,get_branch_logged_in_users,get_report_graph} = require('./Barista-controller')
const { created_by,barista_name,barista_Validation,password,_id } = require('./Barista-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()


router.post('/add_barista', [created_by,barista_name, password] ,validate ,addBarista)
router.post('/login', [ barista_Validation,password], validate, barista_login)
router.post('/logout', [_id], validate, logout)
router.post('/get_barista_details',[_id], validate,get_barista_details_by_id)
router.post('/delete_barista',[_id], validate,delete_barista)
router.post('/update_password',[_id],update_barista_password)
router.post('/get_all_barista',get_all_barista)

router.post('/clockout',clockout)
router.post('/switch_user',switch_user)
router.post('/get_logged_in_baristas',get_branch_logged_in_users)
router.post('/get_report',get_report)

router.post('/get_report_graph',get_report_graph)

router.post('/update',update_test)

module.exports.baristaRouter = router