const express = require('express')
const { createExpense,getExpenses,updateExpense,deleteExpense} = require('./Expense-controller')
const {_id,motive, iva_id, price, payment,device_id,barista_id} = require('./Expense-validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/create_expense',[motive, iva_id, price, payment,device_id,barista_id],validate ,createExpense)
router.post('/get_expenses', getExpenses)
router.post('/update_expense' , validate ,updateExpense)
router.post('/delete_expense', validate ,deleteExpense)

module.exports.expenseRouter = router


