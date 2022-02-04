"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.EstablishmentComponent = void 0;
var core_1 = require("@angular/core");
var EstablishmentComponent = /** @class */ (function () {
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
        this.isLoadingSettings = false;
        this.isLoadingLogo = false;
        this.isLoadingadminMessage = false;
        this.admin_height = null;
    }
    EstablishmentComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.getSettings();
        //this.getAdminMessage()
        this.get_logo();
        this.textareas.changes.subscribe(function () {
            _this.rowHeights = [];
            _this.textareas.toArray().forEach(function (el) {
                var rows = Math.round(el.nativeElement.scrollHeight / 24);
                _this.rowHeights.push(rows);
            });
        });
    };
    EstablishmentComponent.prototype.getSettings = function () {
        var _this = this;
        this.isLoadingSettings = true;
        this.apiServices.get_settings().subscribe(function (response) {
            _this.isLoadingSettings = false;
            if (response.success) {
                _this.establishmentInfo = response.data.settings_list.filter(function (value, index, arr) {
                    if (value.code == "admin_message") {
                        _this.reciept_message = value.value;
                    }
                    return value.code != "logo" && value.code != "admin_message";
                });
                setTimeout(function () {
                    _this.admin_height = _this.admin_message.nativeElement.scrollHeight / 20;
                }, 100);
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    // resizeRows(){
    //   this.rowHeights = []
    //   this.textareas.forEach(textArea => {      
    //     let rows = Math.round(textArea.nativeElement.scrollHeight / 24);     
    //     this.rowHeights.push(rows) 
    //   }); 
    // }
    EstablishmentComponent.prototype.getAdminMessage = function () {
        var _this = this;
        this.isLoadingadminMessage = true;
        this.apiServices.get_admin_details_by_id({ id: this.localData.data._id }).subscribe(function (response) {
            _this.isLoadingadminMessage = false;
            if (response.success) {
                _this.reciept_message = response.data.admin_details.admin_recipt_message;
                setTimeout(function () {
                    _this.admin_height = _this.admin_message.nativeElement.scrollHeight / 20;
                }, 100);
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    EstablishmentComponent.prototype.get_logo = function () {
        var _this = this;
        this.isLoadingLogo = true;
        this.apiServices.get_logo().subscribe(function (res) {
            _this.isLoadingLogo = false;
            if (res.success) {
                _this.logo = res.data.logo.value;
            }
            else {
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
        this.isLoadingadminMessage = true;
        this.apiServices.update_admin_message(this.localData.data._id, this.admin_message.nativeElement.value).subscribe(function (response) {
            _this.isLoadingadminMessage = false;
            _this.commonService.showAlert(response.message);
        });
    };
    EstablishmentComponent.prototype.updateSettings = function () {
        var _this = this;
        this.isLoadingSettings = true;
        var objects = [];
        this.textareas.forEach(function (textArea, index) {
            objects.push({ id: _this.establishmentInfo[index]._id, value: textArea.nativeElement.value });
        });
        this.apiServices.update_settings(objects).subscribe(function (response) {
            _this.isLoadingSettings = false;
            _this.commonService.showAlert(response.message);
        });
    };
    EstablishmentComponent.prototype.autoGrowTextZone = function (e) {
        e.target.style.height = "0px";
        e.target.style.height = (e.target.scrollHeight + 0) + "px";
    };
    EstablishmentComponent.prototype.handleFileInput = function (files) {
        var _this = this;
        this.isLoadingLogo = true;
        console.log(files[0], "12323123");
        this.apiServices.upload_logo(files[0]).subscribe(function (response) {
            _this.isLoadingLogo = false;
            _this.commonService.showAlert(response.message);
            //this.logo = this.apiServices.url("/assets/logos/" + response.data.imageName)  
        });
    };
    __decorate([
        core_1.ViewChildren("text")
    ], EstablishmentComponent.prototype, "textareas");
    __decorate([
        core_1.ViewChild("admin_message")
    ], EstablishmentComponent.prototype, "admin_message");
    EstablishmentComponent = __decorate([
        core_1.Component({
            selector: 'app-establishment',
            templateUrl: './establishment.component.html',
            styleUrls: ['./establishment.component.scss']
        })
    ], EstablishmentComponent);
    return EstablishmentComponent;
}());
exports.EstablishmentComponent = EstablishmentComponent;
