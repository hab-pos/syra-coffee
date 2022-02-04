"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AddInventoryOrderComponent = void 0;
var core_1 = require("@angular/core");
var account_from_component_1 = require("../../account-configurations/account-from/account-from.component");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var moment = require("moment");
var AddInventoryOrderComponent = /** @class */ (function () {
    function AddInventoryOrderComponent(common_service, apiService) {
        var _this = this;
        this.common_service = common_service;
        this.apiService = apiService;
        this.faPlus = free_solid_svg_icons_1.faPlus;
        this.faMapMarkerAlt = free_solid_svg_icons_1.faMapMarkerAlt;
        this.faChevronDown = free_solid_svg_icons_1.faChevronDown;
        this.faMinus = free_solid_svg_icons_1.faMinus;
        this.selected_branch = "";
        this.createOrderNessaryData = null;
        this.branch_list = [];
        this.selectedRow = -1;
        this.isLoading = false;
        this.close = account_from_component_1.close;
        this.products = [];
        this.totalQty = 0;
        this.today = moment().format("DD-MM-YYYY - HH : mm");
        this.branches = [];
        this.selectedValue = null;
        this.allSelected = true;
        this.common_service.CreateInvOrderFromAdminDataFetcher.subscribe(function (data) {
            _this.products = data.products.filter(function (data) {
                return Number(data.qty) != 0;
            });
            console.log(_this.products);
            _this.totalQty = _this.products.map(function (item) { return Number(item === null || item === void 0 ? void 0 : item.qty); }).reduce(function (previousValue, currentValue) {
                return Number(previousValue) + Number(currentValue);
            }, 0);
            _this.common_service.updateSyningCountEmitter.emit(_this.products);
        });
    }
    AddInventoryOrderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.get_Branches();
        this.common_service.closedSideNav.subscribe(function (_) {
            _this.branch_list = [];
            _this.products = [];
            _this.totalQty = 0;
            _this.dd.options.forEach(function (item) { return item.deselect(); });
        });
    };
    AddInventoryOrderComponent.prototype.get_Branches = function () {
        var _this = this;
        this.apiService.get_branch({}).subscribe(function (res) {
            _this.branches = res.data.branch_list;
            var item = { branch_name: "All branches", device_id: "", _id: "syra-all" };
            _this.branches.unshift(item);
            _this.selectedValue = [];
        });
    };
    AddInventoryOrderComponent.prototype.createOrder = function () {
        var _this = this;
        console.log("success", this.branch_list);
        var selected_beanch_ids = this.branch_list.map(function (data) { return data._id; });
        if (selected_beanch_ids.length == 0) {
            this.common_service.showAlert("Please select the branch");
        }
        else if (this.products.length == 0) {
            this.common_service.showAlert("Please choose the products");
        }
        else {
            var reqObj = {
                branch_list: selected_beanch_ids,
                admin_msg: this.textarea.nativeElement.value,
                data: this.products,
                number_of_products: this.products.length
            };
            this.isLoading = true;
            this.apiService.reOrderInventory(reqObj).subscribe(function (res) {
                _this.isLoading = false;
                if (res.success) {
                    _this.common_service.reOrderSuccess.emit(true);
                    _this.sidenav.toggle();
                }
                else {
                    _this.common_service.showAlert(res.message);
                }
            });
        }
    };
    AddInventoryOrderComponent.prototype.closeSidenav = function () {
        this.sidenav.toggle();
    };
    AddInventoryOrderComponent.prototype.select_branch = function (row) {
        this.selectedRow = row;
        console.log(this.branches[row]._id, this.branch_list.length);
        if (this.branches[row]._id == "syra-all") {
            if (this.branch_list.length == 0) {
                this.branch_list = this.branches.map(function (element) { return element; });
                this.branch_list.splice(0, 1); //to remove all-branches obj in list
            }
            else {
                if (this.branch_list.length == this.branches.length - 1) {
                    this.branch_list = [];
                }
                else {
                    this.branch_list = this.branches.map(function (element) { return element; });
                    this.branch_list.splice(0, 1); //to remove all-branches obj in list
                }
            }
            this.toggleAllSelection();
        }
        else {
            var index = this.branch_list.map(function (element) { return element._id; }).indexOf(this.branches[row]._id);
            if (index >= 0) {
                this.branch_list.splice(index, 1);
            }
            else {
                this.branch_list.push(this.branches[row]);
            }
            if (this.branch_list.length < this.branches.length - 1) {
                this.dd.options.forEach(function (item, index) {
                    if (index == 0) {
                        item.deselect();
                    }
                });
            }
            if (this.branch_list.length == this.branches.length - 1) {
                this.dd.options.forEach(function (item, index) {
                    if (index == 0) {
                        item.select();
                    }
                });
            }
        }
        console.log(this.branch_list);
    };
    AddInventoryOrderComponent.prototype.toggleAllSelection = function () {
        this.allSelected = this.branch_list.length == this.branches.length - 1; // to control select-unselect
        console.log(this.dd, 123);
        if (this.allSelected) {
            this.dd.options.forEach(function (item) { return item.select(); });
        }
        else {
            this.dd.options.forEach(function (item) { item.deselect(); });
        }
    };
    AddInventoryOrderComponent.prototype.add = function (row) {
        this.products[row].qty += 1;
        this.totalQty += 1;
        this.common_service.syncProductQuantity.emit(this.products[row]);
    };
    AddInventoryOrderComponent.prototype.minus = function (row) {
        if (this.products[row].qty > 0) {
            this.products[row].qty -= 1;
            this.totalQty -= 1;
            this.common_service.syncProductQuantity.emit(this.products[row]);
        }
        if (this.products[row].qty == 0) {
            this.products.splice(row, 1);
        }
    };
    AddInventoryOrderComponent.prototype.sidenavnew_open = function () {
        this.createOrderNessaryData = {
            branch_id: this.selected_branch,
            admin_msg: this.textarea.nativeElement.value
        };
        this.common_service.openInventoryForm.emit(null);
        // this.common_service.updateSyningCountEmitter.emit(this.products)
        console.log("emitted");
    };
    __decorate([
        core_1.ViewChild('dropDown')
    ], AddInventoryOrderComponent.prototype, "dd");
    __decorate([
        core_1.Input()
    ], AddInventoryOrderComponent.prototype, "sidenav");
    __decorate([
        core_1.ViewChild('textarea')
    ], AddInventoryOrderComponent.prototype, "textarea");
    AddInventoryOrderComponent = __decorate([
        core_1.Component({
            selector: 'app-add-inventory-order',
            templateUrl: './add-inventory-order.component.html',
            styleUrls: ['./add-inventory-order.component.scss']
        })
    ], AddInventoryOrderComponent);
    return AddInventoryOrderComponent;
}());
exports.AddInventoryOrderComponent = AddInventoryOrderComponent;
