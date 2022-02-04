const { catelougeEmitter } = require("../emitters/admin-emitter")

module.exports.catelouge_inserted = (data) => {
  catelougeEmitter.emit(
    'insertd.catelouge',
    {
        data,
    }
  )
}
