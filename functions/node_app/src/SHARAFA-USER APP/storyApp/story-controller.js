
const { StoryReporstory } = require('./story-repository')
const commonHelper = require('../../helpers/commonHelper');
const { google } = require('googleapis')
const moment = require('moment');
const fs = require('fs');
const os = require('os');
const _ = require('lodash');
const { StoryModelProduct } = require('./story-model');
const { UserProducts } = require('../Products_app/products-model');
module.exports.addStory = async function (req, res, _) {
    let request = req.body
    request.order = 0
    request.is_deleted = false
    let result = await StoryReporstory.addStory(request)
    // if(result){
    //     for (let index = 0; index < req.body.products.split(',').length; index++) {
    //         const element = req.body.products.split(',')[index];
    //         let story = await StoryModelProduct.findAll({where : { StoryModelId : result._id, UserProductId : element }})
    //         if(story.length == 0){
    //             await StoryModelProduct.create({StoryModelId : result._id, UserProductId : element})
    //         }
    //     }
    // }
    return res.api(200, "Story added Successfully", result, true);
}
module.exports.getStories = async function (req, res, _) {
    const { id } = req.body
    StoryReporstory.getStory(id).then(stories => {
        res.api(200, "Stories retrived successfully", stories, true)
    })
}
module.exports.updateSotry = async function (req, res, _) {
    let story = await StoryReporstory.getStory(req.body._id)
    // let product_list = (await UserProducts.findAll({where : {is_deleted : false}})).map(function(data){
    //     return data._id
    // })
    // let unLinkedList = commonHelper.diffArray(product_list,req.body.products.split(','))
    if (story) {
        await StoryReporstory.updateStory(req.body)
        // if(req.body.products){
        //     for (let index = 0; index < req.body.products.split(',').length; index++) {
        //         const element = req.body.products.split(',')[index];
        //         let story = await StoryModelProduct.findAll({where : { StoryModelId : req.body._id, UserProductId : element }})
        //         if(story.length == 0){
        //             await StoryModelProduct.create({StoryModelId : req.body._id, UserProductId : element})
        //         }
        //     }
        //     for (let index = 0; index < unLinkedList.length; index++) {
        //         const element = unLinkedList[index];
        //         await StoryModelProduct.destroy({where :{StoryModelId : req.body._id, UserProductId : element}})
        //     }
            return res.api(200, "Story updated", story, true)
        // }        
    }
    else {
        return res.api(200, "Story Not available", null, false)
    }
}
module.exports.reorderStories = async function (req, res, _) {
    for (let index = 0; index < req.body.list.length; index++) {
        await StoryReporstory.updateStory(req.body.list[index])
    }
    return res.api(200, "Reordered Successfully", null, false)
}

module.exports.deleteStory = async function (req, res, _) {
    const { id } = req.body
    StoryReporstory.deleteStory(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "product deleted successfully", null, true) : res.api(404, "No product found", null, false)
    })
}
module.exports.uploadPhoto = async (req, res, _) => {
    console.log(req.files)
    if (req.files) {
        const file = req.files[0]
        const path = os.tmpdir() + '/'
        const ext = file.originalname.split('.').pop()
        commonHelper.prepareUploadFolder(path)
        const imageName = 'story_' + file.originalname.split('.')[0] + "_" + moment().format("DD MMM YYY HH:mm") + '.' + ext
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
    var folderId = await getFolderId('STORIES', drive)
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