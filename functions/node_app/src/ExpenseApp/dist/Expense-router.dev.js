"use strict";

var express = require('express');

var _require = require('./Expense-controller'),
    createExpense = _require.createExpense,
    getExpenses = _require.getExpenses,
    updateExpense = _require.updateExpense,
    deleteExpense = _require.deleteExpense;

var _require2 = require('./Expense-validator'),
    _id = _require2._id,
    motive = _require2.motive,
    iva_id = _require2.iva_id,
    price = _require2.price,
    payment = _require2.payment,
    device_id = _require2.device_id,
    barista_id = _require2.barista_id;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/create_expense', [motive, iva_id, price, payment, device_id, barista_id], validate, createExpense);
router.post('/get_expenses', getExpenses);
router.post('/update_expense', validate, updateExpense);
router.post('/delete_expense', validate, deleteExpense);
module.exports.expenseRouter = router;