const express = require('express')
const {add_order,get_orders,filter_reports,update,deleteAct} = require('./inventory-report-controller')
const {device_id,final_remaining} = require('./inventory-report-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_coffee_count',[device_id,final_remaining],validate ,add_order)
router.post('/get_reports' ,get_orders)
router.post('/filter_reports' ,filter_reports)
router.post('/update',update) 
router.post('/delete',deleteAct) 

module.exports.inventory_report_router = router


