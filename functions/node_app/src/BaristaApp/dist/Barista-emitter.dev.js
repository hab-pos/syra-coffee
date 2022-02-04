"use strict";

var _require = require("../emitters/admin-emitter"),
    baristaEmitter = _require.baristaEmitter;

module.exports.barista_logged_in = function (barista_info, res) {
  baristaEmitter.emit('barista.login', {
    barista_info: barista_info,
    res: res
  });
};