const express = require('express')
const { add_currency,get_currencies,update_currency,delete_currency } = require('./Currency-controller')
const { code, symbol , _id} = require('./Currency-Validator')
const { validate } = require('../../Utils/validation/validate.middleware')

const router = express.Router()

router.post('/add_currency', [code,symbol] ,validate ,add_currency)
router.post('/get_currencies',get_currencies)
router.post('/update_currency',[_id],validate,update_currency)
router.post('/delete_currency',[_id],validate,delete_currency)

module.exports.currencyRouter = router