"use strict";

var express = require('express');

var _require = require('./User-controller'),
    create = _require.create,
    login = _require.login,
    logout = _require.logout,
    getGifts = _require.getGifts,
    delete_user = _require.delete_user,
    getWallet = _require.getWallet,
    get_user = _require.get_user,
    update = _require.update,
    getOrder = _require.getOrder,
    forgotpassword = _require.forgotpassword,
    createCard = _require.createCard,
    getCard = _require.getCard,
    updateCard = _require.updateCard,
    deleteCard = _require.deleteCard,
    addCart = _require.addCart,
    checkUser = _require.checkUser,
    cancellOrder = _require.cancellOrder,
    placeOrder = _require.placeOrder,
    getCart = _require.getCart,
    deleteCart = _require.deleteCart,
    apply_beans = _require.apply_beans;

var _require2 = require('./User-validator'),
    first_name = _require2.first_name,
    last_name = _require2.last_name,
    birth_day = _require2.birth_day,
    email = _require2.email,
    password = _require2.password,
    default_store = _require2.default_store,
    _id = _require2._id,
    user_id = _require2.user_id,
    holder_name = _require2.holder_name,
    card_number = _require2.card_number,
    cvc = _require2.cvc,
    expiry_date = _require2.expiry_date,
    id = _require2.id;

var _require3 = require('../../Utils/validation/validate.middleware'),
    validate = _require3.validate;

var router = express.Router();
router.post('/create_user', [first_name, last_name, birth_day, email, password], validate, create);
router.post('/login', [email, password], validate, login);
router.post('/logout', [_id], validate, logout);
router.post('/get_user', [], validate, get_user);
router.post('/delete_user', [_id], validate, delete_user);
router.post('/update_user', [_id], validate, update);
router.post('/forgotpassword', [email], validate, forgotpassword);
router.post('/check_user', [email], validate, checkUser);
router.post('/add_card', [user_id, holder_name, card_number, expiry_date], validate, createCard);
router.post('/delete_card', [_id], validate, deleteCard);
router.post('/update_card', [id], validate, updateCard);
router.post('/get_card', [user_id], validate, getCard);
router.post('/get_order', [user_id], validate, getOrder);
router.post('/get_wallet', [user_id], validate, getWallet);
router.post('/add_cart', addCart);
router.post('/get_cart', getCart);
router.post('/delete_cart', deleteCart);
router.post('/apply_bean', apply_beans);
router.post('/place_order', placeOrder);
router.post('/cancel_order', cancellOrder);
router.post('/get_gifts', [user_id], validate, getGifts);
module.exports.UserRouter = router;