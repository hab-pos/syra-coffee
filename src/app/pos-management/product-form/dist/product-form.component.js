"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ProductFormComponent = void 0;
var core_1 = require("@angular/core");
var account_from_component_1 = require("../../account-configurations/account-from/account-from.component");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var forms_1 = require("@angular/forms");
var delete_component_1 = require("../../shared/components/delete/delete.component");
var ProductFormComponent = /** @class */ (function () {
    function ProductFormComponent(apiService, commonService, modalService) {
        var _this = this;
        this.apiService = apiService;
        this.commonService = commonService;
        this.modalService = modalService;
        this.close = account_from_component_1.close;
        this.branches = [];
        this.colors = ["#4751c9", "#45a9ea", "#cc6ae3", "#dea766", "#7c52cb", "#16a186"];
        this.faEuroSign = free_solid_svg_icons_1.faEuroSign;
        this.faBolt = free_solid_svg_icons_1.faBolt;
        this.selectedColorIndex = 0;
        this.categories = [];
        this.ivas = [];
        this.product_id = "";
        this.selectedValue = "";
        this.isLoadingSave = false;
        this.isLoadingDelete = false;
        this.isLoading = true;
        this.ProductForm = new forms_1.FormGroup({
            product_name: new forms_1.FormControl('', forms_1.Validators.required),
            price: new forms_1.FormControl('', forms_1.Validators.required),
            vat: new forms_1.FormControl(this.selectedValue, forms_1.Validators.required),
            beanValue: new forms_1.FormControl('', forms_1.Validators.required)
        });
        this.commonService.resetForms.subscribe(function () {
            _this.initForm();
        });
    }
    ProductFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_iva();
        this.get_categories();
        this.get_Branches();
        this.commonService.productEmitter.subscribe(function (response) {
            _this.product_id = response;
            console.log(_this.product_id);
            if (_this.product_id) {
                _this.get_product_details();
            }
            else {
                _this.initForm();
            }
        });
    };
    ProductFormComponent.prototype.toggle = function () {
        this.sidenav.toggle();
    };
    ProductFormComponent.prototype.ChangeColor = function (row) {
        this.selectedColorIndex = row;
    };
    ProductFormComponent.prototype.initForm = function () {
        var _a;
        this.selectedValue = (_a = this.ivas[0]) === null || _a === void 0 ? void 0 : _a._id;
        this.ProductForm.setValue({ product_name: "", price: "", vat: this.selectedValue || "", beanValue: "" });
        this.init_branches();
        this.init_categories();
        this.selectedColorIndex = 0;
        this.isLoading = false;
    };
    //to get category detials while comming to edit option to fill form 
    ProductFormComponent.prototype.get_product_details = function () {
        var _this = this;
        this.isLoading = true;
        this.apiService.getProducts({ id: this.product_id }).subscribe(function (response) {
            _this.selectedValue = response.data.products.iva;
            _this.ProductForm.setValue({ product_name: response.data.products.product_name, price: response.data.products.price, vat: _this.selectedValue, beanValue: response.data.products.beanValue || "" });
            _this.selectedColorIndex = _this.colors.findIndex(function (x) { return x === response.data.products.color; });
            _this.init_branches();
            _this.init_categories();
            response.data.products.categories.forEach(function (element) {
                var index = _this.categories.findIndex(function (x) { return x._id === element; });
                _this.categories[index].is_active = true;
            });
            response.data.products.available_branches.forEach(function (element) {
                var index = _this.branches.findIndex(function (x) { return x._id === element; });
                _this.branches[index].is_active = true;
            });
            _this.isLoading = false;
        });
    };
    ProductFormComponent.prototype.init_branches = function () {
        this.branches.forEach(function (element) {
            element.is_active = false;
        });
    };
    ProductFormComponent.prototype.init_categories = function () {
        this.categories.forEach(function (element) {
            element.is_active = false;
        });
    };
    ProductFormComponent.prototype.saveAction = function (edit) {
        if (edit === void 0) { edit = false; }
        var requestObj = this.createRequestObject();
        if (this.ProductForm.valid) {
            if (!this.commonService.isAnycategorySelected(this.categories)) {
                this.commonService.showAlert("select atleast any one category");
            }
            else if (!this.commonService.isAnyBranchSelected(this.branches)) {
                this.commonService.showAlert("select atleast any one branch");
            }
            else {
                edit ? this.edit_product(requestObj) : this.save_product(requestObj);
            }
        }
        else {
            this.commonService.showAlert("Product name, price and vat percentage is mandatory");
        }
    };
    ProductFormComponent.prototype.deleteAction = function () {
        var _this = this;
        this.modalService.open(delete_component_1.DeleteComponent)
            .result.then(function () {
            _this.isLoadingDelete = true;
            _this.apiService.deleteproduct({ id: _this.product_id }).subscribe(function (response) {
                _this.isLoadingDelete = false;
                _this.commonService.showAlert(response.message);
                if (response.success) {
                    _this.commonService.commonEmitter.emit();
                    _this.sidenav.close();
                }
            });
        }, function () {
        });
    };
    ProductFormComponent.prototype.save_product = function (requestObj) {
        var _this = this;
        this.isLoadingSave = true;
        this.apiService.addProduct(requestObj).subscribe(function (response) {
            _this.isLoadingSave = false;
            if (response.success) {
                _this.commonService.showAlert(response.message);
                _this.commonService.commonEmitter.emit();
                _this.sidenav.close();
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    ProductFormComponent.prototype.edit_product = function (requestObj) {
        var _this = this;
        requestObj.id = this.product_id;
        this.isLoadingSave = true;
        this.apiService.updateProduct(requestObj).subscribe(function (response) {
            _this.isLoadingSave = false;
            _this.commonService.showAlert(response.message);
            if (response.success) {
                _this.commonService.commonEmitter.emit();
                _this.sidenav.close();
            }
        });
    };
    ProductFormComponent.prototype.createRequestObject = function () {
        var _this = this;
        var _a;
        var request = new Object();
        request.product_name = this.ProductForm.controls["product_name"].value;
        request.price = this.ProductForm.controls["price"].value.replace(',', '.').trim();
        var index = this.ivas.findIndex(function (iva) { return iva._id == _this.selectedValue; });
        var tax = Number(this.ProductForm.controls["price"].value.replace(',', '.').trim()) * this.ivas[index].iva_percent / (100 + this.ivas[index].iva_percent);
        request.price_with_iva = (Number(this.ProductForm.controls["price"].value.replace(',', '.').trim()) - tax).toFixed(2);
        request.iva = this.ProductForm.controls["vat"].value;
        request.beanValue = this.ProductForm.controls["beanValue"].value;
        request.categories = this.get_selected_category().join(",");
        request.available_branches = this.get_selected_branches().join(",");
        request.color = this.colors[this.selectedColorIndex];
        request.created_by = JSON.parse((_a = localStorage.getItem('syra_admin')) !== null && _a !== void 0 ? _a : "")["data"]["_id"];
        return request;
    };
    ProductFormComponent.prototype.get_Branches = function () {
        var _this = this;
        this.apiService.get_branch({}).subscribe(function (res) {
            res.data.branch_list.forEach(function (element) {
                element.is_active = false;
            });
            _this.branches = res.data.branch_list;
        });
    };
    ProductFormComponent.prototype.get_categories = function () {
        var _this = this;
        this.apiService.getCategories({}).subscribe(function (res) {
            res.data.category.forEach(function (element) {
                element.is_active = false;
            });
            _this.categories = res.data.category;
        });
    };
    ProductFormComponent.prototype.get_iva = function () {
        var _this = this;
        this.apiService.getIVA({}).subscribe(function (res) {
            _this.ivas = _this.commonService.sort(res.data.ivalist);
            _this.selectedValue = _this.ivas[0]._id;
            _this.ProductForm.setValue({ product_name: "", price: "", vat: _this.selectedValue, beanValue: "" });
        });
    };
    ProductFormComponent.prototype.updateAllComplete = function (row, value, component) {
        component == 0 ?
            this.categories[row].is_active = value : this.branches[row].is_active = value;
    };
    ProductFormComponent.prototype.get_selected_branches = function () {
        var selected_branches = [];
        this.branches.forEach(function (element) {
            if (element.is_active) {
                selected_branches.push(element._id);
            }
        });
        return selected_branches;
    };
    ProductFormComponent.prototype.get_selected_category = function () {
        var selected_category = [];
        this.categories.forEach(function (element) {
            if (element.is_active) {
                selected_category.push(element._id);
            }
        });
        return selected_category;
    };
    __decorate([
        core_1.Input()
    ], ProductFormComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], ProductFormComponent.prototype, "field");
    __decorate([
        core_1.Input()
    ], ProductFormComponent.prototype, "action");
    ProductFormComponent = __decorate([
        core_1.Component({
            selector: 'app-product-form',
            templateUrl: './product-form.component.html',
            styleUrls: ['./product-form.component.scss']
        })
    ], ProductFormComponent);
    return ProductFormComponent;
}());
exports.ProductFormComponent = ProductFormComponent;
