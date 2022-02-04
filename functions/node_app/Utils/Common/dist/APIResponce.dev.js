"use strict";

module.exports.apiResponse = function (req, res, next) {
  var http = require('http');

  var path = require('path');

  var _require = require('i18n'),
      I18n = _require.I18n;

  var i18n = new I18n({
    locales: ['en', 'es'],
    directory: path.join(__dirname, 'locales')
  });

  res.api = function (status, message, data, success) {
    var maintanence = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;
    // status = __(status)
    // message = __(message)
    // success = __(data)
    // maintanence = __(maintanence)
    return res.status(200).json({
      status: status,
      message: message,
      data: data,
      maintanence: maintanence,
      success: success
    });
  };

  next();
};