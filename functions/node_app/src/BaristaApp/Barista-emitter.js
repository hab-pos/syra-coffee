const { baristaEmitter } = require("../emitters/admin-emitter")

module.exports.barista_logged_in = (barista_info,res) => {
  baristaEmitter.emit(
    'barista.login',
    {
        barista_info,
        res
    }
  )
}
