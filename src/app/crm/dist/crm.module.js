"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CrmModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var crm_routing_module_1 = require("./crm-routing.module");
var crm_component_1 = require("./crm.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var tooltip_1 = require("@angular/material/tooltip");
var checkbox_1 = require("@angular/material/checkbox");
var slide_toggle_1 = require("@angular/material/slide-toggle");
var ej2_angular_charts_1 = require("@syncfusion/ej2-angular-charts");
var kendo_angular_charts_1 = require("@progress/kendo-angular-charts");
var table_1 = require("@angular/material/table");
var sort_1 = require("@angular/material/sort");
var CrmModule = /** @class */ (function () {
    function CrmModule() {
    }
    CrmModule = __decorate([
        core_1.NgModule({
            declarations: [crm_component_1.CrmComponent],
            imports: [
                common_1.CommonModule,
                crm_routing_module_1.CrmRoutingModule,
                angular_fontawesome_1.FontAwesomeModule,
                tooltip_1.MatTooltipModule,
                checkbox_1.MatCheckboxModule,
                slide_toggle_1.MatSlideToggleModule,
                ej2_angular_charts_1.ChartModule,
                kendo_angular_charts_1.ChartsModule,
                table_1.MatTableModule,
                sort_1.MatSortModule
            ],
            providers: [
                ej2_angular_charts_1.AreaSeriesService,
                ej2_angular_charts_1.CategoryService,
                ej2_angular_charts_1.ColumnSeriesService,
                ej2_angular_charts_1.StackingColumnSeriesService,
                ej2_angular_charts_1.TooltipService,
                ej2_angular_charts_1.ZoomService
            ]
        })
    ], CrmModule);
    return CrmModule;
}());
exports.CrmModule = CrmModule;
