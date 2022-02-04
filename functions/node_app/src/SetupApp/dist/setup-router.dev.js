"use strict";

var express = require('express');

var _require = require('./setup-controller'),
    addIVA = _require.addIVA,
    getIVA = _require.getIVA,
    deleteIVA = _require.deleteIVA,
    addExpense = _require.addExpense,
    getExpense = _require.getExpense,
    deleteExpense = _require.deleteExpense,
    addDiscount = _require.addDiscount,
    update_order = _require.update_order,
    getDiscounts = _require.getDiscounts,
    deleteDiscounts = _require.deleteDiscounts,
    getExpenseAndIva = _require.getExpenseAndIva;

var _require2 = require('./setup-validator'),
    _id = _require2._id,
    iva_precent = _require2.iva_precent,
    expense_name = _require2.expense_name,
    discount_name = _require2.discount_name,
    amount = _require2.amount,
    type = _require2.type,
    created_by = _require2.created_by;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/add_iva', [iva_precent, created_by], validate, addIVA);
router.post('/get_iva', getIVA);
router.post('/delete_iva', [_id], validate, deleteIVA);
router.post('/add_discount', [discount_name, amount, type, created_by], validate, addDiscount);
router.post('/get_discount', getDiscounts);
router.post('/delete_discount', [_id], validate, deleteDiscounts);
router.post('/add_expense', [expense_name, created_by], validate, addExpense);
router.post('/get_expense', getExpense);
router.post('/delete_expense', [_id], validate, deleteExpense);
router.post('/arrange_discounts', update_order);
router.post('/get_motive_iva', getExpenseAndIva);
module.exports.setupRouter = router;