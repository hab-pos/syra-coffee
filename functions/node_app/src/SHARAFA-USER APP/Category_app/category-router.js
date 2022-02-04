const express = require('express')
const { add_Category,uploadPhoto,get_category,update_category,reorderCategory,updateOnlineStatus,delete_category,update_order,getBranchCategories,test_order} = require('./category-controller')
const {_id,category_name,image_name,image_url,is_Active,order,is_deleted} = require('./category-validator')
const { validate } = require('../../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_category',add_Category)
router.post('/upload_image',uploadPhoto)
router.post('/re_order',reorderCategory)
router.post('/get_categories' , get_category)
router.post('/update_category',update_category)
router.post('/updateOnlineStatus',updateOnlineStatus)


router.post('/delete_category',[_id], validate ,delete_category)
// router.post('/update_order' ,update_order)
// router.post("/branch_category",getBranchCategories)
// router.post("/test",test_order)


module.exports.UsercategoryRouter = router