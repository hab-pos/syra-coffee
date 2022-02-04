"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var EventEmitter = require('events');

var AdminEmitter =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(AdminEmitter, _EventEmitter);

  function AdminEmitter() {
    _classCallCheck(this, AdminEmitter);

    return _possibleConstructorReturn(this, _getPrototypeOf(AdminEmitter).apply(this, arguments));
  }

  _createClass(AdminEmitter, [{
    key: "emit",
    value: function emit(event, data) {
      var _get2;

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      return (_get2 = _get(_getPrototypeOf(AdminEmitter.prototype), "emit", this)).call.apply(_get2, [this, event, data].concat(args));
    }
  }]);

  return AdminEmitter;
}(EventEmitter);

module.exports.adminEmitter = new AdminEmitter();

var BaristaEmitter =
/*#__PURE__*/
function (_EventEmitter2) {
  _inherits(BaristaEmitter, _EventEmitter2);

  function BaristaEmitter() {
    _classCallCheck(this, BaristaEmitter);

    return _possibleConstructorReturn(this, _getPrototypeOf(BaristaEmitter).apply(this, arguments));
  }

  _createClass(BaristaEmitter, [{
    key: "emit",
    value: function emit(event, data) {
      var _get3;

      for (var _len2 = arguments.length, args = new Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      return (_get3 = _get(_getPrototypeOf(BaristaEmitter.prototype), "emit", this)).call.apply(_get3, [this, event, data].concat(args));
    }
  }]);

  return BaristaEmitter;
}(EventEmitter);

module.exports.baristaEmitter = new BaristaEmitter();

var CatelougeEmitter =
/*#__PURE__*/
function (_EventEmitter3) {
  _inherits(CatelougeEmitter, _EventEmitter3);

  function CatelougeEmitter() {
    _classCallCheck(this, CatelougeEmitter);

    return _possibleConstructorReturn(this, _getPrototypeOf(CatelougeEmitter).apply(this, arguments));
  }

  _createClass(CatelougeEmitter, [{
    key: "emit",
    value: function emit(event, data) {
      var _get4;

      for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      return (_get4 = _get(_getPrototypeOf(CatelougeEmitter.prototype), "emit", this)).call.apply(_get4, [this, event, data].concat(args));
    }
  }]);

  return CatelougeEmitter;
}(EventEmitter);

module.exports.catelougeEmitter = new CatelougeEmitter();