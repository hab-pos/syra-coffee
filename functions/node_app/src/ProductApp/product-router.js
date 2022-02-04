const express = require('express')
const { add_Product,get_products,update_products,delete_products,update_order,get_all_products,getBranchProducts,test_order} = require('./product-controller')
const {_id,product_name,price,iva,categories,color,available_branches,created_by} = require('./product-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_product',[product_name,price,iva,categories,color,available_branches,created_by],validate ,add_Product)
router.post('/get_products', get_products)
router.post('/update_product', [_id] , validate ,update_products)
router.post('/delete_product',[_id], validate ,delete_products)
router.post('/update_order' ,update_order)
router.post("/branch_products",getBranchProducts)
router.post('/get_all_products',get_all_products)
router.post('/test',test_order)

module.exports.productsRouter = router