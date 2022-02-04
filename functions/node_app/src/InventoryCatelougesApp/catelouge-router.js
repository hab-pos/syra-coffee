const express = require('express')
const { add_inventory,get_inventories,update_inventory,delete_inventory,search_inventory,get_inventories_sorted} = require('./catelouge-controller')
const { _id,inventory_name,reference,unit,price,category_id,available_branches,created_by } = require('./catelouge-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_catelouge',[inventory_name,reference,unit,price,category_id,available_branches,created_by],validate ,add_inventory)
router.post('/get_catelouge' , get_inventories)
router.post('/update_catelouge', [_id] , validate ,update_inventory)
router.post('/delete_catelouge',[_id], validate ,delete_inventory)
router.post('/search_catelouge' , search_inventory)
router.post('/get_inventories_sorted' , get_inventories_sorted)


module.exports.catelougeRouter = router