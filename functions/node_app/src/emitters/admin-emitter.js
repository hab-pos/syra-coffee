const EventEmitter = require('events')

class AdminEmitter extends EventEmitter {
  emit(event, data, ...args) {
    return super.emit(event, data, ...args)
  }
}
module.exports.adminEmitter = new AdminEmitter()

class BaristaEmitter extends EventEmitter {
  emit(event, data, ...args) {
    return super.emit(event, data, ...args)
  }
}
module.exports.baristaEmitter = new BaristaEmitter()
class CatelougeEmitter extends EventEmitter {
  emit(event, data, ...args) {
    return super.emit(event, data, ...args)
  }
}
module.exports.catelougeEmitter = new CatelougeEmitter()