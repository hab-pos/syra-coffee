
const { ProductRepository } = require('./products-repository')
const { UserProducts, RequiredModifierProducts, optionalModifierProducts } = require('./products-model');
const commonHelper = require('../../helpers/commonHelper');
const { google } = require('googleapis')
const moment = require('moment');
const fs = require('fs');
const os = require('os');
const _ = require('lodash');
const { ModifiersModel } = require('../ModifiersApp/modifier-model');
const { UserModel, MyCartModel, UserOrdersModel, UserorderedProducts } = require('../../User_App/User-model');
const { SyraEvents } = require('../eventsApp/events-model');
const Sequelize = require('sequelize');
const { StoryModel } = require('../storyApp/story-model');
const { IVAModel } = require('../../SetupApp/setup-model');
const { UserCategories } = require('../Category_app/category-model');
const { constants } = require('../../../Utils/constants');
const Op = Sequelize.Op;

module.exports.addProduct = async function (req, res, _) {
    let request = req.body
    request.order = 0
    request.is_Active = true
    request.is_deleted = false
    console.log(request)
    let result = await ProductRepository.addProduct(request)

    for (let index = 0; index < req.body.required_modifier.split(',').length; index++) {
        const element = req.body.required_modifier != "" ? req.body.required_modifier.split(',')[index] : null;
        let product = await RequiredModifierProducts.findAll({ where: { product_id: result._id, ModifierId: element } })
        if (product.length == 0 && element != null) {
            await RequiredModifierProducts.create({ product_id: result._id, ModifierId: element })
        }
    }

    for (let index = 0; index < req.body.optional_modifier.split(',').length; index++) {
        const element = req.body.optional_modifier != "" ? req.body.optional_modifier.split(',')[index] : null;
        let product = await optionalModifierProducts.findAll({ where: { product_id: result._id, ModifierId: element } })
        if (product.length == 0 && element != null) {
            await optionalModifierProducts.create({ product_id: result._id, ModifierId: element })
        }
    }

    return res.api(200, "product Added Successfully", result, true);
}
module.exports.getProducts = async function (req, res, _) {
    const { id } = req.body
    ProductRepository.getProducts(id).then(modifiers => {
        res.api(200, "products retrived successfully", modifiers, true)
    })
}
module.exports.updateProduct = async function (req, res, _) {
    let category = await ProductRepository.getProducts(req.body._id)
    if (category) {
        await ProductRepository.updateProduct(req.body)
        if (req.body.required_modifier == "") {
            await RequiredModifierProducts.destroy({ where: { product_id: req.body._id } })
        }

        if (req.body.optional_modifier == "") {
            await optionalModifierProducts.destroy({ where: { product_id: req.body._id } })
        }

        if (req.body.required_modifier != null || req.body.required_modifier != null) {
            let Modifier_list = (await ModifiersModel.findAll({ where: { is_deleted: false } })).map(function (item) {
                return item._id
            })

            let unLinkedList_req = commonHelper.diffArray(Modifier_list, req.body.required_modifier.split(','))
            let unLinkedList_opt = commonHelper.diffArray(Modifier_list, req.body.optional_modifier.split(','))
            console.log(unLinkedList_req, "req")
            console.log(unLinkedList_opt, "opt")

            for (let index = 0; (req.body.required_modifier != "" && index < req.body.required_modifier.split(',').length); index++) {
                const element = req.body.required_modifier.split(',')[index];
                let product = await RequiredModifierProducts.findAll({ where: { product_id: req.body._id, ModifierId: element } })
                if (product.length == 0) {
                    await RequiredModifierProducts.create({ product_id: req.body._id, ModifierId: element })
                }
            }
            for (let index = 0; index < unLinkedList_req.length; index++) {
                const element = unLinkedList_req[index];
                await RequiredModifierProducts.destroy({ where: { product_id: req.body._id, ModifierId: element } })
            }

            for (let index = 0; (req.body.optional_modifier != "" && index < req.body.optional_modifier.split(',').length); index++) {
                const element = req.body.optional_modifier.split(',')[index];
                let product = await optionalModifierProducts.findAll({ where: { product_id: req.body._id, ModifierId: element } })
                if (product.length == 0) {
                    await optionalModifierProducts.create({ product_id: req.body._id, ModifierId: element })
                }
            }
            for (let index = 0; index < unLinkedList_opt.length; index++) {
                const element = unLinkedList_opt[index];
                await optionalModifierProducts.destroy({ where: { product_id: req.body._id, ModifierId: element } })
            }

            return res.api(200, "product Updated", category, true)
        }
        else {
            return res.api(200, "product Updated", category, true)
        }
    }
    else {
        return res.api(200, "product Not available", null, false)
    }
}

module.exports.getHomePage = async function (req, res, _) {
    const {user_id} = req.body
    let user = await UserModel.findOne({ where: { _id: req.body.user_id } })
    var response = {}
    if (user) {
        let gifts = JSON.parse(JSON.stringify(await UserProducts.findAll({
            where: { is_deleted: false }, order: [
                ["beans_value", "ASC"],
            ], include: [
                { model: IVAModel, as: "iva_info" },
                { model: UserCategories, as: "category_details" },
                { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false},required : false ,through: { attributes: [] } },
                { model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false},required : false, through: { attributes: [] } },
                {
                    model: MyCartModel, as: "cart_info", where: { "user_id": req.body.user_id, "is_claiming_gift": true }, required: false, include: [
                        { model: ModifiersModel, as: "required_modifier_detail" },
                        { model: ModifiersModel, as: "optional_modifier_detail" },
                    ]
                }
            ]
        })))

        gifts = gifts.map(v => ({ ...v, is_locked: Number(v.beans_value) > Number(user.beansEarnerd), beans_to_unlock: Number(v.beans_value) > Number(user.beansEarnerd) ? (Number(v.beans_value) - Number(user.beansEarnerd)).toFixed() : 0 }))

        gifts = gifts.sort((a, b) => (Number(a.beans_value) > Number(b.beans_value)) ? 1 : -1)

        let events = await SyraEvents.findAll({
            where: {
                is_deleted: false, end_date: {
                    [Op.gte]: moment().toDate()
                }
            }, include: [{
                model: UserProducts, as: "product_info", through: { attributes: [] }, include: [
                    { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false},required : false },
                    { model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false},required : false },
                    {
                        model: MyCartModel, as: "cart_info", where: { "user_id": req.body.user_id }, required: false, include: [
                            { model: ModifiersModel, as: "required_modifier_detail" },
                            { model: ModifiersModel, as: "optional_modifier_detail" },
                        ]
                    }
                ]
            }]
        })
        let stories = JSON.parse(JSON.stringify(await StoryModel.findAll({
            where: { is_deleted: false }, include: [{
                model: UserProducts, as: "product_info", include: [
                    { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false},required : false },
                    { model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false},required : false},
                    {
                        model: MyCartModel, as: "cart_info", where: {
                            "user_id": user_id, "is_claiming_gift": false, "is_claim_wallet": false,
                            [Op.or]:
                                [
                                    { is_reorder: false },
                                    { is_reorder: null }
                                ], event_id: null
                        }, required: false, include: [
                            { model: ModifiersModel, as: "required_modifier_detail" },
                            { model: ModifiersModel, as: "optional_modifier_detail" },
                        ]
                    }
                ]
            }]
        })))

        // to get hidden
        for (let index = 0; index < stories.length; index++) {
            stories[index].product_info = [stories[index].product_info]
        }

        let orderedPdts = await UserorderedProducts.findAll({
            where: { user_id: req.body.user_id ? req.body.user_id : "" }, include: [
                { model: UserOrdersModel, as: "order_info", where: { checkout_method: "collect" } },
                {
                    model: UserProducts, as: "product_info", include: [
                        { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false},required : false, through: { attributes: [] } },
                        { model: ModifiersModel, as: "optional_modifier_list", where : {is_deleted : false},required : false, through: { attributes: [] } },
                        {
                            model: MyCartModel, as: "cart_info", where: { "user_id": req.body.user_id ? req.body.user_id : "", "is_claim_wallet": false, is_reorder: true }, required: false, include: [
                                { model: ModifiersModel, as: "required_modifier_detail" },
                                { model: ModifiersModel, as: "optional_modifier_detail" },
                            ]
                        }
                    ]
                },
            ], order: [
                ["createdAt", "DESC"]
            ],
            group: [
                ["UserProductId"]
            ], limit: 2
        })

        orderedPdts = JSON.parse(JSON.stringify(orderedPdts.map(function (data) {
            return data.product_info
        }).sort(function (a, b) {
            var keyA = a.product_name,
                keyB = b.product_name;
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        })))

        let reorder_list = {
            category_id: "Reorder",
            category_details: {
                category_name: "reorder",
                image_url: constants.HOST + "assets/icons/reorder.png"
            },
            products: orderedPdts,
            type: "reorder",
            count: orderedPdts.length
        }

        // to get hidden
        let CartCount = await MyCartModel.count({ where: { user_id: req.body.user_id || "", is_deleted: false } })
        let collectCount = await UserOrdersModel.count({ where: { user_id: req.body.user_id || "", order_status: "pending", checkout_method: "collect" } })
        response.cart_count = CartCount
        response.collect_count = collectCount
        response.beans_earned = Number(user.beansEarnerd).toFixed(0)
        response.gifts = gifts
        response.events = events
        response.stories = stories
        if (reorder_list.products.length > 0) {
            response.reorder = reorder_list
        }
        
        let featured = await UserProducts.findAll({where : { is_deleted : false, is_featured : true},include: [
            { model: IVAModel, as: "iva_info"},
            {model: UserCategories, as: "category_details"},
            {model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false},required : false},
            {model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false},required : false},
            {model: MyCartModel, as: "cart_info",where : {"user_id" : user_id,"is_claiming_gift" : false,"is_claim_wallet" : false, 
            [Op.or]:
            [
                { is_reorder : false },
                { is_reorder : null }
            ], event_id : null},required : false, include: [
                { model: ModifiersModel, as: "required_modifier_detail" },
                { model: ModifiersModel, as: "optional_modifier_detail" },
            ]}
        ],  order: [
            ["order", "ASC"]
        ] })

        response.featuredProducts = featured
        return res.api(200, "Home called Successfully", response, true)
    }
    else {
        return res.api(200, "No user Found", null, false)
    }
}
module.exports.reorderCategory = async function (req, res, _) {
    for (let index = 0; index < req.body.list.length; index++) {
        req.body.list[index].grinds = JSON.stringify(req.body.list[index].grinds)
        await ProductRepository.updateProduct(req.body.list[index])
    }
    return res.api(200, "Reordered Successfully", null, false)
}
module.exports.updateOnlineStatus = async function (req, res, _) {
    await UserProducts.update({ is_Active: req.body.is_Active }, { where: { _id: req.body._id } })
    return res.api(200, "Status updated Successfully", null, false)
}

module.exports.deleteProduct = async function (req, res, _) {
    const { id } = req.body
    ProductRepository.deleteProduct(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "product deleted successfully", null, true) : res.api(404, "No product found", null, false)
    })
}
Array.prototype.insert = function (index, item) {
    this.splice(index, 0, item);
};
module.exports.get_all_products = async function (req, res, next) {
    const {user_id} = req.body 
    let products = await UserProducts.findAll({where : { is_deleted : false, is_Active : true },include: [
        { model: IVAModel, as: "iva_info"},
        {model: UserCategories, as: "category_details", where : {is_deleted : false, is_Active : true}},
        {model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false, is_Active : true},required : false},
        {model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false, is_Active : true},required : false},
        {model: MyCartModel, as: "cart_info",where : {"user_id" : user_id || "","is_claiming_gift" : false,"is_claim_wallet" : false, 
        [Op.or]:
        [
            { is_reorder : false },
            { is_reorder : null }
        ], event_id : null},required : false, include: [
            { model: ModifiersModel, as: "required_modifier_detail" },
            { model: ModifiersModel, as: "optional_modifier_detail" },
        ]}
    ],  order: [
        ["order", "ASC"]
    ] })

    let CartCount = await MyCartModel.count({ where: { user_id: req.body.user_id ? req.body.user_id : "", is_deleted: false } })
    let grouped = _(products).groupBy("category").map((data, key) => ({
        category_id: key,
        category_details: data[0].category_details,
        products: data.sort(function (a, b) {
            var keyA = Number(a.order),
                keyB = Number(b.order);
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        }),
        type: "product",
    })).sort(function (a, b) {
        var keyA = Number(a.category_details.order),
            keyB = Number(b.category_details.order);
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    });

    grouped = JSON.parse(JSON.stringify(grouped))

    //to get Wallets

    let orderInfo = await UserorderedProducts.findAll({
        where: { user_id: req.body.user_id ? req.body.user_id : "" }, include: [
            { model: UserOrdersModel, as: "order_info", where: { checkout_method: "wallet" } },
            {
                model: UserProducts, as: "product_info", include: [
                    { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false} ,through: { attributes: [] },required : false },
                    { model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false} ,through: { attributes: [] },required : false },
                    {
                        model: MyCartModel, as: "cart_info", where: {
                            "user_id": req.body.user_id ? req.body.user_id : "", "is_claim_wallet": true,
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

        ordered_products.push(element.quantity + "X " + element.product_info.product_name)

        if (element.product_info.setup_selected == "modifiers") {
            if (element.required_modifier_detail) {
                ordered_products.push(element.quantity + "X " + element.required_modifier_detail.modifier_name)
                required_modifier_info = { _id: element.required_modifier_detail._id, price: element.required_modifier_detail.price, beans_value: element.required_modifier_detail.beans_value }
            }
            if (element.optional_modifier_detail != null) {
                optional_modifier_info = { _id: element.optional_modifier_detail._id, price: element.optional_modifier_detail.price, beans_value: element.optional_modifier_detail.beans_value }
                ordered_products.push(element.quantity + "X " + element.optional_modifier_detail.modifier_name)
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
                if (!((wallet[index].cart_info[index_cart].grains == (wallet[index].grind_detail ? wallet[index].grind_detail._id : "")) && (wallet[index].cart_info[index_cart].optional_modifiers == (wallet[index].optional_modifier_detail ? wallet[index].optional_modifier_detail._id : "")) && (wallet[index].cart_info[index_cart].required_modifiers == (wallet[index].required_modifier_detail ? wallet[index].required_modifier_detail._id : "")) && (wallet[index].cart_info[index_cart].wallet_id == wallet[index].wallet_id))) {
                    wallet[index].cart_info.splice(index_cart, 1)
                    index_cart --
                }
            }
        }
    }

    if (wallet.length > 0) {
        grouped.insert(0, {
            category_id: "wallet",
            category_details: {
                category_name: "Wallet",
                image_url: constants.HOST + "assets/icons/wallet.png"
            },
            products: wallet,
            type: "wallet",
            count: wallet.length
        })
    }

    let orderedPdts = await UserorderedProducts.findAll({
        where: { user_id: req.body.user_id ? req.body.user_id : "" }, include: [
            { model: UserOrdersModel, as: "order_info", where: { checkout_method: "collect" } },
            {
                model: UserProducts, as: "product_info", include: [
                    { model: ModifiersModel, as: "required_modifier_list", through: { attributes: [] },where : {is_deleted : false}, required : false },
                    { model: ModifiersModel, as: "optional_modifier_list", through: { attributes: [] },where : {is_deleted : false}, required : false },
                    {
                        model: MyCartModel, as: "cart_info", where: { "user_id": req.body.user_id ? req.body.user_id : "", "is_claim_wallet": false, is_reorder: true }, required: false, include: [
                            { model: ModifiersModel, as: "required_modifier_detail" },
                            { model: ModifiersModel, as: "optional_modifier_detail" },
                        ]
                    }
                ]
            },
        ], order: [
            ["createdAt", "DESC"]
        ],
        group: [
            ["UserProductId"]
        ], limit: 2
    })

    orderedPdts = JSON.parse(JSON.stringify(orderedPdts.map(function (data) {
        return data.product_info
    }).sort(function (a, b) {
        var keyA = a.product_name,
            keyB = b.product_name;
        if (keyA < keyB) return -1;
        if (keyA > keyB) return 1;
        return 0;
    })))

    if (orderedPdts.length > 0) {
        grouped.insert(0, {
            category_id: "reorder",
            category_details: {
                category_name: "Reorder",
                image_url: constants.HOST + "assets/icons/reorder.png"
            },
            products: orderedPdts,
            type: "reorder",
            count: orderedPdts.length
        })
    }


    // grouped.insert(0, {
    //     category_id: "",
    //     category_details: {},
    //     products: [],
    //     type: "reorder",
    //     count: 0
    // })
    res.api(200, "Products retrived successfully", { products_list: grouped, cart_count: CartCount }, true)
}

module.exports.getFeaturedProducts = async function (req, res, _) {
    const { id } = req.body
    ProductRepository.getFeaturedProducts().then(response => {
        return res.api(200, "Featured products retrived successfully", response, false)
    })
}
module.exports.uploadPhoto = async (req, res, _) => {
    console.log(req.files)
    if (req.files) {
        const file = req.files[0]
        const path = os.tmpdir() + '/'
        const ext = file.originalname.split('.').pop()
        commonHelper.prepareUploadFolder(path)
        const imageName = 'Product_' + file.originalname.split('.')[0] + "_" + moment().format("DD MMM YYY HH:mm") + '.' + ext
        try {
            fs.writeFileSync(path + imageName, file.buffer, 'utf8');
            const oAuthClient = new google.auth.OAuth2(
                commonHelper.CLIENT_ID,
                commonHelper.CLIENT_SECRET,
                commonHelper.REDIRECT_URI,
            )

            oAuthClient.setCredentials({ refresh_token: commonHelper.REFRESH_TOKEN })


            const drive = google.drive({
                version: "v3",
                auth: oAuthClient
            })
            let restest = JSON.parse(JSON.stringify(await uploadImageToDrive(imageName, ext, path + imageName, drive)))
            restest.imageName = imageName
            return res.api(200, "Image uploaded", restest, false);
        } catch (e) {
            return res.api(422, "cannot upload", null, false);
        }
    }
    else {
        return res.api(422, "No image to upload", null, false);
    }
}

async function uploadImageToDrive(fileName, mime, image, drive) {
    var folderId = await getFolderId('SHARAFA-PRODUCTS', drive)
    console.log("sucess", image, fileName, mime, folderId)
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: "image/" + mime,
                parents: [folderId]
            },
            media: {
                mimeType: "image/" + mime,
                body: fs.createReadStream(image)
            }
        })
        console.log(response.data)
        return shareImagePublic(response.data.id, drive)
    } catch (error) {
        console.log(error.message, "error")
    }
}

async function shareImagePublic(fileId, drive) {
    try {
        await drive.permissions.create({
            fileId: fileId,
            requestBody: {
                role: 'reader',
                type: 'anyone'
            }
        })

        const result = await drive.files.get({
            fileId: fileId,
            fields: 'webViewLink, webContentLink'
        })
        console.log("res", result.data)
        return result.data
    } catch (error) {
        console.log(error.message)
    }
}

async function getFolderId(withName, drive) {
    let result = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    }).catch(e => console.log("eeee", e));
    let folder = result.data.files.filter(x => x.name === withName);
    return folder.length ? folder[0].id : null;
}