const express = require('express')
const { create,login,logout,getGifts,delete_user,getWallet,scanUserQR,get_user,update,getOrder,forgotpassword,createCard,getCard,updateCard,deleteCard,addCart,checkUser,cancellOrder,placeOrder,getCart,deleteCart,apply_beans } = require('./User-controller')
const {first_name,last_name,birth_day,email,password,user_code,_id,user_id,holder_name,card_number,cvc,expiry_date,id} = require('./User-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()


router.post('/create_user', [first_name,last_name, birth_day,email,password] ,validate ,create)
router.post('/login', [ email,password], validate, login)
router.post('/logout', [_id], validate, logout)
router.post('/get_user',[], validate,get_user)
router.post('/delete_user',[_id], validate,delete_user)
router.post('/update_user',[_id], validate,update)
router.post('/forgotpassword',[email], validate,forgotpassword)
router.post('/check_user',[email] ,validate,checkUser)

router.post('/add_card',[user_id,holder_name, card_number,expiry_date] ,validate,createCard)
router.post('/delete_card',[_id],validate,deleteCard)
router.post('/update_card',[id],validate,updateCard)
router.post('/get_card',[user_id], validate, getCard)
router.post('/get_order', getOrder)
router.post('/get_wallet',[user_id], validate, getWallet)
router.post('/add_cart',addCart)
router.post('/get_cart',getCart)
router.post('/delete_cart',deleteCart)
router.post('/apply_bean',apply_beans)
router.post('/place_order',placeOrder)
router.post('/cancel_order',cancellOrder)
router.post('/get_gifts',[user_id], validate, getGifts)

////////////////////////////////////////////////////////////////////
// ||||||||| ||||||||| |||||||||
// |       | |       | |
// |       | |       | |
// ||||||||| |       | ||||||||
// |         |       |         |
// |         |       |         | 
// |         |||||||||  ||||||||
///////////////////////////////////////////////////////////////////

router.post('/scan-qr',[user_code], validate, scanUserQR)
module.exports.UserRouter = router