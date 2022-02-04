const { adminEmitter } = require("../emitters/admin-emitter")

module.exports.admin_logged_in = (admin_info,res) => {
    adminEmitter.emit(
    'admin.login',
    {
        admin_info,
        res
    }
  )
}
