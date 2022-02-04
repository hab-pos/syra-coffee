"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.CatelougeConfigurationsModule = exports.TooltipListPipe = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var catelouge_configurations_routing_module_1 = require("./catelouge-configurations-routing.module");
var catelouge_configurations_component_1 = require("./catelouge-configurations.component");
var table_1 = require("@angular/material/table");
var sidenav_1 = require("@angular/material/sidenav");
var tooltip_1 = require("@angular/material/tooltip");
var core_2 = require("@angular/core");
var catelouge_form_component_1 = require("./catelouge-form/catelouge-form.component");
var checkbox_1 = require("@angular/material/checkbox");
var input_1 = require("@angular/material/input");
var form_field_1 = require("@angular/material/form-field");
var select_1 = require("@angular/material/select");
var autocomplete_1 = require("@angular/material/autocomplete");
var forms_1 = require("@angular/forms");
var sort_1 = require("@angular/material/sort");
var TooltipListPipe = /** @class */ (function () {
    function TooltipListPipe() {
    }
    TooltipListPipe.prototype.transform = function (lines) {
        var list = '';
        lines.forEach(function (line) {
            list += '• ' + line + '\n';
        });
        return list;
    };
    TooltipListPipe = __decorate([
        core_2.Pipe({ name: 'tooltipList' })
    ], TooltipListPipe);
    return TooltipListPipe;
}());
exports.TooltipListPipe = TooltipListPipe;
var CatelougeConfigurationsModule = /** @class */ (function () {
    function CatelougeConfigurationsModule() {
    }
    CatelougeConfigurationsModule = __decorate([
        core_1.NgModule({
            declarations: [catelouge_configurations_component_1.CatelougeConfigurationsComponent, TooltipListPipe, catelouge_form_component_1.CatelougeFormComponent],
            imports: [
                common_1.CommonModule,
                catelouge_configurations_routing_module_1.CatelougeConfigurationsRoutingModule,
                table_1.MatTableModule,
                sidenav_1.MatSidenavModule,
                angular_fontawesome_1.FontAwesomeModule,
                checkbox_1.MatCheckboxModule,
                form_field_1.MatFormFieldModule,
                input_1.MatInputModule,
                select_1.MatSelectModule,
                autocomplete_1.MatAutocompleteModule,
                tooltip_1.MatTooltipModule,
                forms_1.FormsModule,
                sort_1.MatSortModule,
                forms_1.ReactiveFormsModule
            ],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA,
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], CatelougeConfigurationsModule);
    return CatelougeConfigurationsModule;
}());
exports.CatelougeConfigurationsModule = CatelougeConfigurationsModule;
