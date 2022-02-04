const { adminEmitter } = require("../emitters/admin-emitter");
const { adminRepository } = require("./Admin-repository");

const admin_login_listener = () => {
    adminEmitter.on('admin.login', function (data) {
        return  adminRepository.update_login_status(data.admin_info._id, true).then(_ => {
            data.admin_info.is_logged_in = true
            data.res.api(200, "Logged in successfully", data.admin_info, true)
        })
    })
}

module.exports.admin_login_listener = admin_login_listener