const {settingsRepository} = require('./settings-repository')
const commonHelper = require('../helpers/commonHelper');
const {constants} = require('../../Utils/constants')
const util = require('util');
const moment = require('moment');
module.exports.add_setting = async function (req, res, _) {
    const {code, value} = req.body
    settingsRepository.add_settings(code,value).then(setting => {
        res.api(200,"Your preference saved",{setting},true)
    })
}

module.exports.get_settings = async function(req,res,_){
    const {id} = req.body
    settingsRepository.getAllSettings(id).then(settings_list => {
        res.api(200,"settings retrived successfully",{settings_list},true)
    })
}

module.exports.update_Settings = async function(req, res, _){
    const {request_array} = req.body
    let success = true
    request_array.forEach(element => {
        settingsRepository.update_settings(element.id,element.value).then(update_success => {
            success = (update_success[0] > 0) ? true  :  false 
        })
    });
    success ? res.api(200,"setting updated successfully",null,true) : res.api(404,"No setting found",null,false)
}

module.exports.delete_settings = async function(req, res, _){
    const {id} = req.body
    settingsRepository.deleteSettings(id).then(delete_count => {
        delete_count > 0 ? res.api(200,"setting deleted successfully",null,true) :  res.api(404,"No setting found",null,false)
    })
}

module.exports.upload_logo_image = async(req,res, _)=>{
    console.log(req.file,req.files,"jb")
    if(req.files)
    {
        const files = req.files
        const file = files.file
        const fileMove = util.promisify(file.mv)
    
        const path = './functions/assets/logos/'
        const ext = file.name.split('.').pop()
        commonHelper.prepareUploadFolder(path)
        const imageName = 'logo' + moment().unix() + '.' + ext
        try {
            await fileMove(path + imageName)        
            await settingsRepository.update_logo(imageName)
            return res.api(200,"uploaded successfully",{imageName : imageName},true);
        } catch (e) {
            return res.api(422,"cannot upload",null,false);
        }
    }
    else{
        return res.api(422,"No image to upload",null,false);
    }
}

module.exports.get_logo = async(req,res,_) => {
    settingsRepository.get_logo().then((logo) => {
        logo.value = constants.HOST+ "assets/logos/" + logo.value;
        res.api(200,"logo read successfully",{logo},true)
    })
}