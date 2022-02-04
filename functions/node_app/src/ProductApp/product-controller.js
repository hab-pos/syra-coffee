const { ProductsRepository } = require('./product-repository')
const { setupRepository } = require("../SetupApp/setup-repository")
const { sequelize } = require('../db');
const { productsModel } = require('./product-model');
const {UserModel,UserorderedProducts,UserOrdersModel,MyCartModel} = require('../User_App/User-model')
const {UserProducts} = require("../SHARAFA-USER APP/Products_app/products-model")
const {ModifiersModel} = require("../SHARAFA-USER APP/ModifiersApp/modifier-model")
const moment = require('moment');
var loadsh = require('lodash');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports.add_Product = async function (req, res, _) {
    const { product_name, price, iva, categories, color, available_branches, created_by, price_with_iva } = req.body

    ProductsRepository.isUniqueproduct(product_name).then(response => {
        if (response) {
            res.api(200, "already available", null, false)
        }
        else {
            let orders = []
            let array = available_branches.split(',')
            for (let index = 0; index < array.length; index++) {
                const element = { branch_id: array[index], order: 0 }
                orders.push(element)
            }
            ProductsRepository.addProduct(product_name, price, iva, categories, color, available_branches, created_by, price_with_iva, JSON.stringify(orders)).then(info => {
                res.api(200, "product saved", { info }, true)
            })
        }
    })
}

module.exports.get_products = async function (req, res, _) {
    const { id } = req.body
    ProductsRepository.getProducts(id).then(products => {
        res.api(200, "products retrived successfully", { products }, true)
    })
}
module.exports.update_products = async function (req, res, _) {
    // console.log(req.body)
    ProductsRepository.update_Product(req.body).then(update_success => {
        (update_success[0] > 0) ? res.api(200, "product updated successfully", null, true) : res.api(404, "no product found", null, false)
    })
}

module.exports.delete_products = async function (req, res, _) {
    const { id } = req.body
    ProductsRepository.deleteProduct(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "product deleted successfully", null, true) : res.api(404, "No product found", null, false)

    })
}


module.exports.update_order = async function (req, res, _) {

    const { order, branch_id } = req.body
    iterationCount = 0
    let array = []
    for (let index = 0; index < order.length; index++) {
        const element = order[index];
        let product = await productsModel.findOne({ where: { _id: element.id } })
        let mutable_products = JSON.parse(JSON.stringify(product))
        for (let index_order = 0; index_order < mutable_products.order.length; index_order++) {
            let item = mutable_products.order[index_order]
            if (item.branch_id == branch_id) {
                item.order = element.order
            }
            array.push(item)
        }
        let data = await productsModel.update({ order: JSON.stringify(array) }, {
            where: { "_id": element.id }
        })
        array = []
    }
    res.api(200, "updated successfully", null, true)
}

module.exports.get_all_products = async function (req, res, _) {

    const { device_id, user_reference_number } = req.body
    let products_list = []

    let branch_info = await ProductsRepository.get_branchInfo(device_id)
    // console.log(req.body)
    // // 1. initally created user might not have user_refernce_number so it is possible to say that user not available
    // //    even if the user has registerd successfully
    let user_info = await UserModel.findOne({where : {user_reference_number : user_reference_number != null && user_reference_number != undefined && user_reference_number != "" ? user_reference_number : null}})
    if (branch_info) {
        let categories = await sequelize.query("SELECT * from Categories where FIND_IN_SET('" + branch_info._id + "',available_branches) AND `Categories`.`is_deleted` = false AND `Categories`.`is_Active` = true", { type: sequelize.QueryTypes.SELECT })

        let mutable_category_list = JSON.parse(JSON.stringify(categories))
        for (let index = 0; index < mutable_category_list.length; index++) {
            let order_json = JSON.parse(mutable_category_list[index].order) || []
            order_json.forEach(element => {
                if (element.branch_id == branch_info._id) {
                    mutable_category_list[index].order = element.order
                    // console.log(mutable_category_list[index].category_name, mutable_category_list[index].order)
                }
            });
        }

        let sorted = loadsh.sortBy(mutable_category_list,
            [function (o) { return o.order; }]);

        for (i = 0; i < sorted.length; i++) {
            let item = new Object()
            let element = sorted[i]
            item.category = element
            let prods = await sequelize.query("SELECT Products.*,Products.beanValue as beans_value,IVA.`_id` as iva_id, IVA.`iva_percent` from Products INNER JOIN IVA ON Products.iva = IVA._id where FIND_IN_SET('" + branch_info._id + "',available_branches) AND FIND_IN_SET('" + element._id + "',categories) AND `Products`.`is_deleted` = false  AND `Products`.`is_Active` = true", { type: sequelize.QueryTypes.SELECT })

            let mutable_product_list = JSON.parse(JSON.stringify(prods))
            for (let index = 0; index < mutable_product_list.length; index++) {
                let order_json = JSON.parse(mutable_product_list[index].order) || []
                mutable_product_list[index].beans_value =  mutable_product_list[index].beans_value == null ? (Number(mutable_product_list[index].price) * 100).toFixed(2) : mutable_product_list[index].beans_value 
                order_json.forEach(element => {
                    if (element.branch_id == branch_info._id) {
                        mutable_product_list[index].order = element.order
                        // console.log(mutable_product_list[index].product_name, mutable_product_list[index].order)
                    }
                });
            }

            let sorted_prods = loadsh.sortBy(mutable_product_list,
                [function (o) { return o.order; }]);

            item.products = [sorted_prods]
            products_list.push(item)
        }
        let discount_list = await setupRepository.get_Discounts()
        if(user_info){
            let user_items = Object()
            let user_products = []
            user_items.category = {_id : "user_qr", category_name : "User Wallet",color : "#1c1c1c",created_by : "admin", createdAt : moment(),is_Active : true,is_deleted : false,availableBranches : [],updatedAt : moment()}
            user_items.isUserWallet = true
            user_items.user_info = user_info
            let wallet = await getWalletProducts(user_info)
            let last_ordered = await getLastRecentlyOrderedProduct(user_info,3)
            let most_ordered = await getMostOrderedProduct(user_info,3)
            if(wallet.products.length > 0){user_products.unshift(wallet.products)}
            if(last_ordered.products.length > 0){user_products.unshift(last_ordered.products)}
            if(most_ordered.products.length > 0){user_products.unshift(most_ordered.products)}
            user_items.products = user_products
            products_list.unshift(user_items)
        }
        return res.api(200, "retrived successfully", { products_list: products_list, discount_list: discount_list,user_info }, true)

    }
    else {
        res.api(404, "IPAD Not registered to branch", null, false)
    }
}


async function getLastRecentlyOrderedProduct(user_info,limit){
    let orderedPdts = await UserorderedProducts.findAll({
        where: { user_id: user_info._id }, include: [
            { model: UserOrdersModel, as: "order_info", where: { checkout_method: "collect" } },
            { model: UserProducts, as: "product_info" },
            { model: ModifiersModel, as: "required_modifier_detail" },
            { model: ModifiersModel, as: "optional_modifier_detail" }
        ], order: [
            ["createdAt", "DESC"]
        ],
        group: [
            ["UserProductId"]
        ], limit: limit
    })

    // for (let index = 0; index < orderedPdts.length; index++) {
    //     orderedPdts.product_info.required_modifier_detail = orderedPdts[index].required_modifier_detail
    //     orderedPdts.product_info.optional_modifier_detail = orderedPdts[index].optional_modifier_detail    
    // }
    orderedPdts = JSON.parse(JSON.stringify(orderedPdts.map(function (data) {
        return data.product_info
    }).sort(function (a, b) {
        var keyA = a.product_name,
            keyB = b.product_name;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    })))
    let item = new Object()
    // item.category = {_id : "last_ordered", category_name : "Last ordered:",color : "#1c1c1c",created_by : "admin", createdAt : moment(),is_Active : true,is_deleted : false,availableBranches : [],updatedAt : moment()}
    item.products = orderedPdts.map(v => ({...v, category: "Last ordered:"}))
    return item
}

async function getMostOrderedProduct(user_info,limit){
    // const res = await database.model("order_items").findAll({
    //     attributes: [
    //       "productId",
    //       [sequelize.fn("count", sequelize.col("productId")), "totalOrders"],
    //     ],
    //     group: ["productId"],
    //     include: [{ model: database.model("products") }],
    //     order: [[sequelize.col("totalOrders"), "DESC"]],
    //     limit: limit,
    //   });
    let most_ordered = await UserorderedProducts.findAll({
        where: { user_id: user_info._id }, 
        attributes: [
                "UserProductId",
                [sequelize.fn("count", sequelize.col("UserProductId")), "totalOrders"],
            ],
        include: [
            { model: UserOrdersModel, as: "order_info", where: { checkout_method: "collect" } },
            { model: UserProducts, as: "product_info" }
        ], 
        order: [
            [sequelize.col("totalOrders"), "DESC"]
        ],
        group: [
            ["UserProductId"]
        ], 
        limit: limit
    })

    most_ordered = JSON.parse(JSON.stringify(most_ordered.map(function (data) {
        return data.product_info
    }).sort(function (a, b) {
        var keyA = a.product_name,
            keyB = b.product_name;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    })))
    let item = new Object()
    // item.category = {_id : "most_ordered", category_name : "Most ordered",color : "#1c1c1c",created_by : "admin", createdAt : moment(),is_Active : true,is_deleted : false,availableBranches : [],updatedAt : moment()}
    item.products = most_ordered.map(v => ({...v, category: "Most ordered:"}))
    return item
}

async function getWalletProducts(user_info){
    let orderInfo = await UserorderedProducts.findAll({
        where: { user_id: user_info._id ? user_info._id : "" }, include: [
            { model: UserOrdersModel, as: "order_info", where: { checkout_method: "wallet" } },
            {
                model: UserProducts, as: "product_info", include: [
                    { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false} ,through: { attributes: [] },required : false },
                    { model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false} ,through: { attributes: [] },required : false },
                    {
                        model: MyCartModel, as: "cart_info", where: {
                            "user_id": user_info._id ? user_info._id : "", "is_claim_wallet": true,
                            [Op.or]:
                                [
                                    { is_reorder: false },
                                    { is_reorder: null }
                                ]
                        }, required: false, include: [
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
    // return res.api(200, "Products retrived successfully", { products_list: wallet, cart_count: orderArraySorted }, true)

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

        // ordered_products.push(element.quantity + "X " + element.product_info.product_name)

        if (element.product_info.setup_selected == "modifiers") {
            if (element.required_modifier_detail) {
                ordered_products.push(element.required_modifier_detail.modifier_name)
                required_modifier_info = { _id: element.required_modifier_detail._id, price: element.required_modifier_detail.price, beans_value: element.required_modifier_detail.beans_value }
            }
            if (element.optional_modifier_detail != null) {
                optional_modifier_info = { _id: element.optional_modifier_detail._id, price: element.optional_modifier_detail.price, beans_value: element.optional_modifier_detail.beans_value }
                ordered_products.push(element.optional_modifier_detail.modifier_name)
            }
        }
        else {
            if (orderInfo[index].grind_id) {
                grind_info = { _id: orderInfo[index].grind_id, price: "0.0", beans_value: "0.0" }
                ordered_products.push(element.grinds_name)
            }
        }
        wallet[index].wallet_id = orderInfo[index].order_info._id
        wallet[index].required_modifier_detail = required_modifier_info
        wallet[index].optional_modifier_detail = optional_modifier_info
        wallet[index].grind_detail = grind_info
        wallet[index].wallet_count = Number(element.wallet_count).toFixed()
        wallet[index].required_modifier_id = element.required_modifier_detail != null ? element.required_modifier_detail._id : null
        wallet[index].optional_modifier_id = element.optional_modifier_detail != null ? element.optional_modifier_detail._id : null
        wallet[index].grind_id = orderInfo[index].grind_id
        wallet[index].is_gift = false
        wallet[index].order_list = ordered_products.join(", ")
        wallet[index].price = "0.00"
        wallet[index].total_price = "0.00"
        wallet[index].product_total = "€0.00"
        wallet[index].quantity = Number(element.quantity).toFixed()
        if (wallet[index].cart_info.length > 0) {
            // console.log(wallet[index].cart_info.length,"test")
            // let cart_pdts = wallet[index].cart_info
            for (let index_cart = 0; index_cart < wallet[index].cart_info.length; index_cart++) {
                if (!((wallet[index].cart_info[index_cart].grains == (wallet[index].grind_detail ? wallet[index].grind_detail._id : "")) && (wallet[index].cart_info[index_cart].optional_modifiers == (wallet[index].optional_modifier_detail ? wallet[index].optional_modifier_detail._id : "")) && (wallet[index].cart_info[index_cart].required_modifiers == (wallet[index].required_modifier_detail ? wallet[index].required_modifier_detail._id : "")) && (wallet[index].cart_info[index_cart].wallet_id == wallet[index].wallet_id))) {
                    wallet[index].cart_info.splice(index_cart, 1)
                    index_cart --
                }
            }
        }
    }
    let item = new Object()
    // item.category = {_id : "gift_wallet", category_name : "Gifts Wallet:",color : "#1c1c1c",created_by : "admin", createdAt : moment(),is_Active : true,is_deleted : false,availableBranches : [],updatedAt : moment()}
    item.products = wallet.map(v => ({...v, category: "Gifts Wallet:"}))
    return item
}
module.exports.getBranchProducts = async function (req, res, _) {

    const { branch_id, branch_list } = req.body

    if (branch_list) {
        let array = []
        for (let index = 0; index < branch_list.length; index++) {
            const bid = branch_list[index];

            let products = await sequelize.query("SELECT * from Products where FIND_IN_SET('" + bid + "',available_branches) AND `Products`.`is_deleted` = false ORDER BY `Products`.`order` ASC", { type: sequelize.QueryTypes.SELECT })

            let mutable_product_list = JSON.parse(JSON.stringify(products))
            for (let index = 0; index < mutable_product_list.length; index++) {
                let order_json = JSON.parse(mutable_product_list[index].order) || []
                order_json.forEach(element => {
                    if (branch_list.includes(element.branch_id)) {
                        mutable_product_list[index].order = element.order
                        // console.log(mutable_product_list[index].product_name, mutable_product_list[index].order)
                    }
                });
            }

            let sorted = loadsh.sortBy(mutable_product_list,
                [function (o) { return o.order; }]);

            for (let index = 0; index < sorted.length; index++) {
                const element = sorted[index];
                let index_elem = array.map(function (element) { return element._id; }).indexOf(element._id)
                if (index_elem < 0) {
                    array.push(element)
                }
            }
        }
        res.api(200, "products retrived successfully", { products: array }, true)
    }
    else {
        sequelize.query("SELECT * from Products where FIND_IN_SET('" + branch_id + "',available_branches) AND `Products`.`is_deleted` = false ORDER BY `Products`.`order` ASC", { type: sequelize.QueryTypes.SELECT })
            .then(products => {

                let mutable_product_list = JSON.parse(JSON.stringify(products))
                for (let index = 0; index < mutable_product_list.length; index++) {
                    let order_json = JSON.parse(mutable_product_list[index].order) || []
                    order_json.forEach(element => {
                        if (element.branch_id == branch_id) {
                            mutable_product_list[index].order = element.order
                            // console.log(mutable_product_list[index].product_name, mutable_product_list[index].order)
                        }
                    });
                }

                let sorted = loadsh.sortBy(mutable_product_list,
                    [function (o) { return o.order; }]);

                res.api(200, "products retrived successfully", { products: sorted }, true)
            })
    }
}

module.exports.test_order = async function (req, res, _) {
    let data = await productsModel.findAll({})
    let array = []
    for (let index = 0; index < data.length; index++) {
        const element = data[index];
        for (let index_branch = 0; index_branch < element.available_branches.length; index_branch++) {
            const element_prod = element.available_branches[index_branch];
            let item = { branch_id: element_prod, order: 0 }
            array.push(item)
        }
        // console.log(array, "index", index)
        await productsModel.update({ order: JSON.stringify(array) }, {
            where: {
                "_id": element._id
            }
        })
        array = []
    }

    res.api(200, "category saved", "", true)

}






// ProductsRepository.get_branchInfo(device_id).then(branch => {
//     if (branch) {

//         const branch_id = branch._id
//         console.log("branch_info",branch)
//         sequelize.query("SELECT * from Categories where FIND_IN_SET('" + branch_id + "',available_branches) AND `Categories`.`is_deleted` = false ORDER BY `Categories`.`order` ASC", { type: sequelize.QueryTypes.SELECT })
//             .then(category => {
//                 category.forEach(element => {
//                     let item = new Object()
//                     item.category = element
//                     item.products = []
//                     sequelize.query("SELECT Products.*,IVA.`_id` as iva_id, IVA.`iva_percent` from Products INNER JOIN IVA ON Products.iva = IVA._id where FIND_IN_SET('" + branch_id + "',available_branches) AND FIND_IN_SET('" + element._id + "',categories) AND `Products`.`is_deleted` = false ORDER BY `Products`.`order` ASC", { type: sequelize.QueryTypes.SELECT})
//                         .then(products => {
//                             item.products = products
//                         })
//                         products_list.push(item)
//                 });
//                 setupRepository.get_Discounts().then(discounts => {
//                     return res.api(200, "retrived successfully", { products_list: products_list, discount_list: discounts }, true)
//                 })

//             })
//     }
//     else {
//         res.api(404, "IPAD Not registered to branch", null, false)
//     }
// })
