"use strict";

var _require = require("../emitters/admin-emitter"),
    catelougeEmitter = _require.catelougeEmitter;

module.exports.catelouge_inserted = function (data) {
  catelougeEmitter.emit('insertd.catelouge', {
    data: data
  });
};