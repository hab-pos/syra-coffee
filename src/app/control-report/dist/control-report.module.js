"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ControlReportModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var table_1 = require("@angular/material/table");
var tooltip_1 = require("@angular/material/tooltip");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var control_report_routing_module_1 = require("./control-report-routing.module");
var control_report_component_1 = require("./control-report.component");
var ej2_angular_charts_1 = require("@syncfusion/ej2-angular-charts");
var ej2_angular_charts_2 = require("@syncfusion/ej2-angular-charts");
var ControlReportModule = /** @class */ (function () {
    function ControlReportModule() {
    }
    ControlReportModule = __decorate([
        core_1.NgModule({
            declarations: [control_report_component_1.ControlReportComponent],
            imports: [
                common_1.CommonModule,
                control_report_routing_module_1.ControlReportRoutingModule,
                table_1.MatTableModule,
                tooltip_1.MatTooltipModule,
                angular_fontawesome_1.FontAwesomeModule,
                ej2_angular_charts_1.AccumulationChartModule,
            ],
            providers: [
                ej2_angular_charts_1.PieSeriesService,
                ej2_angular_charts_1.AccumulationTooltipService,
                ej2_angular_charts_1.AccumulationAnnotationService,
                ej2_angular_charts_2.AccumulationDataLabelService
            ],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA,
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], ControlReportModule);
    return ControlReportModule;
}());
exports.ControlReportModule = ControlReportModule;
