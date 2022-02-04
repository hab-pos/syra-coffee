"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SharedModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/common/http");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var delete_component_1 = require("./components/delete/delete.component");
var confirm_component_1 = require("./components/confirm/confirm.component");
var table_detail_vw_component_1 = require("./components/table-detail-vw/table-detail-vw.component");
var SharedModule = /** @class */ (function () {
    function SharedModule() {
    }
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [delete_component_1.DeleteComponent, confirm_component_1.ConfirmComponent, table_detail_vw_component_1.TableDetailVwComponent],
            imports: [
                common_1.CommonModule,
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                http_1.HttpClientModule,
                ng_bootstrap_1.NgbModule
            ],
            exports: [
                forms_1.ReactiveFormsModule,
                forms_1.FormsModule,
                http_1.HttpClientModule,
                ng_bootstrap_1.NgbModule,
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
