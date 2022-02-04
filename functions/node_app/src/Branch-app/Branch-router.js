const express = require('express')
const { add_branch, get_branch,delete_branch,update_branch} = require('./Branch-controller')
const { created_by,branch_name,device_id,_id } = require('./Branch-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_branch',[created_by, branch_name, device_id],validate ,add_branch)
router.post('/get_branches' , get_branch)
router.post('/update_branch', [_id] , validate ,update_branch)
router.post('/delete_branch',[_id], validate ,delete_branch)

module.exports.branchRouter = router