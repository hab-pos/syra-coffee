"use strict";

var _require = require('./settings-repository'),
    settingsRepository = _require.settingsRepository;

var commonHelper = require('../helpers/commonHelper');

var _require2 = require('../../Utils/constants'),
    constants = _require2.constants;

var util = require('util');

var moment = require('moment');

module.exports.add_setting = function _callee(req, res, _) {
  var _req$body, code, value;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, code = _req$body.code, value = _req$body.value;
          settingsRepository.add_settings(code, value).then(function (setting) {
            res.api(200, "Your preference saved", {
              setting: setting
            }, true);
          });

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports.get_settings = function _callee2(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          id = req.body.id;
          settingsRepository.getAllSettings(id).then(function (settings_list) {
            res.api(200, "settings retrived successfully", {
              settings_list: settings_list
            }, true);
          });

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports.update_Settings = function _callee3(req, res, _) {
  var request_array, success;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          request_array = req.body.request_array;
          success = true;
          request_array.forEach(function (element) {
            settingsRepository.update_settings(element.id, element.value).then(function (update_success) {
              success = update_success[0] > 0 ? true : false;
            });
          });
          success ? res.api(200, "setting updated successfully", null, true) : res.api(404, "No setting found", null, false);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};

module.exports.delete_settings = function _callee4(req, res, _) {
  var id;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          id = req.body.id;
          settingsRepository.deleteSettings(id).then(function (delete_count) {
            delete_count > 0 ? res.api(200, "setting deleted successfully", null, true) : res.api(404, "No setting found", null, false);
          });

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports.upload_logo_image = function _callee5(req, res, _) {
  var files, file, fileMove, path, ext, imageName;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          console.log(req.file, req.files, "jb");

          if (!req.files) {
            _context5.next = 22;
            break;
          }

          files = req.files;
          file = files.file;
          fileMove = util.promisify(file.mv);
          path = './functions/assets/logos/';
          ext = file.name.split('.').pop();
          commonHelper.prepareUploadFolder(path);
          imageName = 'logo' + moment().unix() + '.' + ext;
          _context5.prev = 9;
          _context5.next = 12;
          return regeneratorRuntime.awrap(fileMove(path + imageName));

        case 12:
          _context5.next = 14;
          return regeneratorRuntime.awrap(settingsRepository.update_logo(imageName));

        case 14:
          return _context5.abrupt("return", res.api(200, "uploaded successfully", {
            imageName: imageName
          }, true));

        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](9);
          return _context5.abrupt("return", res.api(422, "cannot upload", null, false));

        case 20:
          _context5.next = 23;
          break;

        case 22:
          return _context5.abrupt("return", res.api(422, "No image to upload", null, false));

        case 23:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[9, 17]]);
};

module.exports.get_logo = function _callee6(req, res, _) {
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          settingsRepository.get_logo().then(function (logo) {
            logo.value = constants.HOST + "assets/logos/" + logo.value;
            res.api(200, "logo read successfully", {
              logo: logo
            }, true);
          });

        case 1:
        case "end":
          return _context6.stop();
      }
    }
  });
};