"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var side_bar_component_1 = require("./side-bar/side-bar.component");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var app_header_component_1 = require("./app-header/app-header.component");
var animations_1 = require("@angular/platform-browser/animations");
var datepicker_1 = require("@angular/material/datepicker");
var core_2 = require("@angular/material/core");
//import { MatInputModule } from '@angular/material/input';
var form_field_1 = require("@angular/material/form-field");
var select_1 = require("@angular/material/select");
var progress_spinner_1 = require("@angular/material/progress-spinner");
var http_1 = require("@angular/common/http");
var ngx_spinner_1 = require("ngx-spinner");
var api_services_1 = require("./APIServices/api-services");
var AuthGuard_1 = require("./AuthGuard");
var snack_bar_1 = require("@angular/material/snack-bar");
var forms_1 = require("@angular/forms");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                side_bar_component_1.SideBarComponent,
                app_header_component_1.AppHeaderComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                angular_fontawesome_1.FontAwesomeModule,
                ng_bootstrap_1.NgbModule,
                animations_1.BrowserAnimationsModule,
                datepicker_1.MatDatepickerModule,
                core_2.MatNativeDateModule,
                form_field_1.MatFormFieldModule,
                select_1.MatSelectModule,
                progress_spinner_1.MatProgressSpinnerModule,
                http_1.HttpClientModule,
                ngx_spinner_1.NgxSpinnerModule,
                snack_bar_1.MatSnackBarModule,
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule
            ],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA,
                core_1.NO_ERRORS_SCHEMA
            ],
            providers: [api_services_1.APIServices, AuthGuard_1.AuthGuardService],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
