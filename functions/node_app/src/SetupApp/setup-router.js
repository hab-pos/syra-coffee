const express = require('express')
const {addIVA,getIVA,deleteIVA,addExpense,getExpense,deleteExpense,addDiscount,update_order,getDiscounts,deleteDiscounts,getExpenseAndIva} = require('./setup-controller')
const {_id,iva_precent,expense_name,discount_name,amount,type,created_by} = require('./setup-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_iva',[iva_precent,created_by],validate ,addIVA)
router.post('/get_iva' , getIVA)
router.post('/delete_iva', [_id] , validate ,deleteIVA)

router.post('/add_discount',[discount_name,amount,type,created_by],validate ,addDiscount)
router.post('/get_discount' , getDiscounts)
router.post('/delete_discount', [_id] , validate ,deleteDiscounts)

router.post('/add_expense',[expense_name,created_by],validate ,addExpense)
router.post('/get_expense' , getExpense)
router.post('/delete_expense', [_id] , validate ,deleteExpense)

router.post('/arrange_discounts',update_order)

router.post('/get_motive_iva',getExpenseAndIva)

module.exports. setupRouter = router