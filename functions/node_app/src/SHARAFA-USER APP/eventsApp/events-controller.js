
const { EventRepository } = require('./events-repository')
const { EventProducts, SyraEvents } = require('./events-model');
const commonHelper = require('../../helpers/commonHelper');
const { google } = require('googleapis')
const moment = require('moment');
const fs = require('fs');
const os = require('os');
const _ = require('lodash');
const { UserProducts } = require('../Products_app/products-model');
const { MyCartModel } = require('../../User_App/User-model');
const { ModifiersModel } = require('../ModifiersApp/modifier-model');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// {
//     _id,
//     event_name,
//   start_date,
//   end_date,
//   reward_mode,
//   amount,
//   products,
//   thumbnail_name,
//   thumbnail_url,
//   cover_name,
//   cover_url,
//   description,
//   order,
//   is_deleted,
//   }
module.exports.addEvent = async function (req, res, _) {
    let request = req.body
    request.order = 0
    request.is_deleted = false
    console.log(request)
    let result = await EventRepository.addEvent(request)

    for (let index = 0; index < req.body.products.split(',').length; index++) {
        const element = req.body.products.split(',')[index];
        let event = await EventProducts.findAll({ where: { SyraEventId: result._id, UserProductId: element } })
        if (event.length == 0) {
            await EventProducts.create({ SyraEventId: result._id, UserProductId: element })
        }
    }
    return res.api(200, "Event Added Successfully", result, true);
}
module.exports.getEvents = async function (req, res, _) {
    const { id } = req.body
    EventRepository.getEvent(id).then(events => {
        res.api(200, "Events retrived successfully", events, true)
    })
}
module.exports.getUserEvent = async function (req, res, _) {
    const { id, user_id } = req.body
    console.log(req.body)
    let cart_count = JSON.parse(JSON.stringify(await MyCartModel.count({ where: { user_id: req.body.user_id || "", is_deleted: false } }))).toFixed(0)

    let event = await SyraEvents.findOne({
        where: { _id: id }, include: [{
            model: UserProducts, as: "product_info", through: { attributes: [] }, include: [
                { model: ModifiersModel, as: "required_modifier_list",where : {is_deleted : false},required : false },
                { model: ModifiersModel, as: "optional_modifier_list",where : {is_deleted : false},required : false },
                {
                    model: MyCartModel, as: "cart_info", where: {
                        "user_id": user_id, "is_claiming_gift": false, "is_claim_wallet": false, [Op.or]:
                            [
                                { is_reorder: false },
                                { is_reorder: null }
                            ],
                        [Op.not]:
                            [
                                { event_id: "" },
                                { event_id: null }
                            ]
                    }, required: false, include: [
                        { model: ModifiersModel, as: "required_modifier_detail" },
                        { model: ModifiersModel, as: "optional_modifier_detail" },
                    ]
                }
            ]
        }]
    })

    for (let index = 0; index < event.product_info.length && event.reward_mode == "discount"; index++) {
        let price = Number(event.product_info[index].price)
        let discountedPrice = price - (price * Number(event.amount) / 100)
        console.log("tes",discountedPrice)
        event.product_info[index].price = discountedPrice
    }
    res.api(200, "Events retrived successfully", { event, cart_count }, true)
}
module.exports.updateEvent = async function (req, res, _) {
    let eventDetails = await EventRepository.getEvent(req.body._id)
    let product_list = (await UserProducts.findAll({ where: { is_deleted: false } })).map(function (data) {
        return data._id
    })
    let unLinkedList = commonHelper.diffArray(product_list, req.body.products.split(','))
    // console.log("unlinked\n", unLinkedList,"\nlist\n",product_list,"\nparam\n",req.body.products.split(','))
    if (eventDetails) {
        await EventRepository.updateEvent(req.body)
        console.log(req.body.products.split(','))
        if (req.body.products) {
            for (let index = 0; index < req.body.products.split(',').length; index++) {
                const element = req.body.products.split(',')[index];
                let event = await EventProducts.findAll({ where: { SyraEventId: req.body._id, UserProductId: element } })
                console.log(event.length == 0)
                if (event.length == 0) {
                    try {
                        await EventProducts.create({ SyraEventId: req.body._id, UserProductId: element })
                    } catch (error) {
                        console.log(error)
                    }
                }
            }
            for (let index = 0; index < unLinkedList.length; index++) {
                const element = unLinkedList[index];
                await EventProducts.destroy({ where: { SyraEventId: req.body._id, UserProductId: element } })
            }
            return res.api(200, "Event details Updated", eventDetails, true)
        }
        else {
            return res.api(200, "Event details Updated", eventDetails, true)
        }
    }
    else {
        return res.api(200, "Event Not available", null, false)
    }
}
module.exports.reorderEvent = async function (req, res, _) {
    for (let index = 0; index < req.body.list.length; index++) {
        await EventRepository.updateProduct(req.body.list[index])
    }
    return res.api(200, "Reordered Successfully", null, false)
}
module.exports.deleteEvent = async function (req, res, _) {
    const { id } = req.body
    EventRepository.deleteEvent(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "Event deleted successfully", null, true) : res.api(404, "No product found", null, false)
    })
}
module.exports.uploadPhoto = async (req, res, _) => {
    let type = req.body.type || "events"
    console.log(req.files)
    if (req.files) {
        const file = req.files[0]
        const path = os.tmpdir() + '/'
        const ext = file.originalname.split('.').pop()
        commonHelper.prepareUploadFolder(path)
        const imageName = type + '_' + file.originalname.split('.')[0] + "_" + moment().format("DD MMM YYY HH:mm") + '.' + ext
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
            let restest = JSON.parse(JSON.stringify(await uploadImageToDrive(imageName, ext, path + imageName, drive, type)))
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
    var folderId = await getFolderId('EVENTS', drive)
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