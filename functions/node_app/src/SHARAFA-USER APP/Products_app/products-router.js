const express = require('express')
const {addProduct,uploadPhoto,reorderCategory,getProducts,deleteProduct,updateProduct,updateOnlineStatus,getFeaturedProducts,get_all_products,getHomePage} = require('./products-controller')
const router = express.Router()

router.post('/add_product',addProduct)
router.post('/upload_image',uploadPhoto)
router.post('/re_order',reorderCategory)
router.post('/get_product' , getProducts)
router.post('/update_product',updateProduct)
router.post('/updateOnlineStatus',updateOnlineStatus)
router.post('/delete_product',deleteProduct)
router.post('/get_featured',getFeaturedProducts)
router.post('/get-all-products',get_all_products)
router.post('/get-home-page',getHomePage)


module.exports.ProductRouter = router