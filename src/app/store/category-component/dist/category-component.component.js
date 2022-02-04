"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.close = exports.CategoryComponentComponent = void 0;
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var delete_component_1 = require("../../shared/components/delete/delete.component");
var CategoryComponentComponent = /** @class */ (function () {
    function CategoryComponentComponent(apiServices, commonService, modalService) {
        var _this = this;
        this.apiServices = apiServices;
        this.commonService = commonService;
        this.modalService = modalService;
        this.isLoadingAdd = false;
        this.isLoadingDelete = false;
        this.isLoadingUpload = false;
        this.close = exports.close;
        this.categoryForm = new forms_1.FormGroup({
            category_name: new forms_1.FormControl('', forms_1.Validators.required),
            category_image: new forms_1.FormControl('', null)
        });
        this.commonService.UserCategorypopUpopend.subscribe(function (data) {
            _this.categoryForm = new forms_1.FormGroup({
                category_name: new forms_1.FormControl(data === null || data === void 0 ? void 0 : data.category_name, forms_1.Validators.required),
                category_image: new forms_1.FormControl('', null)
            });
            _this.imageInfo = { imageName: data === null || data === void 0 ? void 0 : data.image_name, webContentLink: data === null || data === void 0 ? void 0 : data.image_url };
            _this.category_info = data;
            _this.imgURL = data === null || data === void 0 ? void 0 : data.image_url;
        });
        this.commonService.resetForms.subscribe(function (_) {
            _this.categoryForm = new forms_1.FormGroup({
                category_name: new forms_1.FormControl('', forms_1.Validators.required),
                category_image: new forms_1.FormControl('', null)
            });
        });
    }
    CategoryComponentComponent.prototype.ngOnInit = function () {
    };
    CategoryComponentComponent.prototype.preview = function (files) {
        var _this = this;
        if (files.length === 0)
            return;
        var mimeType = files[0].type;
        if (mimeType.match(/image\/*/) == null) {
            this.commonService.showAlert("Only images are supported.");
            return;
        }
        var reader = new FileReader();
        this.imagePath = files;
        this.image_base64 = files[0];
        this.uploadPhoto();
        reader.readAsDataURL(files[0]);
        reader.onload = function (_event) {
            _this.imgURL = reader.result;
        };
    };
    CategoryComponentComponent.prototype.saveAction = function () {
        var _a, _b, _c, _d, _e, _f;
        if (((_a = this.categoryForm.get('category_name')) === null || _a === void 0 ? void 0 : _a.value) != "" && ((_b = this.categoryForm.get('category_name')) === null || _b === void 0 ? void 0 : _b.value) != null && ((_c = this.imageInfo) === null || _c === void 0 ? void 0 : _c.webContentLink) != null && ((_d = this.imageInfo) === null || _d === void 0 ? void 0 : _d.webContentLink) != undefined) {
            this.action == "edit" ? this.editCategory() : this.saveCategory();
        }
        else {
            ((_e = this.categoryForm.get('category_name')) === null || _e === void 0 ? void 0 : _e.value) != "" && ((_f = this.categoryForm.get('category_name')) === null || _f === void 0 ? void 0 : _f.value) != null ? this.commonService.showAlert("Category Name Madatory") : this.commonService.showAlert("Category Image  Madatory");
        }
    };
    CategoryComponentComponent.prototype.uploadPhoto = function () {
        var _this = this;
        this.isLoadingUpload = true;
        this.apiServices.uploadCategoryImage(this.image_base64).subscribe(function (response) {
            console.log(response.data);
            _this.commonService.showAlert(response.message);
            _this.isLoadingUpload = false;
            _this.imageInfo = response.data;
            _this.categoryForm.setValue({ category_image: "uploaded" });
        });
    };
    CategoryComponentComponent.prototype.editCategory = function () {
        var _this = this;
        var _a;
        if (((_a = this.imageInfo) === null || _a === void 0 ? void 0 : _a.webContentLink) != undefined) {
            this.isLoadingAdd = true;
            console.log(this.imageInfo);
            this.apiServices.UpdateUserCategory({ category_name: this.categoryForm.controls['category_name'].value, image_name: this.imageInfo.imageName, image_url: this.imageInfo.webContentLink, _id: this.category_info._id }).subscribe(function (response) {
                _this.isLoadingAdd = false;
                _this.commonService.showAlert(response.message);
                if (response.success) {
                    _this.imageInfo = null;
                    _this.imagePath = null;
                    _this.sidenav.close();
                    _this.categoryForm.setValue({ category_name: "", category_image: "" });
                    _this.commonService.UserCategorySuccess.emit();
                }
            });
        }
        else {
            this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!");
        }
    };
    CategoryComponentComponent.prototype.saveCategory = function () {
        var _this = this;
        var _a, _b;
        if (((_a = this.imageInfo) === null || _a === void 0 ? void 0 : _a.webViewLink) != null || ((_b = this.imageInfo) === null || _b === void 0 ? void 0 : _b.webViewLink) != undefined) {
            this.isLoadingAdd = true;
            console.log(this.imageInfo);
            this.apiServices.addUserCategory({ category_name: this.categoryForm.controls['category_name'].value, image_name: this.imageInfo.imageName, image_url: this.imageInfo.webContentLink }).subscribe(function (response) {
                _this.isLoadingAdd = false;
                _this.commonService.showAlert(response.message);
                if (response.success) {
                    _this.imageInfo = null;
                    _this.imagePath = null;
                    _this.sidenav.close();
                    _this.categoryForm.setValue({ category_name: "", category_image: "" });
                    _this.commonService.UserCategorySuccess.emit();
                }
            });
        }
        else {
            this.commonService.showAlert("Image Not uploaded, Please wait till image is being uploaded!");
        }
    };
    CategoryComponentComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.deleteAPI();
        }, function () {
        });
    };
    CategoryComponentComponent.prototype.deleteAPI = function () {
        var _this = this;
        this.isLoadingDelete = true;
        this.apiServices.deleteUserCategory({ id: this.category_info._id }).subscribe(function (response) {
            _this.isLoadingDelete = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.imageInfo = null;
                _this.imagePath = null;
                _this.sidenav.close();
                _this.categoryForm.setValue({ category_name: "", category_image: "" });
                _this.commonService.UserCategorySuccess.emit();
            }
        });
    };
    __decorate([
        core_1.Input()
    ], CategoryComponentComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], CategoryComponentComponent.prototype, "action");
    __decorate([
        core_1.Input()
    ], CategoryComponentComponent.prototype, "field");
    CategoryComponentComponent = __decorate([
        core_1.Component({
            selector: 'app-category-component',
            templateUrl: './category-component.component.html',
            styleUrls: ['./category-component.component.scss']
        })
    ], CategoryComponentComponent);
    return CategoryComponentComponent;
}());
exports.CategoryComponentComponent = CategoryComponentComponent;
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
