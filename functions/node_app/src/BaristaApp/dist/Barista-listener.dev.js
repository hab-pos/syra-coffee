"use strict";

var _require = require("../emitters/admin-emitter"),
    baristaEmitter = _require.baristaEmitter;

var _require2 = require("./Barista-repository"),
    baristaRepository = _require2.baristaRepository;

var barista_login_listener = function barista_login_listener() {
  baristaEmitter.on('barista.login', function (data) {
    return baristaRepository.update_login_status(data.barista_info._id, true).then(function (_) {
      data.barista_info.is_logged_in = true;
      data.res.api(200, "Logged in successfully", data.barista_info, true);
    });
  });
};

module.exports.barista_login_listener = barista_login_listener;