"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OutTransactionModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var out_transaction_routing_module_1 = require("./out-transaction-routing.module");
var out_transaction_component_1 = require("./out-transaction.component");
var table_1 = require("@angular/material/table");
var tooltip_1 = require("@angular/material/tooltip");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var sidenav_1 = require("@angular/material/sidenav");
var OutTransactionModule = /** @class */ (function () {
    function OutTransactionModule() {
    }
    OutTransactionModule = __decorate([
        core_1.NgModule({
            declarations: [out_transaction_component_1.OutTransactionComponent],
            imports: [
                common_1.CommonModule,
                out_transaction_routing_module_1.OutTransactionRoutingModule,
                table_1.MatTableModule,
                sidenav_1.MatSidenavModule,
                angular_fontawesome_1.FontAwesomeModule,
                tooltip_1.MatTooltipModule
            ]
        })
    ], OutTransactionModule);
    return OutTransactionModule;
}());
exports.OutTransactionModule = OutTransactionModule;
