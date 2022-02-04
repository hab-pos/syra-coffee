"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.minuss = exports.plus = exports.close = exports.AddproductComponentComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var AddproductComponentComponent = /** @class */ (function () {
    function AddproductComponentComponent(common_service, apiServices) {
        var _this = this;
        this.common_service = common_service;
        this.apiServices = apiServices;
        this.faCaretDown = free_solid_svg_icons_1.faCaretDown;
        this.faTimes = free_solid_svg_icons_1.faTimes;
        this.isLoading = false;
        this.close = exports.close;
        this.faPlusCircle = free_solid_svg_icons_1.faPlus;
        this.faMinusCircle = free_solid_svg_icons_1.faMinus;
        this.faSearch = free_solid_svg_icons_1.faSearch;
        this.plus = exports.plus;
        this.minuss = exports.minuss;
        this.products = [];
        this.products_backup = [];
        this.products_to_order = [];
        this.searchOptionEnabled = false;
        this.orderDetails = null;
        this.orderedProductsFromAddInventory = [];
        this.loadTeams = function () {
            // this here refers to the function
        };
        this.common_service.syncProductQuantity.subscribe(function (data) {
            var index = _this.products.findIndex(function (x) { return x._id == data.inventory_id; });
            _this.products[index].quantity = data.qty;
            console.log(data, _this.products[index]);
        });
    }
    AddproductComponentComponent.prototype.ngOnInit = function () {
        this.get_catelouges();
    };
    AddproductComponentComponent.prototype.ngOnDestroy = function () {
    };
    AddproductComponentComponent.prototype.ngAfterViewInit = function () {
    };
    AddproductComponentComponent.prototype.searchViewUpdate = function () {
        this.searchOptionEnabled = !this.searchOptionEnabled;
        if (!this.searchOptionEnabled) {
            this.products = this.products_backup;
        }
    };
    AddproductComponentComponent.prototype.sidenav_close = function () {
        this.common_service.closeInventoryForm.emit();
        console.log("emitted for close");
    };
    AddproductComponentComponent.prototype.add = function (row) {
        this.products[row].quantity++;
        var index = this.products_to_order.map(function (item) { return item.refernce; }).indexOf(this.products[row].reference);
        if (index == -1) {
            this.products_to_order.push({ inventory_id: this.products[row]._id, refernce: this.products[row].reference, unit: this.products[row].unit, inventory_name: this.products[row].inventory_name, qty: this.products[row].quantity, price: this.products[row].quantity * Number(this.products[row].price), unit_price: this.products[row].price });
        }
        else {
            this.products_to_order[index].qty += 1;
            this.products_to_order[index].price = this.products[row].price * this.products_to_order[index].qty;
        }
        this.common_service.CreateInvOrderFromAdminDataFetcher.emit({ products: this.products_to_order });
    };
    AddproductComponentComponent.prototype.minus = function (row) {
        var index = this.products_to_order.map(function (item) { return item.refernce; }).indexOf(this.products[row].reference);
        if (this.products[row].quantity > 0) {
            this.products[row].quantity -= 1;
            this.products_to_order[index].qty -= 1;
            this.products_to_order[index].price = this.products[row].price * this.products_to_order[index].qty;
        }
        else {
            if (index >= 0) {
                this.products_to_order.splice(index, 1);
            }
        }
        this.common_service.CreateInvOrderFromAdminDataFetcher.emit({ products: this.products_to_order });
    };
    AddproductComponentComponent.prototype.get_catelouges = function (device_id, list) {
        var _this = this;
        if (device_id === void 0) { device_id = null; }
        if (list === void 0) { list = null; }
        this.apiServices.getCatelouge({ branch_list: list }).subscribe(function (response) {
            if (response.success) {
                if (_this.orderDetails != null) {
                    var ordered_refs_1 = _this.orderDetails.data.ordered_items.map(function (item) { return item.refernce; });
                    console.log(ordered_refs_1, "test");
                    _this.products = response.data.inventories.filter(function (element) {
                        return !ordered_refs_1.includes(element.reference);
                    });
                }
                else {
                    _this.products = response.data.inventories;
                    var refs = _this.products.map(function (item) { return item._id; });
                    for (var index = 0; index < _this.orderedProductsFromAddInventory.length; index++) {
                        var element = _this.orderedProductsFromAddInventory[index];
                        var indexPdt = refs.indexOf(element.inventory_id);
                        _this.products[indexPdt].quantity = element.qty;
                    }
                }
                _this.products_backup = _this.products;
                _this.products_to_order = _this.products.filter(function (data) {
                    return data.quantity > 0;
                });
                _this.generateSelectedProducts();
            }
            else {
                _this.common_service.showAlert(response.message);
            }
        });
    };
    AddproductComponentComponent.prototype.generateSelectedProducts = function () {
        for (var index = 0; index < this.products_to_order.length; index++) {
            this.products_to_order[index].qty = this.products_to_order[index].quantity;
            this.products_to_order[index].inventory_id = this.products_to_order[index]._id;
            this.products_to_order[index].refernce = this.products_to_order[index].reference;
        }
    };
    AddproductComponentComponent.prototype.search = function (searchString) {
        console.log(searchString);
        if (searchString == "") {
            this.products = this.products_backup;
        }
        else {
            this.products = this.products_backup.filter(function (data) {
                return data.inventory_name.toLowerCase().includes(searchString.toLowerCase());
            });
        }
    };
    AddproductComponentComponent.prototype.addOrder = function () {
        var _this = this;
        this.isLoading = true;
        this.products_to_order = this.products_to_order.concat(this.orderDetails.data.ordered_items);
        this.apiServices.reOrderInventory({ data: this.products_to_order, id: this.orderDetails.data._id }).subscribe(function (response) {
            if (response.success) {
                _this.isLoading = false;
                _this.sidenav_close();
                _this.common_service.updateInventoryOrderFrom.emit(_this.products_to_order);
                _this.common_service.commonEmitter.emit(true);
            }
            else {
                _this.common_service.showAlert(response.message);
            }
        });
        console.log(JSON.parse(JSON.stringify(this.products_to_order)));
    };
    __decorate([
        core_1.Input()
    ], AddproductComponentComponent.prototype, "orderDetails");
    __decorate([
        core_1.Input()
    ], AddproductComponentComponent.prototype, "orderedProductsFromAddInventory");
    __decorate([
        core_1.Input()
    ], AddproductComponentComponent.prototype, "sidenav");
    AddproductComponentComponent = __decorate([
        core_1.Component({
            selector: 'app-addproduct-component',
            templateUrl: './addproduct-component.component.html',
            styleUrls: ['./addproduct-component.component.scss']
        })
    ], AddproductComponentComponent);
    return AddproductComponentComponent;
}());
exports.AddproductComponentComponent = AddproductComponentComponent;
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
exports.plus = {
    prefix: 'fa',
    iconName: 'line',
    icon: [
        512,
        512,
        [],
        '',
        "M0 0h24v24H0z M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z",
    ]
};
exports.minuss = {
    prefix: 'fa',
    iconName: 'line',
    icon: [
        512,
        512,
        [],
        '',
        "M0 0h24v24H0z M19 13H5v-2h14v2z",
    ]
};
