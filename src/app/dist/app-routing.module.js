"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var AuthGuard_1 = require("./AuthGuard");
var routes = [
    { path: 'login', loadChildren: function () { return Promise.resolve().then(function () { return require('./login-page/login-page.module'); }).then(function (m) { return m.LoginPageModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'dashboard', loadChildren: function () { return Promise.resolve().then(function () { return require('./dashboard/dashboard.module'); }).then(function (m) { return m.DashboardModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'reports/sales', loadChildren: function () { return Promise.resolve().then(function () { return require('./sales-report/sales-report.module'); }).then(function (m) { return m.SalesReportModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'reports/accounting', loadChildren: function () { return Promise.resolve().then(function () { return require('./accounting-report/accounting-report.module'); }).then(function (m) { return m.AccountingReportModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'reports/time-tracking', loadChildren: function () { return Promise.resolve().then(function () { return require('./time-tracking/time-tracking.module'); }).then(function (m) { return m.TimeTrackingModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'reports/control', loadChildren: function () { return Promise.resolve().then(function () { return require('./control-report/control-report.module'); }).then(function (m) { return m.ControlReportModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'transactions/in', loadChildren: function () { return Promise.resolve().then(function () { return require('./in-transaction/in-transaction.module'); }).then(function (m) { return m.InTransactionModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'transactions/out', loadChildren: function () { return Promise.resolve().then(function () { return require('./out-transaction/out-transaction.module'); }).then(function (m) { return m.OutTransactionModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'products/pos', loadChildren: function () { return Promise.resolve().then(function () { return require('./pos-management/pos-management.module'); }).then(function (m) { return m.POSManagementModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'products/inventory-orders', loadChildren: function () { return Promise.resolve().then(function () { return require('./inventory-orders/inventory-orders.module'); }).then(function (m) { return m.InventoryOrdersModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'products/inventory-reports', loadChildren: function () { return Promise.resolve().then(function () { return require('./inventory-reports/inventory-reports.module'); }).then(function (m) { return m.InventoryReportsModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'configurations/establishment', loadChildren: function () { return Promise.resolve().then(function () { return require('./establishment/establishment.module'); }).then(function (m) { return m.EstablishmentModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'configurations/accounts', loadChildren: function () { return Promise.resolve().then(function () { return require('./account-configurations/account-configurations.module'); }).then(function (m) { return m.AccountConfigurationsModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'configurations/catalouge', loadChildren: function () { return Promise.resolve().then(function () { return require('./catelouge-configurations/catelouge-configurations.module'); }).then(function (m) { return m.CatelougeConfigurationsModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'configurations/setup', loadChildren: function () { return Promise.resolve().then(function () { return require('./setup-configurations/setup-configurations.module'); }).then(function (m) { return m.SetupConfigurationsModule; }); }, canActivate: [AuthGuard_1.AuthGuardService] },
    { path: 'app-control/store', loadChildren: function () { return Promise.resolve().then(function () { return require('./store/store.module'); }).then(function (m) { return m.StoreModule; }); } },
    { path: 'app-control/home-content', loadChildren: function () { return Promise.resolve().then(function () { return require('./home-control/home-control.module'); }).then(function (m) { return m.HomeControlModule; }); } },
    { path: 'crm', loadChildren: function () { return Promise.resolve().then(function () { return require('./crm/crm.module'); }).then(function (m) { return m.CrmModule; }); } }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(routes)],
            exports: [router_1.RouterModule],
            providers: [
                AuthGuard_1.AuthGuardService
            ]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
