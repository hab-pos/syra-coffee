"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.InventoryReportsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var inventory_reports_routing_module_1 = require("./inventory-reports-routing.module");
var inventory_reports_component_1 = require("./inventory-reports.component");
var table_1 = require("@angular/material/table");
var tooltip_1 = require("@angular/material/tooltip");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var sidenav_1 = require("@angular/material/sidenav");
var report_form_component_1 = require("./report-form/report-form.component");
var forms_1 = require("@angular/forms");
var form_field_1 = require("@angular/material/form-field");
var InventoryReportsModule = /** @class */ (function () {
    function InventoryReportsModule() {
    }
    InventoryReportsModule = __decorate([
        core_1.NgModule({
            declarations: [inventory_reports_component_1.InventoryReportsComponent, report_form_component_1.ReportFormComponent],
            imports: [
                common_1.CommonModule,
                inventory_reports_routing_module_1.InventoryReportsRoutingModule,
                table_1.MatTableModule,
                tooltip_1.MatTooltipModule,
                angular_fontawesome_1.FontAwesomeModule,
                sidenav_1.MatSidenavModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                form_field_1.MatFormFieldModule
            ]
        })
    ], InventoryReportsModule);
    return InventoryReportsModule;
}());
exports.InventoryReportsModule = InventoryReportsModule;
