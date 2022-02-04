"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.close = exports.ModifierComponentComponent = exports._filter = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var forms_1 = require("@angular/forms");
var free_solid_svg_icons_2 = require("@fortawesome/free-solid-svg-icons");
var delete_component_1 = require("../../shared/components/delete/delete.component");
exports._filter = function (opt, value) {
    var filterValue = value.toLowerCase();
    return opt.filter(function (item) { return item.toLowerCase().includes(filterValue); });
};
var ModifierComponentComponent = /** @class */ (function () {
    function ModifierComponentComponent(apiServices, commonService, modalService) {
        var _this = this;
        this.apiServices = apiServices;
        this.commonService = commonService;
        this.modalService = modalService;
        this.isLoadingAdd = false;
        this.isLoadingDelete = false;
        this.faCaretDown = free_solid_svg_icons_1.faCaretDown;
        this.faTimes = free_solid_svg_icons_1.faTimes;
        this.faChevronDown = free_solid_svg_icons_1.faChevronDown;
        this.faBolt = free_solid_svg_icons_2.faBolt;
        this.close = exports.close;
        this.faEuroSign = free_solid_svg_icons_2.faEuroSign;
        this.modifier_details = null;
        this.ivas = [];
        this.backup_Ivas = [];
        this.selectedIVA = [];
        this.modifierForm = new forms_1.FormGroup({
            modifier_name: new forms_1.FormControl('', forms_1.Validators.required),
            price: new forms_1.FormControl('', forms_1.Validators.required),
            iva: new forms_1.FormControl('', forms_1.Validators.required),
            beans: new forms_1.FormControl('', forms_1.Validators.required)
        });
        this.commonService.ModifierCategorypopUpopend.subscribe(function (data) {
            _this.modifier_details = data;
            _this.modifierForm = new forms_1.FormGroup({
                modifier_name: new forms_1.FormControl(data === null || data === void 0 ? void 0 : data.modifier_name, forms_1.Validators.required),
                price: new forms_1.FormControl(data === null || data === void 0 ? void 0 : data.price, forms_1.Validators.required),
                iva: new forms_1.FormControl(data === null || data === void 0 ? void 0 : data.iva_value, forms_1.Validators.required),
                beans: new forms_1.FormControl(data === null || data === void 0 ? void 0 : data.beans_value, forms_1.Validators.required)
            });
            // this.modifierForm = new FormGroup({
            //   modifier_name: new FormControl('', Validators.required),
            //   price: new FormControl('', Validators.required),
            //   iva: new FormControl('', Validators.required),
            //   beans: new FormControl('', Validators.required),
            // })
        });
        this.commonService.resetForms.subscribe(function (_) {
            _this.modifierForm = new forms_1.FormGroup({
                modifier_name: new forms_1.FormControl('', forms_1.Validators.required),
                price: new forms_1.FormControl('', forms_1.Validators.required),
                iva: new forms_1.FormControl('', forms_1.Validators.required),
                beans: new forms_1.FormControl('', forms_1.Validators.required)
            });
        });
    }
    ModifierComponentComponent.prototype.ngOnInit = function () {
        this.get_iva();
    };
    ModifierComponentComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.deleteAPI();
        }, function () {
        });
    };
    ModifierComponentComponent.prototype.filter_items = function (value) {
        var filterValue = value.toLowerCase();
        this.ivas = this.backup_Ivas.filter(function (option) { return option.iva_percent.includes(filterValue); });
    };
    ModifierComponentComponent.prototype.get_iva = function () {
        var _this = this;
        this.apiServices.getIVA({}).subscribe(function (res) {
            _this.ivas = _this.commonService.sort(res.data.ivalist);
            _this.backup_Ivas = _this.ivas;
            _this.selectedIVA = _this.ivas[0]._id;
            // this.modifierForm.setValue({ modifier_name: "", price: "", iva: this.ivas[0].iva_percent + "%", beans: "" })
        });
    };
    ModifierComponentComponent.prototype.saveAction = function () {
        if (this.modifierForm.valid) {
            this.action == "edit" ? this.editModifier() : this.saveModifier();
        }
        else {
            this.commonService.getFormValidationErrors(this.modifierForm);
        }
    };
    ModifierComponentComponent.prototype.editModifier = function () {
        var _this = this;
        var _a;
        this.isLoadingAdd = true;
        this.apiServices.updateModifiers({ modifier_name: this.modifierForm.controls['modifier_name'].value, price: this.modifierForm.controls['price'].value, iva: this.selectedIVA, iva_value: this.modifierForm.controls['iva'].value, beans_value: this.modifierForm.controls['beans'].value, _id: (_a = this.modifier_details) === null || _a === void 0 ? void 0 : _a._id }).subscribe(function (response) {
            _this.isLoadingAdd = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.sidenav.close();
                _this.modifierForm.setValue({ modifier_name: "", price: "", iva: "", beans: "" });
                _this.commonService.ModifierSuccess.emit();
            }
        });
    };
    ModifierComponentComponent.prototype.saveModifier = function () {
        var _this = this;
        this.isLoadingAdd = true;
        this.apiServices.addModifiers({ modifier_name: this.modifierForm.controls['modifier_name'].value, price: this.modifierForm.controls['price'].value, iva: this.selectedIVA, iva_value: this.modifierForm.controls['iva'].value, beans_value: this.modifierForm.controls['beans'].value }).subscribe(function (response) {
            _this.isLoadingAdd = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.sidenav.close();
                _this.modifierForm.setValue({ modifier_name: "", price: "", iva: "", beans: "" });
                _this.commonService.ModifierSuccess.emit();
            }
        });
    };
    ModifierComponentComponent.prototype.deleteAPI = function () {
        var _this = this;
        var _a;
        this.isLoadingDelete = true;
        this.apiServices.deleteModifiers({ id: (_a = this.modifier_details) === null || _a === void 0 ? void 0 : _a._id }).subscribe(function (response) {
            _this.isLoadingDelete = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.sidenav.close();
                _this.modifierForm.setValue({ modifier_name: "", price: "", iva: "", beans: "" });
                _this.commonService.ModifierSuccess.emit();
            }
        });
    };
    ModifierComponentComponent.prototype.optionSelected = function (value, percent) {
        console.log("success", value, percent);
        // this.modifierForm.get('iva')?.setValue(percent);
        this.selectedIVA = value;
    };
    __decorate([
        core_1.Input()
    ], ModifierComponentComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], ModifierComponentComponent.prototype, "action");
    __decorate([
        core_1.Input()
    ], ModifierComponentComponent.prototype, "field");
    __decorate([
        core_1.ViewChild('item')
    ], ModifierComponentComponent.prototype, "ivaTExtField");
    ModifierComponentComponent = __decorate([
        core_1.Component({
            selector: 'app-modifier-component',
            templateUrl: './modifier-component.component.html',
            styleUrls: ['./modifier-component.component.scss']
        })
    ], ModifierComponentComponent);
    return ModifierComponentComponent;
}());
exports.ModifierComponentComponent = ModifierComponentComponent;
exports.close = {
    prefix: 'fa',
    iconName: 'line',
    icon: [
        512,
        512,
        [],
        '',
        "M437.126,74.939c-99.826-99.826-262.307-99.826-362.133,0C26.637,123.314,0,187.617,0,256.005\n\t\t\ts26.637,132.691,74.993,181.047c49.923,49.923,115.495,74.874,181.066,74.874s131.144-24.951,181.066-74.874\n\t\t\tC536.951,337.226,536.951,174.784,437.126,74.939z M409.08,409.006c-84.375,84.375-221.667,84.375-306.042,0\n\t\t\tc-40.858-40.858-63.37-95.204-63.37-153.001s22.512-112.143,63.37-153.021c84.375-84.375,221.667-84.355,306.042,0\n\t\t\tC493.435,187.359,493.435,324.651,409.08,409.006z M341.525,310.827l-56.151-56.071l56.151-56.071c7.735-7.735,7.735-20.29,0.02-28.046\n\t\t\tc-7.755-7.775-20.31-7.755-28.065-0.02l-56.19,56.111l-56.19-56.111c-7.755-7.735-20.31-7.755-28.065,0.02\n\t\t\tc-7.735,7.755-7.735,20.31,0.02,28.046l56.151,56.071l-56.151,56.071c-7.755,7.735-7.755,20.29-0.02,28.046\n\t\t\tc3.868,3.887,8.965,5.811,14.043,5.811s10.155-1.944,14.023-5.792l56.19-56.111l56.19,56.111\n\t\t\tc3.868,3.868,8.945,5.792,14.023,5.792c5.078,0,10.175-1.944,14.043-5.811C349.28,331.117,349.28,318.562,341.525,310.827z",
    ]
};
