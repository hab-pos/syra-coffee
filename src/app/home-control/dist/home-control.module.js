"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.HomeControlModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var home_control_routing_module_1 = require("./home-control-routing.module");
var home_control_component_1 = require("./home-control.component");
var table_1 = require("@angular/material/table");
var sidenav_1 = require("@angular/material/sidenav");
var tooltip_1 = require("@angular/material/tooltip");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var checkbox_1 = require("@angular/material/checkbox");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var forms_1 = require("@angular/forms");
var icon_1 = require("@angular/material/icon");
var featured_products_form_component_1 = require("./featured-products-form/featured-products-form.component");
var autocomplete_1 = require("@angular/material/autocomplete");
var form_field_1 = require("@angular/material/form-field");
var input_1 = require("@angular/material/input");
var events_form_component_1 = require("./events-form/events-form.component");
var datepicker_1 = require("@angular/material/datepicker");
var HomeControlModule = /** @class */ (function () {
    function HomeControlModule() {
    }
    HomeControlModule = __decorate([
        core_1.NgModule({
            declarations: [home_control_component_1.HomeControlComponent, featured_products_form_component_1.FeaturedProductsFormComponent, events_form_component_1.EventsFormComponent],
            imports: [
                common_1.CommonModule,
                home_control_routing_module_1.HomeControlRoutingModule,
                input_1.MatInputModule,
                autocomplete_1.MatAutocompleteModule,
                table_1.MatTableModule,
                datepicker_1.MatDatepickerModule,
                form_field_1.MatFormFieldModule,
                sidenav_1.MatSidenavModule,
                angular_fontawesome_1.FontAwesomeModule,
                checkbox_1.MatCheckboxModule,
                tooltip_1.MatTooltipModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                drag_drop_1.DragDropModule,
                icon_1.MatIconModule
            ]
        })
    ], HomeControlModule);
    return HomeControlModule;
}());
exports.HomeControlModule = HomeControlModule;
