const { adminRepository } = require('./Admin-repository')
const { encryptPassword, comparePassword } = require('../../Utils/Common/crypto')
const {admin_logged_in} = require('./Admin-emitter')
const { hash } = require('jimp')
const { SettingsModel } = require('../Settings-app/Settings-model')

module.exports.add_admin = async function (req, res, _) {
    const { password, user_name, email_id, admin_recipt_message } = req.body
    await encryptPassword(password, function (err, hash) {
        if (err) {
            return res.api(500, "Internel server Error!,Could not generate password hash", null, false)
        }
        adminRepository.addAdmin(user_name, email_id, admin_recipt_message, hash)
            .then(get_admin_message => {
                return res.api(200, 'Admin created successfullty', { get_admin_message }, true)
            })
    })
}

module.exports.admin_login = async function (req, res, _) {
    console.log(req.body);
    const { email_id, password } = req.body
    var result = await adminRepository.compare_password(email_id, password)
    if (result.admin_details != null) {
       return result.status ? admin_logged_in(result.admin_details,res) : res.api(422, "invalid password", null, false)
    } else {
        return res.api(404, "Not registered Admin, please contact admin", null, false)
    }
}

module.exports.get_admin_details_by_id = async function (req, res) {
    const { id } = req.body
    await adminRepository.get_admin_details({ "_id": id }).then(admin_details => {
        return admin_details ? res.api(200, "admin detail retrived successfully", { admin_details }, true) : res.api(200, "No admin found", { admin_details }, false)
    })
}

module.exports.logout = async function (req, res, _) {
    const { id } = req.body
    await adminRepository.update_login_status(id, false).then(update_data => {
        return (update_data[0] > 0) ? res.api(200, "logged out successfully", { is_logged_in: false }, true) : res.api(200, "No admin found", null, false)
    })
}
module.exports.delete_admin = async function (req, res, _) {
    const { id } = req.body
    await adminRepository.delete_admin(id).then(deleteData => {
        return (deleteData > 0) ? res.api(200, "deleted successfully", null, true) : res.api(200, "No admin found", null, false)
    })
}
module.exports.update_admin_details = async function (req, res, _) {
    const { id, user_name, password, admin_recipt_message } = req.body
    let admin_details = await adminRepository.get_admin_details({ "_id": id })

    if (password != null && password != undefined) {
        if (admin_details) {
            encryptPassword(password, (err, hash) => {
                adminRepository.update_user_name_and_pwd(id,user_name,hash).then(_ => {
                        res.api(200, "updated successfully", { admin_details }, true)
                    })
                })
                
        }
        else {
            return res.api(200, "No admin found", { admin_details }, false)
        }
    }
    else if(user_name != null || user_name != undefined){
       await adminRepository.update_user_name(id,user_name).then((update_count) => {
        return (update_count[0] > 0) ? res.api(200, "updated successfully", { admin_recipt_message: admin_recipt_message }, true) : res.api(200, "No admin found", null, false)
       })
    }
    else {
            await SettingsModel.update({ value: admin_recipt_message }, {
                where: {
                    "code" : 'admin_message'
                }
            }).then(update_count => {
                return (update_count[0] > 0) ? res.api(200, "updated successfully", { admin_recipt_message: admin_recipt_message }, true) : res.api(200, "No admin found", null, false)
            })
    }
}