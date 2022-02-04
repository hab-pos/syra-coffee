"use strict";

var _require = require("../emitters/admin-emitter"),
    adminEmitter = _require.adminEmitter;

module.exports.admin_logged_in = function (admin_info, res) {
  adminEmitter.emit('admin.login', {
    admin_info: admin_info,
    res: res
  });
};