"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SetupConfigurationsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var setup_configurations_routing_module_1 = require("./setup-configurations-routing.module");
var setup_configurations_component_1 = require("./setup-configurations.component");
var table_1 = require("@angular/material/table");
var sidenav_1 = require("@angular/material/sidenav");
var tooltip_1 = require("@angular/material/tooltip");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var setup_form_component_1 = require("./setup-form/setup-form.component");
var checkbox_1 = require("@angular/material/checkbox");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var forms_1 = require("@angular/forms");
var SetupConfigurationsModule = /** @class */ (function () {
    function SetupConfigurationsModule() {
    }
    SetupConfigurationsModule = __decorate([
        core_1.NgModule({
            declarations: [setup_configurations_component_1.SetupConfigurationsComponent, setup_form_component_1.SetupFormComponent],
            imports: [
                common_1.CommonModule,
                setup_configurations_routing_module_1.SetupConfigurationsRoutingModule,
                table_1.MatTableModule,
                sidenav_1.MatSidenavModule,
                angular_fontawesome_1.FontAwesomeModule,
                checkbox_1.MatCheckboxModule,
                tooltip_1.MatTooltipModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                drag_drop_1.DragDropModule
            ]
        })
    ], SetupConfigurationsModule);
    return SetupConfigurationsModule;
}());
exports.SetupConfigurationsModule = SetupConfigurationsModule;
