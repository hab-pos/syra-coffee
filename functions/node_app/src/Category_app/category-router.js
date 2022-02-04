const express = require('express')
const { add_Category,get_category,update_category,delete_category,update_order,getBranchCategories,test_order} = require('./category-controller')
const { _id,category_name,color,available_branches,is_Active,created_by } = require('./category-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_category',[category_name, color, available_branches,is_Active,created_by],validate ,add_Category)
router.post('/get_categories' , get_category)
router.post('/update_category', [_id] , validate ,update_category)
router.post('/delete_category',[_id], validate ,delete_category)
router.post('/update_order' ,update_order)
router.post("/branch_category",getBranchCategories)
router.post("/test",test_order)


module.exports.categoryRouter = router