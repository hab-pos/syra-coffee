"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.minuss = exports.plus = exports.InventoryOrderFormComponent = void 0;
var core_1 = require("@angular/core");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var account_from_component_1 = require("../../account-configurations/account-from/account-from.component");
var FileSaver = require('file-saver');
var InventoryOrderFormComponent = /** @class */ (function () {
    function InventoryOrderFormComponent(common_service, apiServices) {
        this.common_service = common_service;
        this.apiServices = apiServices;
        this.close = account_from_component_1.close;
        this.plus = exports.plus;
        this.minuss = exports.minuss;
        this.faPlusCircle = free_solid_svg_icons_1.faPlus;
        this.faMinusCircle = free_solid_svg_icons_1.faMinus;
        this.isLoadingAccept = false;
        this.isLoadingDecline = false;
        this.isLoadingSavePdf = false;
        this.isMarkDeliverdLoding = false;
        this.table = [
            {
                refer_name: 'string',
                product_name: 'string',
                quantity: 'number',
                unit: 'string'
            }
        ];
        this.order_info = new Object();
        this.products = [];
        this.totalQty = 0;
    }
    InventoryOrderFormComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.common_service.closedSideNav.subscribe(function (_) {
            _this.order_info = null;
            _this.products = [];
            _this.totalQty = 0;
        });
        this.common_service.inventoryOrder.subscribe(function (response) {
            var _a, _b;
            _this.totalQty = 0;
            _this.order_info = response;
            _this.products = (_a = _this.order_info) === null || _a === void 0 ? void 0 : _a.ordered_items;
            (_b = _this.products) === null || _b === void 0 ? void 0 : _b.forEach(function (element) {
                _this.totalQty += element.qty;
            });
        });
        this.common_service.updateInventoryOrderFrom.subscribe(function (data) {
            var _a;
            _this.order_info.ordered_items = data;
            _this.totalQty = 0;
            _this.products = data;
            (_a = _this.products) === null || _a === void 0 ? void 0 : _a.forEach(function (element) {
                _this.totalQty += element.qty;
            });
        });
    };
    InventoryOrderFormComponent.prototype.add = function (row) {
        if (this.order_info.status != "approved" && this.order_info.status != "delivered") {
            this.products[row].qty += 1;
            this.totalQty += 1;
        }
    };
    InventoryOrderFormComponent.prototype.minus = function (row) {
        if (this.order_info.status != "approved" && this.order_info.status != "delivered") {
            if (this.products[row].qty > 0) {
                if (this.products[row].qty == 1) {
                    if (this.products.length > 1) {
                        this.products.splice(row, 1);
                        this.totalQty -= 1;
                    }
                    else {
                        this.common_service.showAlert("You should have atleaset one product!");
                    }
                }
                else {
                    this.products[row].qty -= 1;
                    this.totalQty -= 1;
                }
            }
        }
    };
    InventoryOrderFormComponent.prototype.declineAction = function () {
        var _this = this;
        this.isLoadingDecline = true;
        var request = new Object();
        request.id = this.order_info._id;
        request.status = "declined";
        request.admin_msg = this.textarea.nativeElement.value;
        this.apiServices.updateInventoryOrder(request).subscribe(function (res) {
            _this.isLoadingDecline = false;
            _this.common_service.showAlert(res.message);
            if (res.success) {
                _this.common_service.commonEmitter.emit();
                _this.sidenav.close();
            }
        });
    };
    InventoryOrderFormComponent.prototype.acceptAction = function () {
        var _this = this;
        if (this.products.length == 0) {
            this.common_service.showAlert("Please choose products!");
        }
        else {
            this.isLoadingAccept = true;
            var request = new Object();
            request.id = this.order_info._id;
            request.status = "approved";
            request.ordered_items = this.products;
            request.admin_msg = this.textarea.nativeElement.value;
            this.apiServices.updateInventoryOrder(request).subscribe(function (res) {
                _this.isLoadingAccept = false;
                _this.common_service.showAlert(res.message);
                if (res.success) {
                    _this.common_service.commonEmitter.emit();
                    _this.sidenav.close();
                }
            });
        }
    };
    InventoryOrderFormComponent.prototype.savePdf = function () {
        var _this = this;
        this.isLoadingSavePdf = true;
        this.apiServices.downloadInventoryOrder({ orderInfo: this.order_info, products: this.products }).subscribe(function (res) {
            _this.isLoadingSavePdf = false;
            var url = res.data.url;
            console.log(url);
            FileSaver.saveAs(url, res.data.title + ".pdf");
        });
    };
    InventoryOrderFormComponent.prototype.closeSidenav = function () {
        this.order_info = null;
        this.products = null;
        this.sidenav.close();
    };
    InventoryOrderFormComponent.prototype.open_new_nav = function () {
        this.sidenav.toggle();
    };
    InventoryOrderFormComponent.prototype.sidenavnew_open = function () {
        this.common_service.openInventoryForm.emit({ data: this.order_info });
        console.log("emitted");
    };
    InventoryOrderFormComponent.prototype.updateOrderAsDelivered = function () {
        var _this = this;
        var _a;
        this.isMarkDeliverdLoding = true;
        var reqObj = {
            "id": this.order_info._id,
            "received_by": null,
            "reason": null,
            "mode_of_payment": "cash",
            "invoice_number": "",
            "status": "delivered",
            "ordered_items": (_a = this.order_info) === null || _a === void 0 ? void 0 : _a.ordered_items
        };
        this.apiServices.updateInventoryOrder(reqObj).subscribe(function (res) {
            _this.common_service.showAlert(res.message);
            _this.isMarkDeliverdLoding = false;
            if (res.success) {
                _this.sidenav.toggle();
                _this.common_service.commonEmitter.emit();
            }
        });
    };
    __decorate([
        core_1.ViewChild("textarea")
    ], InventoryOrderFormComponent.prototype, "textarea");
    __decorate([
        core_1.Input()
    ], InventoryOrderFormComponent.prototype, "sidenav");
    __decorate([
        core_1.Input()
    ], InventoryOrderFormComponent.prototype, "field");
    __decorate([
        core_1.Input()
    ], InventoryOrderFormComponent.prototype, "status");
    __decorate([
        core_1.Input()
    ], InventoryOrderFormComponent.prototype, "row");
    __decorate([
        core_1.ViewChild('tableView')
    ], InventoryOrderFormComponent.prototype, "tableView");
    InventoryOrderFormComponent = __decorate([
        core_1.Component({
            selector: 'app-inventory-order-form',
            templateUrl: './inventory-order-form.component.html',
            styleUrls: ['./inventory-order-form.component.scss']
        })
    ], InventoryOrderFormComponent);
    return InventoryOrderFormComponent;
}());
exports.InventoryOrderFormComponent = InventoryOrderFormComponent;
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
