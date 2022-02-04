"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AccountConfigurationsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var account_configurations_routing_module_1 = require("./account-configurations-routing.module");
var account_configurations_component_1 = require("./account-configurations.component");
var table_1 = require("@angular/material/table");
var sidenav_1 = require("@angular/material/sidenav");
var account_from_component_1 = require("./account-from/account-from.component");
var tooltip_1 = require("@angular/material/tooltip");
var forms_1 = require("@angular/forms");
var snack_bar_1 = require("@angular/material/snack-bar");
var checkbox_1 = require("@angular/material/checkbox");
var form_field_1 = require("@angular/material/form-field");
var select_1 = require("@angular/material/select");
var AccountConfigurationsModule = /** @class */ (function () {
    function AccountConfigurationsModule() {
    }
    AccountConfigurationsModule = __decorate([
        core_1.NgModule({
            declarations: [account_configurations_component_1.AccountConfigurationsComponent, account_from_component_1.AccountFromComponent],
            imports: [
                common_1.CommonModule,
                account_configurations_routing_module_1.AccountConfigurationsRoutingModule,
                angular_fontawesome_1.FontAwesomeModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                table_1.MatTableModule,
                tooltip_1.MatTooltipModule,
                sidenav_1.MatSidenavModule,
                snack_bar_1.MatSnackBarModule,
                checkbox_1.MatCheckboxModule,
                form_field_1.MatFormFieldModule,
                select_1.MatSelectModule
            ],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA,
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], AccountConfigurationsModule);
    return AccountConfigurationsModule;
}());
exports.AccountConfigurationsModule = AccountConfigurationsModule;
