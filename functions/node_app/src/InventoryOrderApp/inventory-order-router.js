const express = require('express')
const { add_order,get_orders,update_order,delete_order,get_brach_orders,printOrder,reorder} = require('./inventory-order-controller')
const {_id,order_date , device_id ,received_by, ordered_by,delivery_date,number_of_products,status,comment_by_barista,admin_msg,ordered_items} = require('./inventory-order-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/create_order',[device_id,ordered_by,number_of_products,comment_by_barista,ordered_items],validate ,add_order) //3
router.post('/get_orders', get_orders) // 1
router.post('/update_order', [_id] , validate ,update_order) //2
router.post('/delete_order',[_id], validate ,delete_order)
router.post('/branch_orders' ,get_brach_orders)
router.post('/print',printOrder) 
router.post('/reorder',reorder) 



module.exports.inventory_order_router = router


