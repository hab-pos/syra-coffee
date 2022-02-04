const { baristaEmitter } = require("../emitters/admin-emitter");
const { baristaRepository } = require("./Barista-repository");

const barista_login_listener = () => {
    baristaEmitter.on('barista.login', function (data) {
        return  baristaRepository.update_login_status(data.barista_info._id, true).then(_ => {
            data.barista_info.is_logged_in = true
            data.res.api(200, "Logged in successfully", data.barista_info, true)
        })
    })
}

module.exports.barista_login_listener = barista_login_listener