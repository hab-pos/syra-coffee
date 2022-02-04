"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.POSManagementComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var POSManagementComponent = /** @class */ (function () {
    function POSManagementComponent(router, activeRoute, apiServices, commonService) {
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
        this.selectedId = "";
        this.selectedCategoryRow = -1;
        this.category = [];
        this.products = [];
        this.sideMenuClosing = true;
        this.isChangingStatus = false;
        this.allProducts = []; //for filtering purpose
        this.isLoadingProduct = false;
        this.isLoadingCatelogy = false;
        this.display_col_category = ["name_color", "action"];
        this.masterFilterId = null;
        this.Pagewidth = window.innerWidth;
    }
    POSManagementComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var _a;
        this.paramsFromParent = this.activeRoute.snapshot.paramMap;
        if (this.paramsFromParent.get("toAddCategory")) {
            this.openSideBar('category', 'add');
        }
        this.listenCategory();
        var branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : [];
        console.log(branchSelected);
        var selectedString = branchSelected === null || branchSelected === void 0 ? void 0 : branchSelected.map(function (element) { return element._id; });
        if ((branchSelected === null || branchSelected === void 0 ? void 0 : branchSelected.length) == 1) {
            this.masterFilterId = (_a = branchSelected[0]) === null || _a === void 0 ? void 0 : _a._id;
        }
        else {
            this.masterFilterId = null;
        }
        if (branchSelected == null || selectedString.length == 0) {
            this.get_categories();
            this.get_products();
        }
        else {
            this.get_branch_products(selectedString);
            this.get_branch_categories(selectedString);
        }
        this.commonService.select_branch.subscribe(function (response) {
            var _a;
            console.log("response?.length == 1", (response === null || response === void 0 ? void 0 : response.length) == 1, "response?.length == 1", response);
            if ((response === null || response === void 0 ? void 0 : response.length) == 1) {
                _this.masterFilterId = (_a = response[0]) === null || _a === void 0 ? void 0 : _a._id;
            }
            else {
                _this.masterFilterId = null;
            }
            var array = response.map(function (element) { return element._id; });
            _this.selectedCategoryRow = -1;
            if (array.length == 0) {
                _this.get_categories();
                _this.get_products();
            }
            else {
                _this.get_branch_products(array);
                _this.get_branch_categories(array);
            }
        });
    };
    POSManagementComponent.prototype.get_branch_products = function (branch_list) {
        var _this = this;
        this.isLoadingProduct = true;
        this.apiServices.get_branch_products({ branch_list: branch_list }).subscribe(function (response) {
            _this.isLoadingProduct = false;
            if (response.success) {
                _this.allProducts = response.data.products;
                _this.products = response.data.products;
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    POSManagementComponent.prototype.get_branch_categories = function (branch_list) {
        var _this = this;
        this.isLoadingCatelogy = true;
        this.apiServices.get_branch_category({ branch_list: branch_list }).subscribe(function (response) {
            _this.isLoadingCatelogy = false;
            if (response.success) {
                _this.category = response.data.category;
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    POSManagementComponent.prototype.listenCategory = function () {
        var _this = this;
        this.commonService.commonEmitter.subscribe(function (_) {
            var branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
            var selectedString = branchSelected === null || branchSelected === void 0 ? void 0 : branchSelected.map(function (element) { return element._id; });
            if (branchSelected == null || selectedString.length == 0) {
                _this.get_categories();
                _this.get_products();
            }
            else {
                _this.get_branch_products(selectedString);
                _this.get_branch_categories(selectedString);
            }
        });
    };
    POSManagementComponent.prototype.get_categories = function () {
        var _this = this;
        this.isLoadingCatelogy = true;
        this.apiServices.getCategories().subscribe(function (response) {
            _this.isLoadingCatelogy = false;
            if (response.success) {
                _this.category = response.data.category;
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    POSManagementComponent.prototype.get_products = function () {
        var _this = this;
        this.isLoadingProduct = true;
        this.apiServices.getProducts().subscribe(function (response) {
            _this.isLoadingProduct = false;
            if (response.success) {
                console.log(_this.selectedCategoryRow, "selected");
                if (_this.selectedCategoryRow >= 0) {
                    _this.loadProductForSpecificCategory(_this.selectedCategoryRow, null);
                }
                else {
                    _this.allProducts = response.data.products;
                    _this.products = response.data.products;
                }
            }
            else {
                _this.commonService.showAlert(response.message);
            }
        });
    };
    POSManagementComponent.prototype.onCategoryStatusChange = function (row) {
        var _this = this;
        var _a;
        this.isChangingStatus = true;
        this.category[row].is_Active = !this.category[row].is_Active;
        this.category[row].id = this.category[row]._id;
        this.category[row].available_branches = Array.isArray(this.category[row].available_branches) ? (_a = this.category[row].available_branches) === null || _a === void 0 ? void 0 : _a.join(",") : this.category[row].available_branches;
        this.isLoadingCatelogy = true;
        this.apiServices.updateCategory(this.category[row]).subscribe(function (res) {
            _this.isLoadingCatelogy = false;
            _this.commonService.showAlert(res.message);
        });
    };
    POSManagementComponent.prototype.onProductStatusChange = function (row) {
        var _this = this;
        var _a, _b;
        this.products[row].is_Active = !this.products[row].is_Active;
        this.products[row].id = this.products[row]._id;
        this.products[row].categories = Array.isArray(this.products[row].categories) ? (_a = this.products[row].categories) === null || _a === void 0 ? void 0 : _a.join(",") : this.products[row].categories;
        this.products[row].available_branches = Array.isArray(this.products[row].available_branches) ? (_b = this.products[row].available_branches) === null || _b === void 0 ? void 0 : _b.join(",") : this.products[row].available_branches;
        console.log(this.products[row]);
        this.isLoadingProduct = true;
        this.apiServices.updateProduct(this.products[row]).subscribe(function (res) {
            _this.isLoadingProduct = false;
            _this.commonService.showAlert(res.message);
        });
    };
    POSManagementComponent.prototype.dropTable = function (event) {
        var _this = this;
        var branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        if ((branchSelected === null || branchSelected === void 0 ? void 0 : branchSelected.length) == 1) {
            var prevIndex = this.category.findIndex(function (d) { return d === event.item.data; });
            drag_drop_1.moveItemInArray(this.category, prevIndex, event.currentIndex);
            this.table.renderRows();
            var order_1 = [];
            this.category.forEach(function (element, index) {
                var item = new Object();
                item.id = element._id;
                item.order = index + 1;
                order_1.push(item);
            });
            this.isLoadingCatelogy = true;
            var b_id = branchSelected[0]._id;
            b_id = b_id == "syra-all" ? null : b_id;
            this.apiServices.update_category_order({ order: order_1, branch_id: b_id }).subscribe(function (res) {
                _this.isLoadingCatelogy = false;
                _this.commonService.showAlert(res.message);
            });
            if (this.selectedCategoryRow == prevIndex) {
                this.selectedCategoryRow = event.currentIndex;
            }
            console.log(this.selectedCategoryRow, "row");
        }
        else {
            this.commonService.showAlert("Choose the any one branch to reorder");
        }
    };
    POSManagementComponent.prototype.dropProducts = function (event) {
        var _this = this;
        var branchSelected = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
        if ((branchSelected === null || branchSelected === void 0 ? void 0 : branchSelected.length) == 1) {
            var index = this.products.findIndex(function (d) { return d === event.item.data; });
            drag_drop_1.moveItemInArray(this.products, index, event.currentIndex);
            this.ProductsTable.renderRows();
            var order_2 = [];
            this.products.forEach(function (element, index) {
                var item = new Object();
                item.id = element._id;
                item.name = element.product_name;
                item.order = index + 1;
                order_2.push(item);
            });
            this.isLoadingProduct = true;
            var branchSelected_1 = localStorage.getItem('selectedBranch') ? JSON.parse(localStorage.getItem('selectedBranch') || "") : null;
            var b_id = branchSelected_1[0]._id;
            b_id = b_id == "syra-all" ? null : b_id;
            this.apiServices.update_product_order({ order: order_2, branch_id: b_id }).subscribe(function (res) {
                _this.isLoadingProduct = false;
                _this.commonService.showAlert(res.message);
            });
        }
        else {
            this.commonService.showAlert("Choose any one branch to reorder");
        }
    };
    POSManagementComponent.prototype.onResize = function (event) {
        this.Pagewidth = window.innerWidth;
    };
    POSManagementComponent.prototype.openSideBar = function (field, action, row) {
        if (row === void 0) { row = -1; }
        this.isChangingStatus = true;
        this.field = field;
        this.action = action;
        this.selectedId = field == "category" ? (row >= 0) ? this.category[row]._id : null : (row >= 0) ? this.products[row]._id : null;
        this.sidenav.toggle();
    };
    POSManagementComponent.prototype.push = function () {
        if (this.field == 'category') {
            var category_id = this.action == "edit" ? this.selectedId : null;
            this.commonService.categoryEmitter.emit(category_id);
        }
        else {
            var product_id = this.action == "edit" ? this.selectedId : null;
            this.commonService.productEmitter.emit(product_id);
        }
    };
    POSManagementComponent.prototype.loadProductForSpecificCategory = function (row, event) {
        var _this = this;
        event === null || event === void 0 ? void 0 : event.preventDefault();
        event === null || event === void 0 ? void 0 : event.stopPropagation();
        if (!this.isChangingStatus) {
            if (this.selectedCategoryRow == row) {
                this.selectedCategoryRow = -1;
                this.products = this.allProducts;
            }
            else {
                this.selectedCategoryRow = row;
                this.products = this.allProducts.filter(function (product) {
                    return product.categories.includes(_this.category[row]._id);
                });
                console.log(this.products);
            }
        }
        this.isChangingStatus = false;
    };
    // @HostListener('document:click', ['$event'])
    // clickout(event : any) {
    //   if(!this.sideMenuClosing){
    //     this.selectedCategoryRow = -1
    //     this.products = this.allProducts
    //     this.sideMenuClosing = false
    //   }
    // }
    POSManagementComponent.prototype.close = function () {
        this.sideMenuClosing = true;
        this.commonService.resetForms.emit();
    };
    __decorate([
        core_1.ViewChild('table')
    ], POSManagementComponent.prototype, "table");
    __decorate([
        core_1.ViewChild('products_table')
    ], POSManagementComponent.prototype, "ProductsTable");
    __decorate([
        core_1.ViewChild('sidenav')
    ], POSManagementComponent.prototype, "sidenav");
    __decorate([
        core_1.ViewChild('tablerow')
    ], POSManagementComponent.prototype, "tablerow");
    __decorate([
        core_1.HostListener('window:resize', ['$event'])
    ], POSManagementComponent.prototype, "onResize");
    POSManagementComponent = __decorate([
        core_1.Component({
            selector: 'app-pos-management',
            templateUrl: './pos-management.component.html',
            styleUrls: ['./pos-management.component.scss']
        })
    ], POSManagementComponent);
    return POSManagementComponent;
}());
exports.POSManagementComponent = POSManagementComponent;
