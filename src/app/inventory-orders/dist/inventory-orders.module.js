"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InventoryOrdersModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var inventory_orders_routing_module_1 = require("./inventory-orders-routing.module");
var inventory_orders_component_1 = require("./inventory-orders.component");
var table_1 = require("@angular/material/table");
var tooltip_1 = require("@angular/material/tooltip");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var sidenav_1 = require("@angular/material/sidenav");
var inventory_order_form_component_1 = require("./inventory-order-form/inventory-order-form.component");
var ngx_print_1 = require("ngx-print");
var icon_1 = require("@angular/material/icon");
var addproduct_component_component_1 = require("./addproduct-component/addproduct-component.component");
var checkbox_1 = require("@angular/material/checkbox");
var add_inventory_order_component_1 = require("./add-inventory-order/add-inventory-order.component");
var form_field_1 = require("@angular/material/form-field");
var select_1 = require("@angular/material/select");
var InventoryOrdersModule = /** @class */ (function () {
    function InventoryOrdersModule() {
    }
    InventoryOrdersModule = __decorate([
        core_1.NgModule({
            declarations: [inventory_orders_component_1.InventoryOrdersComponent, inventory_order_form_component_1.InventoryOrderFormComponent, addproduct_component_component_1.AddproductComponentComponent, add_inventory_order_component_1.AddInventoryOrderComponent],
            imports: [
                common_1.CommonModule,
                inventory_orders_routing_module_1.InventoryOrdersRoutingModule,
                table_1.MatTableModule,
                ngx_print_1.NgxPrintModule,
                tooltip_1.MatTooltipModule,
                angular_fontawesome_1.FontAwesomeModule,
                sidenav_1.MatSidenavModule,
                icon_1.MatIconModule,
                checkbox_1.MatCheckboxModule,
                form_field_1.MatFormFieldModule,
                select_1.MatSelectModule
            ]
        })
    ], InventoryOrdersModule);
    return InventoryOrdersModule;
}());
exports.InventoryOrdersModule = InventoryOrdersModule;
