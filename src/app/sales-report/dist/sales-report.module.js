"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SalesReportModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var sales_report_routing_module_1 = require("./sales-report-routing.module");
var sales_report_component_1 = require("./sales-report.component");
var tabs_1 = require("@angular/material/tabs");
var table_1 = require("@angular/material/table");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var ej2_angular_charts_1 = require("@syncfusion/ej2-angular-charts");
var checkbox_1 = require("@angular/material/checkbox");
var sort_1 = require("@angular/material/sort");
var tooltip_1 = require("@angular/material/tooltip");
var chips_1 = require("@angular/material/chips");
var icon_1 = require("@angular/material/icon");
var ej2_angular_charts_2 = require("@syncfusion/ej2-angular-charts");
var forms_1 = require("@angular/forms");
var SalesReportModule = /** @class */ (function () {
    function SalesReportModule() {
    }
    SalesReportModule = __decorate([
        core_1.NgModule({
            declarations: [sales_report_component_1.SalesReportComponent],
            imports: [
                common_1.CommonModule,
                sales_report_routing_module_1.SalesReportRoutingModule,
                tabs_1.MatTabsModule,
                table_1.MatTableModule,
                angular_fontawesome_1.FontAwesomeModule,
                ej2_angular_charts_1.ChartModule,
                checkbox_1.MatCheckboxModule,
                sort_1.MatSortModule,
                tooltip_1.MatTooltipModule,
                chips_1.MatChipsModule,
                icon_1.MatIconModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule
            ],
            providers: [
                ej2_angular_charts_1.AreaSeriesService,
                ej2_angular_charts_2.LegendService,
                ej2_angular_charts_1.CategoryService,
                ej2_angular_charts_2.ZoomService,
                ej2_angular_charts_2.ScrollBarService,
                ej2_angular_charts_1.ColumnSeriesService,
                ej2_angular_charts_1.SplineAreaSeriesService,
                ej2_angular_charts_2.TooltipService
            ],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA,
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], SalesReportModule);
    return SalesReportModule;
}());
exports.SalesReportModule = SalesReportModule;
