"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = require('./Settings-model'),
    SettingsModel = _require.SettingsModel;

var SettingsRepository =
/*#__PURE__*/
function () {
  function SettingsRepository() {
    _classCallCheck(this, SettingsRepository);
  }

  _createClass(SettingsRepository, [{
    key: "add_settings",
    value: function add_settings(code, value) {
      return SettingsModel.create({
        code: code,
        value: value
      });
    }
  }, {
    key: "isUniqueCode",
    value: function isUniqueCode(code) {
      return SettingsModel.findOne({
        where: {
          code: code
        }
      });
    }
  }, {
    key: "getAllSettings",
    value: function getAllSettings(id) {
      return id ? SettingsModel.findOne({
        where: {
          _id: id
        }
      }) : SettingsModel.findAll();
    }
  }, {
    key: "deleteSettings",
    value: function deleteSettings(id) {
      return SettingsModel.destroy({
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "update_settings",
    value: function update_settings(id, value) {
      return SettingsModel.update({
        value: value
      }, {
        where: {
          "_id": id
        }
      });
    }
  }, {
    key: "update_logo",
    value: function update_logo(value) {
      return SettingsModel.update({
        value: value
      }, {
        where: {
          "code": 'logo'
        }
      });
    }
  }, {
    key: "get_logo",
    value: function get_logo() {
      return SettingsModel.findOne({
        where: {
          code: 'logo'
        }
      });
    }
  }]);

  return SettingsRepository;
}();

module.exports.settingsRepository = new SettingsRepository();