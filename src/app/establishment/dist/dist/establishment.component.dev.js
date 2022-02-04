"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __decorate = void 0 && (void 0).__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if ((typeof Reflect === "undefined" ? "undefined" : _typeof(Reflect)) === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) {
    if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  }
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

exports.__esModule = true;
exports.EstablishmentComponent = void 0;

var core_1 = require("@angular/core");

var EstablishmentComponent =
/** @class */
function () {
  function EstablishmentComponent(apiServices, _snackBar, commonService) {
    var _a;

    this.apiServices = apiServices;
    this._snackBar = _snackBar;
    this.commonService = commonService;
    this.rowHeights = [];
    this.mobile = window.innerWidth;
    this.isToEdit = false;
    this.toChangeReciptMsg = false;
    this.establishmentInfo = [];
    this.reciept_message = "";
    this.logo = "";
    this.localData = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "");
  }

  EstablishmentComponent.prototype.ngAfterViewInit = function () {
    this.getSettings();
    this.getAdminMessage();
    this.get_logo();
  };

  EstablishmentComponent.prototype.getSettings = function () {
    var _this = this;

    this.apiServices.get_settings().subscribe(function (response) {
      if (response.success) {
        _this.resizeRows();

        _this.establishmentInfo = response.data.settings_list.filter(function (value, index, arr) {
          return value.code != "logo";
        });
      } else {
        _this.commonService.showAlert(response.message);
      }
    });
  };

  EstablishmentComponent.prototype.resizeRows = function () {
    var _this = this;

    this.rowHeights = [];
    this.textareas.forEach(function (textArea) {
      var rows = Math.round(textArea.nativeElement.scrollHeight / 24);

      _this.rowHeights.push(rows);
    });
  };

  EstablishmentComponent.prototype.getAdminMessage = function () {
    var _this = this;

    this.apiServices.get_admin_details_by_id({
      id: this.localData.data._id
    }).subscribe(function (response) {
      if (response.success) {
        _this.reciept_message = response.data.admin_details.admin_recipt_message;
      } else {
        _this.commonService.showAlert(response.message);
      }
    });
  };

  EstablishmentComponent.prototype.get_logo = function () {
    var _this = this;

    this.apiServices.get_logo().subscribe(function (res) {
      if (res.success) {
        _this.logo = res.data.logo.value;
      } else {
        _this.commonService.showAlert(res.message);
      }
    });
  };

  EstablishmentComponent.prototype.editAll = function () {
    if (this.isToEdit) {
      this.updateSettings();
    }

    this.isToEdit = this.isToEdit ? false : true;
  };

  EstablishmentComponent.prototype.editReciptMsg = function () {
    if (this.toChangeReciptMsg) {
      this.updateAdminMessage();
    }

    this.toChangeReciptMsg = this.toChangeReciptMsg ? false : true;
  };

  EstablishmentComponent.prototype.updateAdminMessage = function () {
    var _this = this;

    this.apiServices.update_admin_message(this.localData.data._id, this.admin_message.nativeElement.value).subscribe(function (response) {
      _this.commonService.showAlert(response.message);
    });
  };

  EstablishmentComponent.prototype.updateSettings = function () {
    var _this = this;

    var objects = [];
    this.textareas.forEach(function (textArea, index) {
      objects.push({
        id: _this.establishmentInfo[index]._id,
        value: textArea.nativeElement.value
      });
    });
    this.apiServices.update_settings(objects).subscribe(function (response) {
      _this.commonService.showAlert(response.message);
    });
  };

  EstablishmentComponent.prototype.autoGrowTextZone = function (e) {
    e.target.style.height = "0px";
    e.target.style.height = e.target.scrollHeight + 0 + "px";
  };

  EstablishmentComponent.prototype.handleFileInput = function (files) {
    var _this = this;

    this.apiServices.upload_logo(files[0]).subscribe(function (response) {
      _this.commonService.showAlert(response.message);

      _this.logo = "https://syra-sharafa.herokuapp.com/assets/logos/" + response.data.imageName;
    });
  };

  __decorate([core_1.ViewChildren("text")], EstablishmentComponent.prototype, "textareas");

  __decorate([core_1.ViewChild("admin_message")], EstablishmentComponent.prototype, "admin_message");

  EstablishmentComponent = __decorate([core_1.Component({
    selector: 'app-establishment',
    templateUrl: './establishment.component.html',
    styleUrls: ['./establishment.component.scss']
  })], EstablishmentComponent);
  return EstablishmentComponent;
}();

exports.EstablishmentComponent = EstablishmentComponent;