"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InTransactionModule = exports.ProductTooltipListPipe = exports.TooltipListPipe = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var in_transaction_routing_module_1 = require("./in-transaction-routing.module");
var in_transaction_component_1 = require("./in-transaction.component");
var table_1 = require("@angular/material/table");
var tooltip_1 = require("@angular/material/tooltip");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var sidenav_1 = require("@angular/material/sidenav");
var core_2 = require("@angular/core");
var TooltipListPipe = /** @class */ (function () {
    function TooltipListPipe() {
    }
    TooltipListPipe.prototype.transform = function (discount) {
        var list = '';
        discount.forEach(function (data) {
            var symbol = data.type == "percent" ? "%" : "€";
            list += data.discount_name + " : " + data.amount + symbol;
        });
        return list;
    };
    TooltipListPipe = __decorate([
        core_2.Pipe({ name: 'tooltipList' })
    ], TooltipListPipe);
    return TooltipListPipe;
}());
exports.TooltipListPipe = TooltipListPipe;
var ProductTooltipListPipe = /** @class */ (function () {
    function ProductTooltipListPipe() {
    }
    ProductTooltipListPipe.prototype.transform = function (product) {
        var list = '';
        var symbol = product.discount_type == "percent" ? "%" : "€";
        list += product.discount_name + " : " + product.discount_price + symbol;
        return list;
    };
    ProductTooltipListPipe = __decorate([
        core_2.Pipe({ name: 'ProductTooltipList' })
    ], ProductTooltipListPipe);
    return ProductTooltipListPipe;
}());
exports.ProductTooltipListPipe = ProductTooltipListPipe;
var InTransactionModule = /** @class */ (function () {
    function InTransactionModule() {
    }
    InTransactionModule = __decorate([
        core_1.NgModule({
            declarations: [in_transaction_component_1.InTransactionComponent, TooltipListPipe],
            imports: [
                common_1.CommonModule,
                in_transaction_routing_module_1.InTransactionRoutingModule,
                table_1.MatTableModule,
                tooltip_1.MatTooltipModule,
                angular_fontawesome_1.FontAwesomeModule,
                sidenav_1.MatSidenavModule
            ]
        })
    ], InTransactionModule);
    return InTransactionModule;
}());
exports.InTransactionModule = InTransactionModule;
