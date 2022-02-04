"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.TimeTrackingModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var time_tracking_routing_module_1 = require("./time-tracking-routing.module");
var time_tracking_component_1 = require("./time-tracking.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var tooltip_1 = require("@angular/material/tooltip");
var checkbox_1 = require("@angular/material/checkbox");
var kendo_angular_charts_1 = require("@progress/kendo-angular-charts");
var TimeTrackingModule = /** @class */ (function () {
    function TimeTrackingModule() {
    }
    TimeTrackingModule = __decorate([
        core_1.NgModule({
            declarations: [time_tracking_component_1.TimeTrackingComponent],
            imports: [
                common_1.CommonModule,
                kendo_angular_charts_1.ChartsModule,
                time_tracking_routing_module_1.TimeTrackingRoutingModule,
                angular_fontawesome_1.FontAwesomeModule,
                tooltip_1.MatTooltipModule,
                checkbox_1.MatCheckboxModule,
            ]
        })
    ], TimeTrackingModule);
    return TimeTrackingModule;
}());
exports.TimeTrackingModule = TimeTrackingModule;
