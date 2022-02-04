"use strict";

var _require = require("../emitters/admin-emitter"),
    adminEmitter = _require.adminEmitter;

var _require2 = require("./Admin-repository"),
    adminRepository = _require2.adminRepository;

var admin_login_listener = function admin_login_listener() {
  adminEmitter.on('admin.login', function (data) {
    return adminRepository.update_login_status(data.admin_info._id, true).then(function (_) {
      data.admin_info.is_logged_in = true;
      data.res.api(200, "Logged in successfully", data.admin_info, true);
    });
  });
};

module.exports.admin_login_listener = admin_login_listener;