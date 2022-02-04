"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.close = exports.FeaturedProductsFormComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var delete_component_1 = require("../../shared/components/delete/delete.component");
var FeaturedProductsFormComponent = /** @class */ (function () {
    function FeaturedProductsFormComponent(apiService, commonService, modalService) {
        var _this = this;
        this.apiService = apiService;
        this.commonService = commonService;
        this.modalService = modalService;
        this.isLoadingAdd = false;
        this.close = exports.close;
        this.faCaretDown = free_solid_svg_icons_1.faCaretDown;
        this.featured_product_form = new forms_1.FormGroup({
            product_name: new forms_1.FormControl('', forms_1.Validators.required)
        });
        this.isLoading = false;
        this.backup_products = [];
        this.commonService.featuredProductopUpopend.subscribe(function (data) {
            if (data == null) {
                _this.featured_product_form = new forms_1.FormGroup({
                    product_name: new forms_1.FormControl('', forms_1.Validators.required)
                });
            }
            else {
                _this.featured_product_form = new forms_1.FormGroup({
                    product_name: new forms_1.FormControl(data.product_name, forms_1.Validators.required)
                });
                _this.selected_product = data;
            }
            _this.prevProductInfo = data;
            console.log(data);
        });
    }
    FeaturedProductsFormComponent.prototype.ngOnInit = function () {
        this.backup_products = this.productList;
    };
    FeaturedProductsFormComponent.prototype.saveAction = function () {
        if (this.featured_product_form.valid) {
            this.saveAPI();
        }
        else {
            this.commonService.showAlert("Please choose the product");
        }
    };
    FeaturedProductsFormComponent.prototype.saveAPI = function () {
        var _this = this;
        var _a, _b;
        this.isLoadingAdd = true;
        if (((_a = this.prevProductInfo) === null || _a === void 0 ? void 0 : _a._id) != null && this.selected_product._id != ((_b = this.prevProductInfo) === null || _b === void 0 ? void 0 : _b._id)) {
            this.apiService.UpdateUserProducts({ _id: this.prevProductInfo._id, is_featured: false }).subscribe(function (res) {
                _this.apiService.UpdateUserProducts({ _id: _this.selected_product._id, is_featured: true }).subscribe(function (response) {
                    _this.commonService.showAlert(response.message);
                    _this.isLoadingAdd = false;
                    _this.sidenav.close();
                    _this.commonService.featuredProdcutSuccess.emit();
                });
            });
        }
        else {
            this.apiService.UpdateUserProducts({ _id: this.selected_product._id, is_featured: true }).subscribe(function (res) {
                _this.commonService.showAlert(res.message);
                _this.isLoadingAdd = false;
                _this.sidenav.close();
                _this.commonService.featuredProdcutSuccess.emit();
            });
        }
    };
    FeaturedProductsFormComponent.prototype.ngAfterViewInit = function () {
        this.getProductsList();
    };
    FeaturedProductsFormComponent.prototype.getProductsList = function () {
        var _this = this;
        this.isLoading = true;
        this.apiService.getUserProducts().subscribe(function (response) {
            _this.productList = response.data != null ? JSON.parse(JSON.stringify(response.data)) : [];
            console.log(_this.productList);
            _this.isLoading = false;
        });
    };
    FeaturedProductsFormComponent.prototype.filter_products = function (value) {
        var filterValue = value.toLowerCase();
        this.productList = this.backup_products.filter(function (option) { return option.product_name.toLowerCase().includes(filterValue); });
    };
    FeaturedProductsFormComponent.prototype.optionSelected = function (product) {
        this.selected_product = product;
    };
    FeaturedProductsFormComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.deleteAPI();
        }, function () {
        });
    };
    FeaturedProductsFormComponent.prototype.deleteAPI = function () {
        var _this = this;
        this.apiService.UpdateUserProducts({ _id: this.prevProductInfo._id, is_featured: false }).subscribe(function (res) {
            _this.commonService.showAlert(res.message);
            _this.isLoadingAdd = false;
            _this.sidenav.close();
            _this.commonService.featuredProdcutSuccess.emit();
        });
    };
    __decorate([
        core_1.Input()
    ], FeaturedProductsFormComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], FeaturedProductsFormComponent.prototype, "fieldIndex");
    __decorate([
        core_1.Input()
    ], FeaturedProductsFormComponent.prototype, "field");
    __decorate([
        core_1.Input()
    ], FeaturedProductsFormComponent.prototype, "action");
    __decorate([
        core_1.Input()
    ], FeaturedProductsFormComponent.prototype, "productList");
    FeaturedProductsFormComponent = __decorate([
        core_1.Component({
            selector: 'app-featured-products-form',
            templateUrl: './featured-products-form.component.html',
            styleUrls: ['./featured-products-form.component.scss']
        })
    ], FeaturedProductsFormComponent);
    return FeaturedProductsFormComponent;
}());
exports.FeaturedProductsFormComponent = FeaturedProductsFormComponent;
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
