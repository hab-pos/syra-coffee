const { encryptPassword, comparePassword } = require('../../Utils/Common/crypto')
const { userRepository } = require("./User-repository")
const moment = require("moment");
const { UserModel, UserCreditCards, MyCartModel, UserOrdersModel, AppliedBeans, UserorderedProducts } = require('./User-model');
const nodemailer = require('nodemailer');
const { BrancheModel } = require('../Branch-app/Branch-model');
const { ModifiersModel } = require('../SHARAFA-USER APP/ModifiersApp/modifier-model');
const { UserProducts } = require('../SHARAFA-USER APP/Products_app/products-model');
const { IVAModel } = require('../SetupApp/setup-model');
const { UserCategories } = require('../SHARAFA-USER APP/Category_app/category-model');
var request = require('request');
const { SyraEvents } = require('../SHARAFA-USER APP/eventsApp/events-model');

module.exports.checkUser = async function (req, res, _) {
    const { email } = req.body
    let user = await UserModel.findOne({
        where: { email: email, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })

    if (user) {
        return res.api(200, 'Already registered user', null, false)
    }
    else {
        return res.api(200, 'New User', null, true)
    }
}

module.exports.create = async function (req, res, _) {
    const { first_name, last_name, birth_day, email, password, default_store } = req.body
    let date_of_birth = moment(birth_day, 'DD-MM-YYYY')
    let user = await UserModel.findOne({
        where: { email: email, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })
    // console.log("success",user)
    if (user) {
        return res.api(200, 'Already registered user', null, false)
    }
    else {
        await encryptPassword(password, function (err, hash) {
            if (err) {
                return res.api(500, "Internel server Error!,Could not generate password hash", null, false)
            }
            userRepository.addUser(first_name, last_name, date_of_birth, email, hash, default_store)
                .then(user_data => {

                    UserModel.findOne({
                        where: { _id: user_data._id }, include: [
                            { model: BrancheModel, as: "default_store_detail" },
                        ]
                    }).then(user => {
                        return res.api(200, 'User created successfully', user, true)

                    })

                })
        })
    }
}

module.exports.createCard = async function (req, res, _) {
    let result = await UserCreditCards.findOne({ where: { user_id: req.body.user_id, cardHash: req.body.cardHash, is_deleted: false } })
    if (result) {
        return res.api(200, 'Card is in your list already!', result, false)
    }
    else {
        let request = req.body
        let user_cards = await userRepository.getCard(req.body.user_id)

        if (user_cards.length == 0) {
            request.is_default = 1
        }
        let result = await userRepository.addCard(request)
        let card = await UserCreditCards.findOne({ where: { _id: result._id } })

        return res.api(200, 'Card added successfully', { card }, true)
    }
}
module.exports.getCard = async function (req, res, _) {
    let cards = await userRepository.getCard(req.body.user_id)
    return res.api(200, 'Card info retrived successfully', { cards }, true)
}
module.exports.updateCard = async function (req, res, _) {
    let card = await UserCreditCards.findOne({ where: { _id: req.body._id, is_deleted: false } })
    if (card) {
        await userRepository.updateCard(req.body)
        if (req.body.is_default) {
            await UserCreditCards.update({ is_default: 0 }, { where: { user_id: card.user_id, is_default: 1 } })
            await UserCreditCards.update({ is_default: 1 }, { where: { _id: req.body._id } })
        }
        let result = await UserCreditCards.findOne({ where: { _id: req.body._id, is_deleted: false } })
        return res.api(200, 'Card updated successfully', { card: result }, true)
    }
    else {
        return res.api(200, 'No card Data Found', null, false)
    }
}
module.exports.deleteCard = async function (req, res, _) {
    let card = await UserCreditCards.findOne({ where: { _id: req.body.id, is_deleted: false } })
    if (card) {
        await userRepository.deleteCard(req.body.id)
        return res.api(200, 'Card Deleted successfully', null, true)
    }
    else {
        return res.api(200, 'No card Data Found', null, false)
    }
}
module.exports.login = async function (req, res, _) {
    const { email, password } = req.body
    let user = JSON.parse(JSON.stringify(await UserModel.findOne({
        where: { email: email, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })))
    if (user) {
        await comparePassword(password, user.password).then((status) => {
            if (status) {
                userRepository.loginStatus(user._id, true)
                    .then(user_data => {
                        return res.api(200, 'Logged-in successfully!', user, true)
                    })
            }
            else {
                return res.api(200, 'Invalid password!', null, false)
            }
        })
    }
    else {
        return res.api(200, 'Not a registered user!', null, false)
    }
}

async function getCartPriceDetails(user_id, returnDetails = false) {
    var response = {}
    var cartList = await MyCartModel.findAll({
        where: { user_id: user_id, is_deleted: false }, include: [
            { model: UserModel, as: "user_info" },
            { model: UserProducts, as: "product_info" },
            { model: ModifiersModel, as: "required_modifier_detail" },
            { model: ModifiersModel, as: "optional_modifier_detail" },
            { model: SyraEvents, as: "event_info" },
        ]
    })
    cartList = JSON.parse(JSON.stringify(cartList))
    let priceInfo = calculatePrice(cartList)

    response.cart_count = priceInfo.cartList.length
    if (returnDetails) {
        response.cart_data = priceInfo.cartList
    }
    response.bill_list = priceInfo.price_details
    response.total_price = "€" + (priceInfo.total_price).toFixed(2)
    response.total_price_to_pay = priceInfo.total_price_to_pay
    response.proceedToPayOnline = priceInfo.total_price_to_pay > 0
    response.beans_earned = (priceInfo.total_price * 10).toFixed()
    response.bean_to_earn = priceInfo.bean_to_earn
    return response
}

module.exports.get_user = async function (req, res) {
    let user = await UserModel.findOne({
        where: { _id: req.body.id, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })
    return res.api(200, 'user info retrived', user, true)
}

module.exports.logout = async function (req, res, _) {
    let user = await UserModel.findOne({
        where: { _id: req.body.id, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })
    if (user) {
        userRepository.loginStatus(user._id, false)
            .then(user_data => {
                return res.api(200, 'Logged-out successfully!', null, true)
            })
    }
    else {
        return res.api(200, 'Not a registered user!', null, true)
    }
}
module.exports.delete_user = async function (req, res, _) {
    let user = await UserModel.findOne({
        where: { _id: req.body.id, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })
    if (user) {
        userRepository.deleteUser(user._id)
            .then(user_data => {
                return res.api(200, 'User_deleted successfully!', user_data, true)
            })
    }
    else {
        return res.api(200, 'Not a registered user!', null, true)
    }
}
module.exports.update = async function (req, res, _) {

    let request = JSON.parse(JSON.stringify(req.body))
    let user = await UserModel.findOne({
        where: { _id: request.id, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })
    if (request.birth_day) {
        request.birth_day = moment(request.birth_day, 'DD-MM-YYYY')
    }
    if (user) {
        if (request.password) {
            if (request.password.length < 5) {
                return res.api(200, 'Please choose minimum 5 charecters!', null, false)
            }
            else {
                await comparePassword(request.old_password, user.password).then((status) => {
                    if (status) {
                        comparePassword(request.password, user.password).then((status) => {
                            if (status) {
                                return res.api(200, 'old and new password cannot be same!', null, false)
                            }
                            else {
                                encryptPassword(request.password, function (err, hash) {
                                    request.password = hash
                                    userRepository.updateUser(request).then((result) => {
                                        return res.api(200, 'password changed', null, true)
                                    })
                                })
                            }
                        })

                    }
                    else {
                        return res.api(200, 'Invalid password!', null, false)
                    }
                })
            }
        } else {
            if (request.email) {
                let user = await UserModel.findOne({
                    where: { email: request.email, is_deleted: false }
                })

                if (user) {
                    return res.api(200, 'Email already taken!', null, false)

                }
                else {
                    await userRepository.updateUser(request)
                    let user = await UserModel.findOne({
                        where: { _id: request.id, is_deleted: false }, include: [
                            { model: BrancheModel, as: "default_store_detail" },
                        ]
                    })
                    return res.api(200, 'Updated successfully!', user, true)
                }
            }
            else {
                await userRepository.updateUser(request)
                let user = await UserModel.findOne({
                    where: { _id: request.id, is_deleted: false }, include: [
                        { model: BrancheModel, as: "default_store_detail" },
                    ]
                })
                return res.api(200, 'Updated successfully!', user, true)
            }
        }
    }
    else {
        return res.api(200, 'Not a registered user!', null, false)
    }
}

module.exports.forgotpassword = async function (req, res, _) {
    let user = await UserModel.findOne({
        where: { email: req.body.email, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })
    if (user) {
        var randomstring = Math.random().toString(36).slice(-8);
        encryptPassword(randomstring, function (err, hash) {
            userRepository.updateUser({ _id: user._id, password: hash, id: user._id }).then((result) => {
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: 'facturas@syra.coffee',
                        pass: 'qnbjgmwtxlkmezaa'
                    }
                });

                var mailOptions = {
                    from: 'facturas@syra.coffee',
                    to: req.body.email,
                    subject: 'Password change Alert',
                    text: "Here is a new password for your account " + randomstring,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.api(200, "cannot send Mail", error, false)
                    }
                    return res.api(200, 'password sent to your mail', null, true)
                });
            })
        })
    }
    else {
        return res.api(200, 'Not a registered user!', null, true)
    }
}

module.exports.addCart = async function (req, res, _) {

    console.log(req.body)
    var claimWalletFailed = false
    if (req.body.update_type == "multiple") {  //&& (req.body.event_id == null || req.body.event_id == "" || req.body.event_id == undefined) && (req.body.wallet_id == null || req.body.wallet_id == "" || req.body.wallet_id == undefined)
        await MyCartModel.destroy({ where: { user_id: req.body.user_id, product_id: req.body.product_id, event_id: req.body.event_id ? req.body.event_id : null, wallet_id: req.body.wallet_id ? req.body.wallet_id : null } })
    }
    let user = await UserModel.findOne({ where: { _id: req.body.user_id, is_deleted: false } })
    if (user) {
        let product_info = await UserProducts.findOne({ where: { _id: req.body.product_id } })
        var cart_info = null

        var cartList = await MyCartModel.findAll({
            where: { user_id: req.body.user_id, is_deleted: false }, include: [
                { model: UserModel, as: "user_info" },
                { model: UserProducts, as: "product_info" },
                { model: ModifiersModel, as: "required_modifier_detail" },
                { model: ModifiersModel, as: "optional_modifier_detail" },
                { model: SyraEvents, as: "event_info" },
            ]
        })
        var is_gift_present = cartList.filter(function (data) {
            return data.is_claiming_gift
        }).length == cartList.length
        let quantity = Number(req.body.quantity)
        let predicateBean = quantity * Number(product_info.beans_value)
        if ((req.body.is_beans_applied || req.body.is_claiming_gift) && predicateBean > Number(user.beansEarnerd) && req.body.update_type != "single") {
            return res.api(200, 'Earn more bean to claim more rewards!', null, false)
        }
        else {
            for (let index = 0; index < req.body.quantity; index++) {
                if (product_info.setup_selected == "modifiers") {
                    cart_info = await MyCartModel.findOne({ where: { user_id: req.body.user_id, product_id: req.body.product_id, required_modifiers: (req.body.required_modifiers && (req.body.required_modifiers[index] == "" || req.body.required_modifiers[index] == "null" || req.body.required_modifiers[index] == undefined)) ? null : req.body.required_modifiers[index], optional_modifiers: (req.body.optional_modifiers && req.body.optional_modifiers[index] != "" && req.body.optional_modifiers[index] != "null" && req.body.optional_modifiers[index] != undefined) ? req.body.optional_modifiers[index] : null, is_deleted: false, event_id: req.body.event_id ? req.body.event_id : null, wallet_id: ((req.body.wallet_count || null) == null) ? req.body.wallet_id  : index < Number(req.body.wallet_count) ? (req.body.wallet_id ? req.body.wallet_id : null) : null } })
                }
                else {
                    cart_info = await MyCartModel.findOne({ where: { user_id: req.body.user_id, product_id: req.body.product_id, grains: (req.body.grinds && req.body.grinds.length > 0 && req.body.grinds[index] != "" && req.body.grinds[index] != "null" && req.body.grinds[index] != undefined) ? req.body.grinds[index] : null, is_deleted: false, event_id: req.body.event_id ? req.body.event_id : null, wallet_id: ((req.body.wallet_count || null) == null) ? req.body.wallet_id  : index < Number(req.body.wallet_count) ? (req.body.wallet_id ? req.body.wallet_id : null) : null } })
                }

                if (cart_info) {
                    if ((Number(req.body.quantity) < Number(cart_info.quantity))) {
                        await MyCartModel.update({ quantity: Number(cart_info.quantity) - 1 }, { where: { _id: cart_info._id } })
                    }
                    else {
                        if (Number(req.body.quantity) > cart_info.quantity) {
                            if ((is_gift_present && req.body.update_type == "single") || (req.body.is_claiming_gift && req.body.update_type == "single")) {
                                if (!cart_info.is_claim_wallet) {
                                    let quantity = Number(cart_info.quantity)
                                    let product_beans = quantity * Number(product_info.beans_value)
                                    let total_bean = cartList.reduce((a, b) => a + ((Number(b.quantity) * Number(b.product_info.beans_value)) || 0), 0);

                                    let predicate_bean = total_bean - product_beans + (product_beans + Number(product_info.beans_value))
                                    if (predicate_bean > Number(user.beansEarnerd)) {
                                        return res.api(200, 'Earn more bean to claim more rewards!', null, false)
                                    }
                                    else {
                                        await MyCartModel.update({ quantity: Number(cart_info.quantity) + 1 }, { where: { _id: cart_info._id } })
                                    }
                                }
                            }
                            else {
                                console.log(cart_info.is_claim_wallet,"checjas")
                                if (!cart_info.is_claim_wallet) {
                                    await MyCartModel.update({ quantity: Number(cart_info.quantity) + 1 }, { where: { _id: cart_info._id } })
                                }
                            }
                            claimWalletFailed = cart_info.is_claim_wallet
                        }
                    }
                }
                else {
                    let is_claiming_gift = req.body.is_claiming_gift ? req.body.is_claiming_gift : req.body.is_beans_applied
                    await MyCartModel.create({ user_id: req.body.user_id, product_id: req.body.product_id, quantity: req.body.is_claim_wallet ? (quantity == req.body.wallet_count) ? req.body.quantity : 1 : 1, required_modifiers: (req.body.required_modifiers && req.body.required_modifiers[index] != "" && req.body.required_modifiers[index] != "null" && req.body.required_modifiers[index] != undefined) ? req.body.required_modifiers[index] : null, optional_modifiers: req.body.optional_modifiers ? (req.body.optional_modifiers[index] != "null" && req.body.optional_modifiers[index] != undefined && req.body.optional_modifiers[index] != "") ? req.body.optional_modifiers[index] : null : null, grains: (req.body.grinds && req.body.grinds.length > 0 && req.body.grinds[index] != "") ? req.body.grinds[index] : null, order_status: "pending", is_claiming_gift: is_claiming_gift, is_claim_wallet: (index < Number(req.body.wallet_count)) ? (req.body.is_claim_wallet || false) : false, wallet_id: ((req.body.wallet_count || null) == null) ? req.body.wallet_id  : index < Number(req.body.wallet_count) ? (req.body.wallet_id ? req.body.wallet_id : null) : null , is_reorder: req.body.is_reorder || null, event_id: req.body.event_id || null,wallet_count : req.body.wallet_count })
                }
            }

            // console.log(req.body.quantity == 0 && ((req.body.required_modifiers && req.body.required_modifiers.length > 0) || (req.body.optional_modifiers && req.body.optional_modifiers.length > 0) || (req.body.grinds && req.body.grinds.length > 0)))
            // console.log(req.body)
            if (req.body.quantity == 0 && ((req.body.required_modifiers && req.body.required_modifiers.length > 0) || (req.body.optional_modifiers && req.body.optional_modifiers.length > 0) || (req.body.grinds && req.body.grinds.length > 0))) {
                if (product_info.setup_selected == "modifiers") {
                    await MyCartModel.destroy({ where: { user_id: req.body.user_id, product_id: req.body.product_id, required_modifiers: (req.body.required_modifiers && req.body.required_modifiers[0] != "") ? req.body.required_modifiers[0] : null, optional_modifiers: (req.body.optional_modifiers && req.body.optional_modifiers[0] != "") ? req.body.optional_modifiers[0] : null, is_deleted: false, event_id: req.body.event_id ? req.body.event_id : null, wallet_id: ((req.body.wallet_count || null) == null) ? req.body.wallet_id  : index < Number(req.body.wallet_count) ? (req.body.wallet_id ? req.body.wallet_id : null) : null } })
                }
                else {
                    await MyCartModel.destroy({ where: { user_id: req.body.user_id, product_id: req.body.product_id, grains: (req.body.grinds && req.body.grinds[0] != "") ? req.body.grinds[0] : null, is_deleted: false, event_id: req.body.event_id ? req.body.event_id : null, wallet_id: ((req.body.wallet_count || null) == null) ? req.body.wallet_id  : index < Number(req.body.wallet_count) ? (req.body.wallet_id ? req.body.wallet_id : null) : null } })
                }
            }
            else {
                if (req.body.quantity == 0) {
                    await MyCartModel.destroy({ where: { user_id: req.body.user_id, product_id: req.body.product_id } })
                }
            }
        }



         //getCart
         var cartList = await MyCartModel.findAll({
            where: { user_id: req.body.user_id, is_deleted: false }, include: [
                { model: UserModel, as: "user_info" },
                { model: UserProducts, as: "product_info" },
                { model: ModifiersModel, as: "required_modifier_detail" },
                { model: ModifiersModel, as: "optional_modifier_detail" },
                { model: SyraEvents, as: "event_info" },
            ]
        })
        var response = {}
        cartList = JSON.parse(JSON.stringify(cartList))
        let priceInfo = calculatePrice(cartList)
        cartList = JSON.parse(JSON.stringify(cartList))
        let CartCount = await MyCartModel.count({ where: { user_id: req.body.user_id || "", is_deleted: false } })
        response.cart_count = CartCount
        response.cart_data = priceInfo.cartList
        response.bill_list = priceInfo.price_details
        response.cart_data = priceInfo.cartList
        response.bill_list = priceInfo.price_details
        response.total_price = "€" + (priceInfo.total_price).toFixed(2)
        console.log(priceInfo.bean_to_earn,"bean_to check")
        response.beans_earned = priceInfo.bean_to_earn.toFixed(0)
        let default_card = await UserCreditCards.findOne({ where: { user_id: req.body.user_id, is_default: true, is_deleted: false } })
        response.default_branch = user.default_store_detail
        response.default_card = default_card
        response.enable_bean = priceInfo.total_bean <= user.beansEarnerd
        is_gift_present = cartList.filter(function (data) {
            return data.is_claiming_gift
        }).length == cartList.length
        response.is_all_gift = is_gift_present
        let is_all_wallet = cartList.filter(function (data) {
            return data.is_claim_wallet
        }).length == cartList.length
        response.is_all_wallet = is_all_wallet
        // if (req.body.is_beans_applied) {
        //     if (is_gift_present) {
        //         response.beans_applied = Number(user.beansEarnerd) < priceInfo.total_bean ? Number(user.beansEarnerd).toFixed() : priceInfo.total_bean.toFixed()
        //         let price = (Number(priceInfo.total_bean) - Number(response.beans_applied)) / 10
        //         // let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
        //         response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
        //         response.beans_earned =  price > 0 ? (price * 10).toFixed() : "0.00"
        //         response.total_price_to_pay = price * 100
        //         response.proceedToPayOnline = (price * 100) > 0
        //         response.is_all_gift = is_gift_present && price <= 0

        //         let discount_price =  Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
        //         response.discount_price = "€" + (Number(discount_price)).toFixed(2)
        //     }
        //     else {

        //         // let totalBean = Math.round(Number(priceInfo.total_price) * 10)
        //         let totalBean = Number(priceInfo.total_bean)

        //         response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0)
        //         // response.discount_price = "€" + (Number(response.beans_applied) / 10).toFixed(2)

        //         let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
        //         response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
        //         response.beans_earned =  price > 0 ? (price * 10).toFixed() : "0.00"

        //         response.total_price_to_pay = price * 100
        //         response.proceedToPayOnline = (price * 100) > 0
        //         response.is_all_gift = is_gift_present && price <= 0
        //         let discount_price =  Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
        //         response.discount_price = "€" + (Number(discount_price)).toFixed(2)
        //     }
        // }
        // else {

        if (is_gift_present) {

            let totalBean = Number(priceInfo.total_bean)
            response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0)
            let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
            response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
            // response.beans_earned = price > 0 ? (price * 10).toFixed() : "0.00"
            response.total_price_to_pay = price
            response.proceedToPayOnline = price > 0
            response.is_all_gift = is_gift_present && price <= 0
            let discount_price = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
            response.discount_price = "€" + (Number(discount_price)).toFixed(2)
        }
        else {

            // response.discount_price = "0.00"
            // response.beans_applied = "0.00"
            // response.total_price_to_pay = priceInfo.total_price_to_pay
            // response.proceedToPayOnline = priceInfo.total_price_to_pay > 0
            // response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0

            response.beans_applied = "0.00"
            response.discount_price = "0.00"
            response.total_price = "€" + (priceInfo.total_price).toFixed(2)
            // response.beans_earned = (priceInfo.total_price * 10).toFixed()
            response.total_price_to_pay = priceInfo.total_price_to_pay
            response.proceedToPayOnline = priceInfo.total_price_to_pay > 0
            response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0
        }
        // }
        return res.api(200, claimWalletFailed ? 'You cannot update your wallet product count!' : 'updated to cart', response, true)
    }
    else {
        return res.api(200, 'No user Found, Could not add to cart!', null, true)
    }
}


module.exports.updateCart = async function (req, res, _) {
    let user = await UserModel.findOne({ where: { _id: req.body.user_id, is_deleted: false } })
    if (user) {
        let product_info = await UserProducts.findOne({ where: { _id: req.body.product_id, is_deleted: false } })
        var cart_info = null

        //explicit_delete from APP
        for (let index = 0; index < req.body.req_modifiers_to_remove.length; index++) {
            if (product_info.setup_selected == "modifiers") {
                let item = await MyCartModel.findOne({ where: { user_id: req.body.user_id, product_id: req.body.product_id, required_modifiers: req.body.req.body.req_modifiers_to_remove[index], optional_modifiers: req.body.req.body.opt_modifiers_to_remove ? req.body.req.body.opt_modifiers_to_remove[index] : null, is_deleted: false } })

                if (Number(item.quantity) > 1) {
                    await MyCartModel.update({ quantity: Number(item.quantity) - 1 }, { where: { _id: item._id, event_id: req.body.event_id } })
                }
                else {
                    await MyCartModel.destroy({ where: { _id: item._id } })
                }
            }
            else {
                let item = await MyCartModel.findOne({ where: { user_id: req.body.user_id, product_id: req.body.product_id, grains: req.body.grinds_to_remove[index], is_deleted: false } })
                if (Number(item.quantity) > 1) {
                    await MyCartModel.update({ quantity: Number(item.quantity) - 1 }, { where: { _id: item._id, event_id: req.body.event_id } })
                }
                else {
                    await MyCartModel.destroy({ where: { _id: item._id } })
                }
            }
        }

        for (let index = 0; index < req.body.quantity; index++) {
            if (product_info.setup_selected == "modifiers") {
                cart_info = await MyCartModel.findOne({ where: { user_id: req.body.user_id, product_id: req.body.product_id, required_modifiers: req.body.required_modifiers[index] || null, optional_modifiers: req.body.optional_modifiers ? req.body.optional_modifiers[index] : null, is_deleted: false } })
            }
            else {
                cart_info = await MyCartModel.findOne({ where: { user_id: req.body.user_id, product_id: req.body.product_id, grains: req.body.grinds ? req.body.grinds[index] : null, is_deleted: false } })
            }

            if (cart_info) {
                await MyCartModel.update({ user_id: req.body.user_id, product_id: req.body.product_id, quantity: cart_info.quantity, required_modifiers: req.body.required_modifiers ? req.body.required_modifiers[index] : null, optional_modifiers: req.body.optional_modifiers ? req.body.optional_modifiers[index] != "null" ? req.body.optional_modifiers[index] : null : null, grains: req.body.grinds ? req.body.grinds[index] : null, order_status: "pending" }, { where: { _id: cart_info._id } })
            }
            else {
                await MyCartModel.create({ user_id: req.body.user_id, product_id: req.body.product_id, quantity: 1, required_modifiers: req.body.required_modifiers ? req.body.required_modifiers[index] : null, optional_modifiers: req.body.optional_modifiers ? req.body.optional_modifiers[index] != "null" ? req.body.optional_modifiers[index] : null : null, grains: req.body.grinds ? req.body.grinds[index] : null, order_status: "pending", is_reorder: req.body.is_reorder })
            }
        }
        var response = await getCartPriceDetails(req.body.user_id, true)
        return res.api(200, 'cart updated', response, true)
    }
    else {
        return res.api(200, 'No user Found, Could not add to cart!', null, true)
    }
}
module.exports.getCart = async function (req, res, _) {

    let user = await UserModel.findOne({
        where: { _id: req.body.user_id, is_deleted: false }, include: [
            { model: BrancheModel, as: "default_store_detail" },
        ]
    })
    var response = {}
    if (user) {
        var cartList = await MyCartModel.findAll({
            where: { user_id: req.body.user_id, is_deleted: false }, include: [
                { model: UserModel, as: "user_info" },
                { model: UserProducts, as: "product_info" },
                { model: ModifiersModel, as: "required_modifier_detail" },
                { model: ModifiersModel, as: "optional_modifier_detail" },
                { model: SyraEvents, as: "event_info" },
            ]
        })
        cartList = JSON.parse(JSON.stringify(cartList))
        let priceInfo = calculatePrice(cartList)

        response.cart_data = priceInfo.cartList
        response.bill_list = priceInfo.price_details
        response.total_price = "€" + (priceInfo.total_price).toFixed(2)
        console.log(priceInfo.bean_to_earn,"bean_to check")
        response.beans_earned = priceInfo.bean_to_earn.toFixed(0)
        let default_card = await UserCreditCards.findOne({ where: { user_id: req.body.user_id, is_default: true, is_deleted: false } })
        response.default_branch = user.default_store_detail
        response.default_card = default_card
        response.enable_bean = priceInfo.total_bean <= user.beansEarnerd
        let is_gift_present = cartList.filter(function (data) {
            return data.is_claiming_gift
        }).length == cartList.length
        response.is_all_gift = is_gift_present
        let is_all_wallet = cartList.filter(function (data) {
            return data.is_claim_wallet
        }).length == cartList.length
        response.is_all_wallet = is_all_wallet
        // if (req.body.is_beans_applied) {
        //     if (is_gift_present) {
        //         response.beans_applied = Number(user.beansEarnerd) < priceInfo.total_bean ? Number(user.beansEarnerd).toFixed() : priceInfo.total_bean.toFixed()
        //         let price = (Number(priceInfo.total_bean) - Number(response.beans_applied)) / 10
        //         // let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
        //         response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
        //         response.beans_earned =  price > 0 ? (price * 10).toFixed() : "0.00"
        //         response.total_price_to_pay = price * 100
        //         response.proceedToPayOnline = (price * 100) > 0
        //         response.is_all_gift = is_gift_present && price <= 0

        //         let discount_price =  Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
        //         response.discount_price = "€" + (Number(discount_price)).toFixed(2)
        //     }
        //     else {

        //         // let totalBean = Math.round(Number(priceInfo.total_price) * 10)
        //         let totalBean = Number(priceInfo.total_bean)

        //         response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0)
        //         // response.discount_price = "€" + (Number(response.beans_applied) / 10).toFixed(2)

        //         let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
        //         response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
        //         response.beans_earned =  price > 0 ? (price * 10).toFixed() : "0.00"

        //         response.total_price_to_pay = price * 100
        //         response.proceedToPayOnline = (price * 100) > 0
        //         response.is_all_gift = is_gift_present && price <= 0
        //         let discount_price =  Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
        //         response.discount_price = "€" + (Number(discount_price)).toFixed(2)
        //     }
        // }
        // else {

        if (is_gift_present) {

            let totalBean = Number(priceInfo.total_bean)
            response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0)
            let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
            response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
            // response.beans_earned = price > 0 ? (price * 10).toFixed() : "0.00"
            response.total_price_to_pay = price
            response.proceedToPayOnline = price > 0
            response.is_all_gift = is_gift_present && price <= 0
            let discount_price = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
            response.discount_price = "€" + (Number(discount_price)).toFixed(2)
        }
        else {

            // response.discount_price = "0.00"
            // response.beans_applied = "0.00"
            // response.total_price_to_pay = priceInfo.total_price_to_pay
            // response.proceedToPayOnline = priceInfo.total_price_to_pay > 0
            // response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0

            response.beans_applied = "0.00"
            response.discount_price = "0.00"
            response.total_price = "€" + (priceInfo.total_price).toFixed(2)
            // response.beans_earned = (priceInfo.total_price * 10).toFixed()
            response.total_price_to_pay = priceInfo.total_price_to_pay
            response.proceedToPayOnline = priceInfo.total_price_to_pay > 0
            response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0
        }
        // }
        return res.api(200, 'cart data retrived successfully', response, true)
    }
    else {
        return res.api(200, 'No user Found', null, true)
    }
}

module.exports.apply_beans = async function (req, res, _) {

    let user = await UserModel.findOne({ where: { _id: req.body.user_id, is_deleted: false } })
    var response = {}
    if (user) {
        var cartList = await MyCartModel.findAll({
            where: { user_id: req.body.user_id, is_deleted: false }, include: [
                { model: UserModel, as: "user_info" },
                { model: UserProducts, as: "product_info" },
                { model: ModifiersModel, as: "required_modifier_detail" },
                { model: ModifiersModel, as: "optional_modifier_detail" },
                { model: SyraEvents, as: "event_info" },
            ]
        })
        cartList = JSON.parse(JSON.stringify(cartList))
        let priceInfo = calculatePrice(cartList)

        let is_gift_present = cartList.filter(function (data) {
            return data.is_claiming_gift
        }).length == cartList.length

        response.is_all_gift = is_gift_present

        if (req.body.type == "apply") {
            if (priceInfo.total_bean > user.beansEarnerd) {
                let errorMessage = "You should have " + priceInfo.total_bean + " to purchase through bean!, but you have only " + user.beansEarnerd + " beans"
                return res.api(200, errorMessage, null, false)
            }
            else {
                if (is_gift_present) {
                    response.beans_applied = Number(user.beansEarnerd) < priceInfo.total_bean ? Number(user.beansEarnerd).toFixed() : priceInfo.total_bean.toFixed()
                    // response.discount_price = "€" + (Number(response.beans_applied) / 10).toFixed(2)

                    let price = (Number(priceInfo.total_bean) - Number(response.beans_applied)) / 10
                    // let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)

                    response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
                    response.beans_earned = price > 0 ? (price * 10).toFixed() : "0.00"
                    response.total_price_to_pay = price * 100
                    response.proceedToPayOnline = (price * 100) > 0
                    response.is_all_gift = is_gift_present && price <= 0
                    let discount_price = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
                    response.discount_price = "€" + (Number(discount_price)).toFixed(2)

                }
                else {
                    // let totalBean = Math.round(Number(priceInfo.total_price) * 10)
                    let totalBean = Number(priceInfo.total_bean)
                    response.beans_applied = Number(user.beansEarnerd) < totalBean ? Number(user.beansEarnerd).toFixed(0) : totalBean.toFixed(0)
                    // response.discount_price = "€" + (Number(response.beans_applied) / 10).toFixed(2)

                    let price = Number(priceInfo.total_price) - (Number(response.beans_applied) / 10)
                    response.total_price = "€" + (price > 0 ? price.toFixed(2) : "0.00")
                    response.beans_earned = price > 0 ? (price * 10).toFixed() : "0.00"

                    response.total_price_to_pay = price * 100
                    response.proceedToPayOnline = (price * 100) > 0
                    response.is_all_gift = is_gift_present && price <= 0
                    let discount_price = Number(response.beans_applied) / 10 > Number(priceInfo.total_price) ? Number(priceInfo.total_price) : Number(response.beans_applied) / 10
                    response.discount_price = "€" + (Number(discount_price)).toFixed(2)

                }
            }
        }
        else {
            response.total_price = "€" + (priceInfo.total_price).toFixed(2)
            response.beans_earned = (priceInfo.total_price * 10).toFixed()
            response.total_price_to_pay = priceInfo.total_price_to_pay
            response.proceedToPayOnline = priceInfo.total_price_to_pay > 0
            response.is_all_gift = is_gift_present && priceInfo.total_price_to_pay <= 0
        }
        return res.api(200, 'cart data retrived successfully', response, true)
    }
    else {
        return res.api(200, 'No user Found', null, true)
    }
}

function calculatePrice(cartList) {
    var grinds_list =
        [
            {
                grind_name: "Whole Beans",
                _id: "whole_beans",
                price: "0",
                beans_value: "0"
            },
            {
                grind_name: "Espresso",
                _id: "espresso",
                price: "0",
                beans_value: "0"
            },
            {
                grind_name: "Moka Pot",
                _id: "moka_pot",
                price: "0",
                beans_value: "0"
            },
            {
                grind_name: "French Press",
                _id: "french_press",
                price: "0",
                beans_value: "0"
            },
            {
                grind_name: "Filter",
                _id: "filter",
                price: "0",
                beans_value: "0"
            }
        ]
    let price_details = []
    var total_price = 0.0 //to calculte overall total
    var total_price_with_out_tax = 0.0
    var total_bean = 0
    let selected_graind = null
    var bean_to_earn = 0
    for (let index = 0; index < cartList.length; index++) {
        const element = cartList[index];
        product_total = 0
        product_bean = 0 //to calculte indivdual product total
        product_total_wo_tax = 0
        if (element.product_info.setup_selected == "modifiers") {
            //to calculate over all price
            total_price += Number(element.quantity) * (Number(element.is_claim_wallet ? 0.00 : element.product_info.price) + Number(element.is_claim_wallet ? 0.00 : element.required_modifier_detail ? element.required_modifier_detail.price : "0") + (element.is_claim_wallet ? 0.00 : element.optional_modifier_detail != null ? Number(element.is_claim_wallet ? 0.00 : element.optional_modifier_detail.price) : 0))
            //total_bean
            total_bean += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.beans_value) + Number(element.is_claim_wallet ? 0 : element.required_modifier_detail ? element.required_modifier_detail.beans_value : "0") + (element.optional_modifier_detail != null ? Number(element.is_claim_wallet ? 0 : element.optional_modifier_detail.beans_value || "0") : 0))
            //to caluclate total_price without tax
            total_price_with_out_tax += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.price_without_tax) + Number(element.is_claim_wallet ? 0 : element.required_modifier_detail ? element.required_modifier_detail.price_without_tax : "0") + (element.optional_modifier_detail != null ? Number(element.is_claim_wallet ? 0 : element.optional_modifier_detail.price_without_tax || "0") : 0))

            //to caluclate total_price without tax
            product_total_wo_tax += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.price_without_tax) + Number(element.is_claim_wallet ? 0 : element.required_modifier_detail ? element.required_modifier_detail.price_without_tax : "0") + (element.optional_modifier_detail != null ? Number(element.is_claim_wallet ? 0 : element.optional_modifier_detail.price_without_tax) : 0))

            //to calculte indivdual product total
            product_total += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.price) + Number(element.is_claim_wallet ? 0 : element.required_modifier_detail ? element.required_modifier_detail.price : "0") + (element.optional_modifier_detail != null ? Number(element.is_claim_wallet ? 0 : element.optional_modifier_detail.price) : 0))

            //to calculte indivdual product bean
            product_bean += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.beans_value) + Number(element.is_claim_wallet ? 0 : element.required_modifier_detail ? element.required_modifier_detail.beans_value : "0") + (element.optional_modifier_detail != null ? Number(element.is_claim_wallet ? 0 : element.optional_modifier_detail.beans_value) : 0))

            //to display price list
            price_details.push({ title: element.quantity + "X " + element.product_info.product_name, price: "€" + (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : element.product_info.price)).toFixed(2), beans_value: (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : element.product_info.beans_value)).toFixed(), is_bold: true })
            if (element.required_modifier_detail != null && element.required_modifier_detail != undefined) {
                price_details.push({ title: element.quantity + "X " + element.required_modifier_detail.modifier_name, price: "€" + (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : element.required_modifier_detail.price)).toFixed(2), beans_value: (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : element.required_modifier_detail.beans_value)).toFixed(), is_bold: false })
            }
            if (element.optional_modifier_detail != null && element.optional_modifier_detail != undefined) {
                // //to calculate over all price
                // total_price += Number(element.optional_modifier_detail.price)
                // total_bean += Number(element.optional_modifier_detail.beans_value || "0")

                // //to caluclate total_price without tax
                // total_price_with_out_tax += Number(element.optional_modifier_detail.price_without_tax || "0")

                // //to calculte indivdual product total
                // product_total += Number(element.optional_modifier_detail.price)

                //  //to calculte indivdual product bean
                //  product_bean += Number(element.optional_modifier_detail.beans_value)

                // //to calculte indivdual product total wo tax
                // product_total_wo_tax += Number(element.optional_modifier_detail.price_without_tax)

                //to display price list
                price_details.push({ title: element.quantity + "X " + element.optional_modifier_detail.modifier_name, price: "€" + (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : element.optional_modifier_detail.price)).toFixed(2), beans_value: (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : element.optional_modifier_detail.beans_value)).toFixed(), is_bold: false })
            }
            else {

            }
        }
        else {
            for (let index = 0; index < grinds_list.length; index++) {
                const item = grinds_list[index];
                if (item._id.toLowerCase() == element.grains.toLowerCase().replace(' ', '_')) {
                    selected_graind = item
                    break
                }
            }
            //to calculate over all price
            product_total += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.price) + (Number(selected_graind ? element.is_claim_wallet ? 0 : selected_graind.price : null)))
            product_total_wo_tax = product_total

            //to calculate over all bean
            product_bean += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.beans_value) + (Number(selected_graind ? element.is_claim_wallet ? 0 : selected_graind.beans_value : null)))

            //to calculte indivdual product total
            total_price += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.price) + (Number(selected_graind ? element.is_claim_wallet ? 0 : selected_graind.price : 0)))
            total_bean += Number(element.quantity) * (Number(element.is_claim_wallet ? 0 : element.product_info.beans_value) + (Number(selected_graind ? element.is_claim_wallet ? 0 : selected_graind.beans_value : 0)))
            total_price_with_out_tax = total_price
            //to display price list
            price_details.push({ title: element.quantity + "X " + element.product_info.product_name, price: "€" + (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : element.product_info.price)).toFixed(2), beans_value: (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : element.product_info.beans_value)).toFixed(), is_bold: true })
            if (selected_graind) {
                price_details.push({ title: element.quantity + "X " + selected_graind.grind_name, price: "€" + (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : selected_graind.price)).toFixed(2), beans_value: (Number(element.quantity) * Number(element.is_claim_wallet ? 0 : selected_graind.beans_value)).toFixed(), is_bold: false })
            }
        }
        if (element.event_info != null && element.event_info != undefined) {
            let reward_type = element.event_info.reward_mode
            // console.log(reward_type,"check123")
            if (reward_type == "discount") {
                let fraction = 100 / Number(element.event_info.amount || 0)
                total_price = (total_price - (product_total / fraction)) // here total value gonna increase so remove the actual total from  total_price and add new one
                total_price_with_out_tax = (total_price_with_out_tax + (product_total_wo_tax / fraction)) // as mentioned above -- for total price
                let reward = product_total / fraction

                product_total = product_total - product_total / fraction
                product_total_wo_tax = product_total_wo_tax - product_total_wo_tax / fraction
                bean_to_earn += (product_total * 10)
                price_details.push({ title: "Applied -- " + element.event_info.reward_mode_string + " for " + element.event_info.event_name, price: "€" + reward, beans_value: "€" + Number(product_total).toFixed(2), is_bold: false })
            }
            else {
                // console.log("product_bean",product_bean,"tit_bean",bean_to_earn,product_bean * 2)
                bean_to_earn += ((product_total * 10) *  Number(element.event_info.amount || 0)) // here bean value gonna increase so remove the actual bean from total bean and add new one
                console.log("product_bean",bean_to_earn)
                price_details.push({ title: "Applied -- " + element.event_info.reward_mode_string + " for " + element.event_info.event_name, price: "", beans_value: "", is_bold: false })
            }
        }
        else {
            bean_to_earn += (product_total * 10)
        }
        cartList[index].product_total = "€" + product_total.toFixed(2)
        cartList[index].product_bean = product_bean.toFixed(0)
        cartList[index].product_total_wo_tax = "€" + product_total_wo_tax.toFixed(2)
        cartList[index].grinds_price = selected_graind ? selected_graind.price : 0
        cartList[index].grinds_beans = selected_graind ? selected_graind.beans_value : 0
        cartList[index].grinds_name = selected_graind ? selected_graind.grind_name : 0
        // cartList[index].modifiers_list = element.product_info.setup_selected == "modifiers" ? element.optional_modifiers ? [element.required_modifier_detail ? element.required_modifier_detail.modifier_name : "", element.optional_modifier_detail ? element.optional_modifier_detail.modifier_name : ""].join(',') : element.required_modifier_detail ? [element.required_modifier_detail.modifier_name].join(',') : "" : selected_graind ? [selected_graind.grind_name].join(',') : ""
        // console.log(element.required_modifier_detail ,element.required_modifier_detail)
        if (element.product_info.setup_selected == "modifiers") {
            if (element.optional_modifiers != null && element.optional_modifiers != "" && element.required_modifier_detail != null && element.required_modifier_detail != "") {
                cartList[index].modifiers_list = [element.required_modifier_detail.modifier_name, element.optional_modifier_detail.modifier_name].join(',')
            }
            else {
                if (element.required_modifier_detail != null && element.required_modifier_detail != "") {
                    cartList[index].modifiers_list = [element.required_modifier_detail.modifier_name].join(",")
                }
                if (element.optional_modifier_detail != null && element.optional_modifier_detail != "") {
                    cartList[index].modifiers_list = [element.optional_modifier_detail.modifier_name].join(",")
                }
            }
        }
        else {
            cartList[index].modifiers_list = selected_graind ? [selected_graind.grind_name].join(',') : ""
        }
        if (cartList[index].event_id != null && cartList[index].event_id != "") {
            let eventName = "(" + cartList[index].event_info.event_name + ")"
            cartList[index].modifiers_list = cartList[index].modifiers_list ? cartList[index].modifiers_list.concat(eventName) : eventName
        }
        if (cartList[index].wallet_id != null && cartList[index].wallet_id != "") {
            cartList[index].modifiers_list = cartList[index].modifiers_list ? cartList[index].modifiers_list : "" + "(Wallet Gift)"
        }
    }
    return { cartList, price_details, total_price, total_price_with_out_tax, total_bean, total_price_to_pay: total_price * 100, bean_to_earn }
}
module.exports.deleteCart = async function (req, res, _) {
    let user = await UserModel.findOne({ where: { _id: req.body.user_id, is_deleted: false } })
    if (user) {
        var cart_info = await MyCartModel.findAll({ where: { user_id: req.body.user_id, product_id: req.body.product_id, is_deleted: false } })
        if (cart_info.length > 0) {
            if (req.body.is_wallet) {
                await MyCartModel.destroy({ where: { user_id: req.body.user_id, product_id: req.body.product_id, required_modifiers: req.body.required_modifier || null, optional_modifiers: req.body.optional_modifier || null, grains: req.body.grind || null, wallet_id: req.body.wallet_id || null, is_deleted: false } })
            }
            else {
                await MyCartModel.destroy({ where: { user_id: req.body.user_id, product_id: req.body.product_id, is_deleted: false } })
            }
            let CartCount = await MyCartModel.count({ where: { user_id: req.body.user_id || "", is_deleted: false } })
            return res.api(200, 'Removed from cart', { cart_count: CartCount }, true)
        }
        else {
            return res.api(200, 'No matching entry found', null, true)
        }
    }
    else {
        return res.api(200, 'No user Found, Could not delete from cart!', null, true)
    }
}
module.exports.cancellOrder = async function (req, res, _) { // refund
    let order = await UserOrdersModel.findOne({ where: { _id: req.body.order_id } })
    let user = await UserModel.findOne({ where: { _id: req.body.user_id } })
    if (req.body.type == "wallet") {
        UserOrdersModel.update({ checkout_method: "wallet" }, { where: { _id: req.body.order_id } })
        let cart_count = await MyCartModel.count({ where: { user_id: req.body.user_id || "", is_deleted: false } })
        let collect_count = await UserOrdersModel.count({ where: { user_id: req.body.user_id || "", order_status: "pending", checkout_method: "collect" } })
        return res.api(200, 'Order stored in wallet', { cart_count, collect_count }, true)
    }
    else {
        UserOrdersModel.update({ order_status: "cancelled" }, { where: { _id: req.body.order_id } })
        AppliedBeans.destroy({ where: { order_id: req.body.order_id } })
        let cart_count = await MyCartModel.count({ where: { user_id: req.body.user_id || "", is_deleted: false } })
        let collect_count = await UserOrdersModel.count({ where: { user_id: req.body.user_id || "", order_status: "pending", checkout_method: "collect" } })
        if (order.proceedToPayOnline) {
            let beansEarnerd = Number(user.beansEarnerd) - Number(order.bean_generated)
            await UserModel.update({ beansEarnerd: beansEarnerd <= 0 ? 0 : beansEarnerd }, { where: { _id: req.body.user_id } })
            return res.api(200, 'Order cancelled successfully', { cart_count, collect_count }, true)
        }
        else{
            return res.api(200, 'Order cancelled successfully', { cart_count, collect_count }, true)
        }
    }

}
module.exports.placeOrder = async function (req, res, _) {
    let user = await UserModel.findOne({ where: { _id: req.body.user_id, is_deleted: false } })
    if (user) {
        var cart_info = await MyCartModel.findAll({
            where: { user_id: req.body.user_id, is_deleted: false }, include: [
                { model: UserModel, as: "user_info" },
                {
                    model: UserProducts, as: "product_info", 
                    include: [{ model: IVAModel, as: "iva_info" }]
                    // { model: ModifiersModel, as: "required_modifier_list" },
                    // { model: ModifiersModel, as: "optional_modifier_list" }]
                },
                { model: ModifiersModel, as: "required_modifier_detail" },
                { model: ModifiersModel, as: "optional_modifier_detail" },
                { model: SyraEvents, as: "event_info" },
            ]
        })
        var orderCount = await UserOrdersModel.count({ where: { user_id: req.body.user_id || "", order_status: "pending", checkout_method: "collect" } })

        if (cart_info.length > 0) { // replace the condition with "cart_info.length > 0 && orderCount == 0" once fixed
            let reqObject = generateRequest(req.body, JSON.parse(JSON.stringify(cart_info)), user.beansEarnerd)
            console.log(reqObject,"tests")
            let order = await UserOrdersModel.create(reqObject)
            if (order) {
                for (let index = 0; index < cart_info.length; index++) {
                    const element = cart_info[index];

                    if (element.wallet_id != null && element.wallet_id != "" && element.wallet_id != undefined) {
                        console.log(Number(element.wallet_count) , Number(element.quantity),Number(element.wallet_count) < Number(element.quantity))
                        if(Number(element.wallet_count) > Number(element.quantity)){
                            await UserorderedProducts.update({quantity : Number(element.wallet_count) - Number(element.quantity) },{where : {
                                UserProductId: element.product_id, order_id: element.wallet_id, required_modifier_id: element.required_modifiers, optional_modifier_id: element.optional_modifiers, grind_id: element.grains  
                            }})
                            let order_data = (await UserOrdersModel.findOne({ where: { _id: element.wallet_id } })).order_data
                            var item_index = order_data.findIndex(i => ((i.product_id == element.product_id) && (i.required_modifiers == element.required_modifiers) && (i.optional_modifiers == element.optional_modifiers) && (i.grains == element.grains)));
                            order_data[item_index].quantity = Number(element.wallet_count) - Number(element.quantity)
                            await UserOrdersModel.update({order_data : JSON.stringify(order_data)},{ where: { _id: element.wallet_id } })
                        }
                        else{
                            await UserorderedProducts.destroy({ where: { UserProductId: element.product_id, order_id: element.wallet_id, required_modifier_id: element.required_modifiers, optional_modifier_id: element.optional_modifiers, grind_id: element.grains } })
                            let order_data = (await UserOrdersModel.findOne({ where: { _id: element.wallet_id } })).order_data
                            var item_index = order_data.findIndex(i => ((i.product_id == element.product_id) && (i.required_modifiers == element.required_modifiers) && (i.optional_modifiers == element.optional_modifiers) && (i.grains == element.grains)));
                            order_data.splice(item_index, 1)
                            await UserOrdersModel.update({order_data : JSON.stringify(order_data)},{ where: { _id: element.wallet_id } })
                        }
                    }

                    await UserorderedProducts.create({
                        date_of_order: order.date_of_order,
                        order_id: order._id,
                        UserProductId: element.product_id,
                        category_id: element.product_info.category,
                        required_modifier_id: element.required_modifiers,
                        required_modifier_iva: element.required_modifier_detail ? element.required_modifier_detail.iva : null,
                        optional_modifier_id: element.optional_modifiers,
                        optional_modifier_iva: element.optional_modifiers ? element.optional_modifier_detail.iva : null,
                        grind_id: element.grains,
                        user_id: element.user_id,
                        store_id: order.store_id,
                        quantity: element.quantity,
                        product_iva: element.product_info.iva,
                        total_price: order.total_price,
                        Payment_method: order.Payment_method,
                        total_price_with_out_tax: order.total_price_with_out_tax,
                    })
                }

                if (reqObject.is_beans_applied == true) {
                    let bean_spent = Number(user.beansSpent) + Number(order.bean_applied)
                    let amount_user_paid = Number(order.total_price_to_pay)
                    let beans_earned = (Number(user.beansEarnerd) - Number(order.bean_applied)) <= 0 ? (amount_user_paid > 0 ? Number(order.bean_generated) : 0) : (amount_user_paid > 0 ? (Number(user.beansEarnerd) - Number(order.bean_applied)) + Number(order.bean_generated) : Number(user.beansEarnerd) - Number(order.bean_applied))

                    await UserModel.update({ beansSpent: bean_spent, beansEarnerd: beans_earned <= 0 ? 0 : beans_earned.toFixed(0) }, { where: { _id: user._id } })
                    AppliedBeans.create({
                        order_id: order._id,
                        beans_used: order.bean_applied,
                        beans_genrated: order.bean_generated.toFixed(0)
                    })
                }
                else {
                    let beans_earned = (Number(user.beansEarnerd) <= 0 ? 0 : Number(user.beansEarnerd)) + Number(order.bean_generated)
                    await UserModel.update({ beansEarnerd: beans_earned.toFixed(0) }, { where: { _id: user._id } })
                }
                MyCartModel.destroy({ where: { user_id: user._id } })
                let orderInfo = await UserOrdersModel.findOne({
                    where: { _id: order._id }, include: [
                        { model: BrancheModel, as: "branch_info" },
                    ]
                })
                return res.api(200, 'order placed successfully', { orderInfo }, true)

            }
            else {
                return res.api(200, 'Could not place order', null, false)
            }
        }
        else {
            return res.api(200, orderCount > 0 ? 'Please Collect your order before placing new order!' : 'No products in cart', null, false)
        }
    }
    else {
        return res.api(200, 'No user Found, Could not add to cart!', null, false)
    }
}

module.exports.getOrder = async function (req, res, _) {
    if(req.body.device_id != null && req.body.device_id != undefined && req.body.device_id != ""){
        let branch = await BrancheModel.findOne({where : {device_id : req.body.device_id}})
        if(branch){
            let orderInfo = await UserOrdersModel.findOne({
                where: { _id:  req.body.order_id}, include: [
                    {model: BrancheModel, as: "branch_info"},
                    {model: UserModel, as: "user_info"},
                ]
            })
            console.log(req.body)
            return res.api(200, 'order details', { orderInfo }, true)

            //uncommet if you want to restrict location
            // if(orderInfo.branch_info._id == branch._id){
            //     return res.api(200, 'order details', { orderInfo }, true)
            // }
            // else{
            //     return res.api(200, 'please collect your order from '+ orderInfo.branch_info.branch_name, {}, false)
            // }
        }
        else{
            return res.api(200, 'IPAD not registered with any branch!', { }, false)
        }       
    }
    else{
        let user = await UserModel.findOne({ where: { _id: req.body.user_id, is_deleted: false } })
        if (user) {
            let orderInfo = await UserOrdersModel.findOne({
                where: { user_id: req.body.user_id || "", order_status: "pending", checkout_method: "collect" }, include: [
                    { model: BrancheModel, as: "branch_info" },
                    { model: UserModel, as: "user_info"},
                ]
            })
            return res.api(200, 'order details', { orderInfo }, true)
        }
        else {
            return res.api(200, 'No user Found, Could not get orders!', null, false)
        }
    }
}

module.exports.getWallet = async function (req, res, _) {
    let user = await UserModel.findOne({ where: { _id: req.body.user_id, is_deleted: false } })

    if (user) {
        let orderInfo = await UserorderedProducts.findAll({
            where: { user_id: req.body.user_id }, include: [
                { model: UserOrdersModel, as: "order_info", where: { checkout_method: "wallet" } },
                {
                    model: UserProducts, as: "product_info", include: [
                        { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false} ,through: { attributes: [] },required : false },
                        { model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false} ,through: { attributes: [] },required : false },
                        {
                            model: MyCartModel, as: "cart_info", where: { "user_id": req.body.user_id, "is_claim_wallet": true }, required: false, include: [
                                { model: ModifiersModel, as: "required_modifier_detail" },
                                { model: ModifiersModel, as: "optional_modifier_detail" },
                            ]
                        }
                    ]
                },
            ]
        })

        let wallet = JSON.parse(JSON.stringify(orderInfo.map(function (data) {
            return data.product_info
        }).sort(function (a, b) {
            var keyA = a.product_name,
                keyB = b.product_name;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        })))
        let orderArraySorted = orderInfo.sort(function (a, b) {
            var keyA = a.product_info.product_name,
                keyB = b.product_info.product_name;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        })
        //get product_wise cart_info without replication
        let cart_info = orderArraySorted.map(function (data, index) {
            var inde_pdt = data.order_info.order_data.findIndex(i => i.product_id == wallet[index]._id && i.required_modifiers == orderArraySorted[index].required_modifier_id && i.optional_modifiers == orderArraySorted[index].optional_modifier_id && i.grains == orderArraySorted[index].grind_id);
            return data.order_info.order_data[inde_pdt]
        })

        //filterout all null values 

        cart_info = [].concat(...cart_info.filter(function (data) {
            return data != null
        }))
        for (let index = 0; index < cart_info.length; index++) {
            element = cart_info[index]
            let ordered_products = []
            let required_modifier_info = null
            let optional_modifier_info = null
            let grind_info = null

            ordered_products.push(element.quantity + "X " + element.product_info.product_name)

            if (element.product_info.setup_selected == "modifiers") {
                if (element.required_modifier_detail) {
                    ordered_products.push(element.quantity  + "X " + element.required_modifier_detail.modifier_name)
                    required_modifier_info = { _id: element.required_modifier_detail._id, price: element.required_modifier_detail.price, beans_value: element.required_modifier_detail.beans_value }
                }

                if (element.optional_modifier_detail != null) {
                    optional_modifier_info = { _id: element.optional_modifier_detail._id, price: element.optional_modifier_detail.price, beans_value: element.optional_modifier_detail.beans_value }
                    ordered_products.push(element.quantity  + "X " + element.optional_modifier_detail.modifier_name)
                }
            }
            else {
                if (orderInfo[index].grind_id) {
                    grind_info = { _id: orderInfo[index].grind_id, price: "0.0", beans_value: "0.0" }
                    ordered_products.push(element.quantity + "X " + element.grinds_name)
                }
            }
            wallet[index].wallet_id = orderInfo[index].order_info._id
            wallet[index].required_modifier_detail = required_modifier_info
            wallet[index].optional_modifier_detail = optional_modifier_info
            wallet[index].grind_detail = grind_info
            wallet[index].is_gift = false
            wallet[index].order_list = ordered_products
            wallet[index].price = "0.00"
            wallet[index].total_price = "0.00"
            wallet[index].product_total = "€0.00"
            wallet[index].quantity = Number(element.quantity)
            if (wallet[index].cart_info.length > 0) {
                // console.log(wallet[index].cart_info.length,"test")
                // let cart_pdts = wallet[index].cart_info
                for (let index_cart = 0; index_cart < wallet[index].cart_info.length; index_cart++) {
                    // console.log(wallet[index].cart_info[index_cart].grains == (wallet[index].grind_detail ? wallet[index].grind_detail._id : ""), "grind_condtion")
                    // console.log((wallet[index].cart_info[index_cart].optional_modifiers == (wallet[index].optional_modifier_detail ? wallet[index].optional_modifier_detail._id : "")), "optional_condtion")
                    // console.log((wallet[index].cart_info[index_cart].required_modifiers == (wallet[index].required_modifier_detail ? wallet[index].required_modifier_detail._id : "")), "required_condition")
                    // console.log((wallet[index].cart_info[index_cart].wallet_id == wallet[index].wallet_id) , "wallet condtion")
                    // console.log("---------------------------------------", index,index_cart)
                    if (!((wallet[index].cart_info[index_cart].grains == (wallet[index].grind_detail ? wallet[index].grind_detail._id : "")) && (wallet[index].cart_info[index_cart].optional_modifiers == (wallet[index].optional_modifier_detail ? wallet[index].optional_modifier_detail._id : "")) && (wallet[index].cart_info[index_cart].required_modifiers == (wallet[index].required_modifier_detail ? wallet[index].required_modifier_detail._id : "")) && (wallet[index].cart_info[index_cart].wallet_id == wallet[index].wallet_id))) {
                        wallet[index].cart_info.splice(index_cart, 1)
                        index_cart--
                    }
                }
            }
        }
        let cart_count = await MyCartModel.count({ where: { user_id: req.body.user_id || "", is_deleted: false } })

        return res.api(200, 'products', { wallet, cart_count, cart_info }, true)
    }
    else {
        return res.api(200, 'No user Found, Could not get orders!', null, false)
    }
}
function generateRequest(data, cart_data, user_beans) {
    let reqObject = {}
    reqObject.date_of_order = moment().toDate()
    reqObject.user_id = data.user_id
    reqObject.store_id = data.store_id
    reqObject.checkout_method = data.checkout_method
    reqObject.barista_delivers_order = null
    let priceInfo = calculatePrice(cart_data)
    reqObject.order_data = JSON.stringify(priceInfo.cartList)
    reqObject.total_price = priceInfo.total_price
    reqObject.Payment_method = data.use_beans ? "beans" : "card"
    reqObject.products = cart_data.map(function (data) {
        return data.product_id
    }).join(',')
    reqObject.card_id = data.card_id
    reqObject.txn_id = data.txn_id
    reqObject.total_price_with_out_tax = priceInfo.total_price_with_out_tax
    reqObject.total_price_to_pay = priceInfo.total_price_to_pay
    reqObject.proceedToPayOnline = priceInfo.total_price_to_pay > 0
    reqObject.price_data = JSON.stringify(priceInfo.price_details)
    reqObject.is_claiming_gift = data.is_claiming_gift || false
    reqObject.bean_applied = priceInfo.total_bean
    reqObject.bean_generated = priceInfo.bean_to_earn
    reqObject.remaining_to_pay = Number(user_beans) >= priceInfo.total_bean ? 0 : priceInfo.total_bean - Number(user_beans)
    reqObject.order_status = "pending"
    reqObject.is_beans_applied = data.use_beans
    reqObject.tax_amount = priceInfo.total_price - reqObject.total_price_with_out_tax
    return reqObject
}

module.exports.getGifts = async function (req, res, _) {
    const { user_id } = req.body

    let user = await UserModel.findOne({ where: { _id: user_id } })
    let gifts = JSON.parse(JSON.stringify(await UserProducts.findAll({
        where: { is_deleted: false }, include: [
            { model: IVAModel, as: "iva_info" },
            { model: UserCategories, as: "category_details" },
            { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false} ,through: { attributes: [] },required : false },
            { model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false} ,through: { attributes: [] },required : false },
            {
                model: MyCartModel, as: "cart_info", where: { "user_id": req.body.user_id, "is_claiming_gift": true }, required: false, include: [
                    { model: ModifiersModel, as: "required_modifier_detail" },
                    { model: ModifiersModel, as: "optional_modifier_detail" },
                ]
            }
        ]
    })))

    // gifts = gifts.map(v => ({...v, is_locked: Number(v.beans_value) > Number(user.beansEarnerd), beans_to_unlock :  Number(v.beans_value) > Number(user.beansEarnerd) ? (Number(v.beans_value) - Number(user.beansEarnerd)).toFixed() : 0 }))

    let available_gifts = gifts.filter((data) => {
        return Number(data.beans_value) <= Number(user.beansEarnerd)
    }).sort(function (a, b) {
        var keyA = Number(a.beans_value),
            keyB = Number(b.beans_value);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });
    let upcoming_gifts = gifts.filter((data) => {
        return Number(data.beans_value) > Number(user.beansEarnerd)
    }).sort(function (a, b) {
        var keyA = Number(a.beans_value),
            keyB = Number(b.beans_value);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });
    let cart_count = await MyCartModel.count({ where: { user_id: req.body.user_id || "", is_deleted: false } })

    return res.api(200, "Gifts retrived Successfully", { available_gifts, upcoming_gifts, cart_count }, true)
}

////////////////////////////////////////////////////////////////////
// ||||||||| ||||||||| |||||||||
// |       | |       | |
// |       | |       | |
// ||||||||| |       | ||||||||
// |         |       |         |
// |         |       |         | 
// |         |||||||||  ||||||||
///////////////////////////////////////////////////////////////////

//To get user wallet,last ordered and most ordered products!

module.exports.scanUserQR = async function (req, res, _) {
    return res.api(200, "Gifts retrived Successfully", {}, true)
}