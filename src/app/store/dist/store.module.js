"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.StoreModule = void 0;
var store_routing_module_1 = require("./store-routing.module");
var store_component_1 = require("./store.component");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var table_1 = require("@angular/material/table");
var sidenav_1 = require("@angular/material/sidenav");
var tooltip_1 = require("@angular/material/tooltip");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var slide_toggle_1 = require("@angular/material/slide-toggle");
var drag_drop_1 = require("@angular/cdk/drag-drop");
var checkbox_1 = require("@angular/material/checkbox");
var forms_1 = require("@angular/forms");
var form_field_1 = require("@angular/material/form-field");
var select_1 = require("@angular/material/select");
var icon_1 = require("@angular/material/icon");
var StoreModule = /** @class */ (function () {
    function StoreModule() {
    }
    StoreModule = __decorate([
        core_1.NgModule({
            declarations: [store_component_1.StoreComponent],
            imports: [
                common_1.CommonModule,
                store_routing_module_1.StoreRoutingModule,
                table_1.MatTableModule,
                sidenav_1.MatSidenavModule,
                tooltip_1.MatTooltipModule,
                angular_fontawesome_1.FontAwesomeModule,
                slide_toggle_1.MatSlideToggleModule,
                drag_drop_1.DragDropModule,
                checkbox_1.MatCheckboxModule,
                form_field_1.MatFormFieldModule,
                select_1.MatSelectModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                icon_1.MatIconModule
            ]
        })
    ], StoreModule);
    return StoreModule;
}());
exports.StoreModule = StoreModule;
