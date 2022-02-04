
const { categoryRepository } = require('./category-repository')
const commonHelper = require('../../helpers/commonHelper');
const { google } = require('googleapis')
const moment = require('moment');
const fs = require('fs');
const os =  require('os');
const { UserCategories } = require('./category-model');
module.exports.add_Category = async function (req, res, _) {
    const {category_name,image_name,image_url} = req.body
    let result = await  categoryRepository.addcategory(category_name,image_name,image_url,true,0)
    return res.api(200,"Category Added Successfully",result,true);
}

module.exports.uploadPhoto = async (req, res, _) => {
    console.log(req.files)
    if(req.files)
    {
        // const files = req.files[0]
        const file = req.files[0]   
        const path = os.tmpdir() + '/'
        const ext = file.originalname.split('.').pop()
        commonHelper.prepareUploadFolder(path)
        const imageName = 'Category_'+ file.originalname.split('.')[0] + "_" + moment().format("DD MMM YYY HH:mm") + '.' + ext
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
            let restest = JSON.parse(JSON.stringify(await uploadImageToDrive(imageName,ext,path + imageName,drive)))
            restest.imageName = imageName
            return res.api(200,"Image uploaded",restest,false);
        } catch (e) {
            return res.api(422,"cannot upload",e,false);
        }
    }
    else{
        return res.api(422,"No image to upload",null,false);
    }
}

module.exports.get_category = async function (req, res, _) {
    const { id } = req.body
    categoryRepository.getCateogories(id).then(category => {
        res.api(200, "categories retrived successfully", { category }, true)
    })
}
module.exports.update_category = async function (req, res, _) {
    console.log("data",req.body)
    let category =  await categoryRepository.getCateogories(req.body._id)
    if(category){
        let result = await categoryRepository.update_categories(req.body)
        return res.api(200, "Category Updated", result, true)
    }
    else{
        return res.api(200, "Category Not available", null, false)
    }
}

module.exports.reorderCategory = async function (req, res, _) {
    for (let index = 0; index < req.body.list.length; index++) {
        await categoryRepository.update_categories(req.body.list[index])
    }
    return res.api(200, "Reordered Successfully", null, false)
}

module.exports.updateOnlineStatus = async function (req, res, _) {
    await UserCategories.update({is_Active : req.body.is_Active},{where : {_id : req.body._id}})
    return res.api(200, "Status updated Successfully", null, false)
}

module.exports.uploadImage = async function (req, res, _) {

    const { category_name,order,id,is_Active } = req.body
    let category =  await categoryRepository.getCateogories(id)
    if(category){
        let result
        if(category_name){
            result = await categoryRepository.update_categories({category_name : category_name,id : id})
        }
        else if(is_Active){
            result = await categoryRepository.update_categories({ is_Active : is_Active,id : id})
        }
        else{
            result = await categoryRepository.update_categories({ order : order,id : id})
        }
        
        return res.api(200, "Category Added", result, true)
    }
    else{
        return res.api(200, "Category Not available", null, false)
    }
}

module.exports.delete_category = async function (req, res, _) {
    const { id } = req.body
    categoryRepository.deleteCategories(id).then(delete_count => {
        delete_count > 0 ? res.api(200, "category deleted successfully", null, true) : res.api(404, "No category found", null, false)
    })
}


async function uploadImageToDrive(fileName,mime,image,drive) {
    var folderId = await getFolderId('SharafaCategories',drive)
    console.log("sucess",image,fileName,mime,folderId)
    try {
        const response = await drive.files.create({
            requestBody: {
                name: fileName,
                mimeType: "image/"+mime,
                parents: [folderId]
            },
            media: {
                mimeType: "image/"+mime,
                body: fs.createReadStream(image)
            }
        })
        console.log(response.data)
        return shareImagePublic(response.data.id,drive)
    } catch (error) {
        console.log(error.message,"error")
    }
}

async function shareImagePublic(fileId,drive) {
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
        console.log("res",result.data)
        return result.data
    } catch (error) {
        console.log(error.message)
    }
}

async function getFolderId(withName,drive) {
    let result = await drive.files.list({
        q: "mimeType='application/vnd.google-apps.folder' and trashed=false",
        fields: 'nextPageToken, files(id, name)',
        spaces: 'drive',
    }).catch(e => console.log("eeee", e));
    let folder = result.data.files.filter(x => x.name === withName);
    return folder.length ? folder[0].id : null;
}