"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StoreComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var StoreComponent = /** @class */ (function () {
    function StoreComponent(router, activeRoute, apiServices, commonService) {
        var _this = this;
        this.router = router;
        this.activeRoute = activeRoute;
        this.apiServices = apiServices;
        this.commonService = commonService;
        this.Pagewidth = 0;
        this.faPlusCircle = free_solid_svg_icons_1.faPlusCircle;
        this.faPencilAlt = free_solid_svg_icons_1.faPencilAlt;
        this.faArrowsAlt = free_solid_svg_icons_1.faArrowsAlt;
        this.field = '';
        this.action = '';
        this.selectedRow = -1;
        this.selectedCategoryRow = -1;
        this.category = [];
        this.selectedRowToHighLight = -1;
        this.sideMenuOpend = false;
        this.modifiers = [];
        this.products = [
        // { product_name : "Espresso"},
        // { product_name : "Cartado"},
        // { product_name : "Latte/cappucino"},
        // { product_name : "Flat White"},
        // { product_name : "Brownie"},
        // { product_name : "Banana Bread"},
        // { product_name : "Ginger Bread"},
        // { product_name : "Apple Pie"},
        // { product_name : "Banana pudding"},
        ];
        this.sideMenuClosing = true;
        this.isChangingStatus = true;
        this.allProducts = []; //for filtering purpose
        this.isLoadingProduct = false;
        this.isLoadingCategory = false;
        this.isLoadingModifiers = false;
        this.display_col_category = ["name_color", "action"];
        this.masterFilterId = null;
        this.changingStatus = false;
        this.backup_products = [];
        this.Pagewidth = window.innerWidth;
        this.getCategoryList();
        this.getModifierList();
        this.getProductsList();
        this.commonService.UserCategorySuccess.subscribe(function (_) {
            _this.getCategoryList();
        });
        this.commonService.ModifierSuccess.subscribe(function (_) {
            _this.getModifierList();
        });
        this.commonService.UserproductSuccess.subscribe(function (_) {
            console.log("consoleing");
            _this.getProductsList();
        });
    }
    StoreComponent.prototype.ngAfterViewInit = function () {
        console.log("success");
    };
    StoreComponent.prototype.getCategoryList = function () {
        var _this = this;
        this.isLoadingCategory = true;
        this.apiServices.getUserCategories().subscribe(function (response) {
            var _a, _b;
            _this.category = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.category) != null ? JSON.parse(JSON.stringify((_b = response.data) === null || _b === void 0 ? void 0 : _b.category)) : [];
            console.log(_this.category);
            _this.isLoadingCategory = false;
        });
    };
    StoreComponent.prototype.getModifierList = function () {
        var _this = this;
        this.isLoadingModifiers = true;
        this.apiServices.getModifiers({}).subscribe(function (response) {
            _this.modifiers = response.data != null ? JSON.parse(JSON.stringify(response.data)) : [];
            _this.isLoadingModifiers = false;
        });
    };
    StoreComponent.prototype.getProductsList = function () {
        var _this = this;
        this.isLoadingProduct = true;
        this.apiServices.getUserProducts().subscribe(function (response) {
            _this.products = response.data != null ? JSON.parse(JSON.stringify(response.data)) : [];
            _this.backup_products = _this.products;
            _this.isLoadingProduct = false;
        });
    };
    StoreComponent.prototype.onCategoryStatusChange = function (row) {
        var _this = this;
        this.changingStatus = true;
        this.isLoadingCategory = true;
        this.apiServices.updateOnlineStatus({ _id: this.category[row]._id, is_Active: !this.category[row].is_Active }).subscribe(function (response) {
            _this.isLoadingCategory = false;
            _this.category[row].is_Active = !_this.category[row].is_Active;
            _this.commonService.showAlert(response.message);
        });
    };
    StoreComponent.prototype.onModifierStatusChange = function (row) {
        var _this = this;
        this.changingStatus = true;
        this.isLoadingModifiers = true;
        this.apiServices.updateModifierStatus({ _id: this.modifiers[row]._id, is_Active: !this.modifiers[row].is_Active }).subscribe(function (response) {
            _this.isLoadingModifiers = false;
            _this.modifiers[row].is_Active = !_this.modifiers[row].is_Active;
            _this.commonService.showAlert(response.message);
        });
    };
    StoreComponent.prototype.onProductStatusChange = function (row) {
        var _this = this;
        this.changingStatus = true;
        this.isLoadingProduct = true;
        this.apiServices.updateProductsOnlineStatus({ _id: this.products[row]._id, is_Active: !this.products[row].is_Active }).subscribe(function (response) {
            _this.isLoadingProduct = false;
            _this.products[row].is_Active = !_this.products[row].is_Active;
            _this.commonService.showAlert(response.message);
        });
    };
    StoreComponent.prototype.dropTable = function (event) {
        var prevIndex = this.category.findIndex(function (d) { return d === event.item.data; });
        drag_drop_1.moveItemInArray(this.category, prevIndex, event.currentIndex);
        this.table.renderRows();
        for (var index = 0; index < this.category.length; index++) {
            this.category[index].order = index;
        }
        this.selectedRowToHighLight = -1;
        this.updateCategoryOrders();
    };
    StoreComponent.prototype.updateCategoryOrders = function () {
        var _this = this;
        this.isLoadingCategory = true;
        this.apiServices.reOrderUserCategory({ list: this.category }).subscribe(function (response) {
            _this.isLoadingCategory = false;
            _this.commonService.showAlert(response.message);
        });
    };
    StoreComponent.prototype.dropProducts = function (event) {
        var index = this.products.findIndex(function (d) { return d === event.item.data; });
        drag_drop_1.moveItemInArray(this.products, index, event.currentIndex);
        this.ProductsTable.renderRows();
        for (var index_1 = 0; index_1 < this.products.length; index_1++) {
            this.products[index_1].order = index_1;
        }
        this.updateProductOrders();
    };
    StoreComponent.prototype.updateProductOrders = function () {
        var _this = this;
        this.isLoadingProduct = true;
        this.apiServices.reOrderUserProducts({ list: this.products }).subscribe(function (response) {
            _this.isLoadingProduct = false;
            _this.commonService.showAlert(response.message);
        });
    };
    StoreComponent.prototype.onResize = function (event) {
        this.Pagewidth = window.innerWidth;
    };
    StoreComponent.prototype.openSideBar = function (field, action, row) {
        if (row === void 0) { row = -1; }
        this.isChangingStatus = true;
        this.sideMenuOpend = true;
        this.field = field;
        this.action = action;
        this.selectedRow = row;
        this.sidenav.toggle();
    };
    StoreComponent.prototype.push = function () {
        if (this.field == 'category') {
            console.log("success", this.category[this.selectedRow], this.selectedRow);
            this.commonService.UserCategorypopUpopend.emit(this.action == 'edit' ? this.category[this.selectedRow] : null);
        }
        else if (this.field == 'modifier') {
            console.log(this.selectedRow, "tsttow");
            this.commonService.ModifierCategorypopUpopend.emit(this.action == 'edit' ? this.modifiers[this.selectedRow] : null);
        }
        else {
            this.commonService.UserProductpopUpopend.emit(this.action == 'edit' ? this.products[this.selectedRow] : null);
        }
    };
    StoreComponent.prototype.loadProductForSpecificCategory = function (row, event) {
        if (this.changingStatus == false && this.sideMenuOpend == false) {
            event === null || event === void 0 ? void 0 : event.preventDefault();
            event === null || event === void 0 ? void 0 : event.stopPropagation();
            this.selectedRowToHighLight = this.selectedRowToHighLight == row ? this.sideMenuOpend ? row : -1 : row;
            if (this.selectedRowToHighLight != -1) {
                var category_list_1 = this.category;
                var selected_cat_row_1 = this.selectedRowToHighLight;
                this.products = this.backup_products.filter(function (item) {
                    return item.category == category_list_1[selected_cat_row_1]._id;
                });
            }
            else {
                this.products = this.backup_products;
            }
            console.log("Will work");
        }
        else {
            console.log("Willnot work");
        }
        this.changingStatus = false;
    };
    StoreComponent.prototype.close = function () {
        this.sideMenuClosing = true;
        this.sideMenuOpend = false;
        this.commonService.resetForms.emit();
    };
    __decorate([
        core_1.ViewChild('table')
    ], StoreComponent.prototype, "table");
    __decorate([
        core_1.ViewChild('products_table')
    ], StoreComponent.prototype, "ProductsTable");
    __decorate([
        core_1.ViewChild('sidenav')
    ], StoreComponent.prototype, "sidenav");
    __decorate([
        core_1.ViewChild('tablerow')
    ], StoreComponent.prototype, "tablerow");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], StoreComponent.prototype, "onResize");
    StoreComponent = __decorate([
        core_1.Component({
            selector: 'app-store',
            templateUrl: './store.component.html',
            styleUrls: ['./store.component.scss']
        })
    ], StoreComponent);
    return StoreComponent;
}());
exports.StoreComponent = StoreComponent;
