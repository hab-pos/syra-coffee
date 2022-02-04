import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AuthGuardService} from './AuthGuard'
const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login-page/login-page.module').then(m => m.LoginPageModule),canActivate: [AuthGuardService] },
  { path: '', redirectTo : 'login', pathMatch : 'full'},
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),canActivate: [AuthGuardService] },
  { path: 'reports/sales', loadChildren: () => import('./sales-report/sales-report.module').then(m => m.SalesReportModule),canActivate: [AuthGuardService] },
  { path: 'reports/accounting', loadChildren: () => import('./accounting-report/accounting-report.module').then(m => m.AccountingReportModule),canActivate: [AuthGuardService] },
  { path: 'reports/time-tracking', loadChildren: () => import('./time-tracking/time-tracking.module').then(m => m.TimeTrackingModule),canActivate: [AuthGuardService] },
  { path: 'reports/control', loadChildren: () => import('./control-report/control-report.module').then(m => m.ControlReportModule),canActivate: [AuthGuardService] },
  { path: 'transactions/in', loadChildren: () => import('./in-transaction/in-transaction.module').then(m => m.InTransactionModule),canActivate: [AuthGuardService] },
  { path: 'transactions/out', loadChildren: () => import('./out-transaction/out-transaction.module').then(m => m.OutTransactionModule),canActivate: [AuthGuardService] },
  { path: 'products/pos', loadChildren: () => import('./pos-management/pos-management.module').then(m => m.POSManagementModule),canActivate: [AuthGuardService] },
  { path: 'products/inventory-orders', loadChildren: () => import('./inventory-orders/inventory-orders.module').then(m => m.InventoryOrdersModule),canActivate: [AuthGuardService] },
  { path: 'products/inventory-reports', loadChildren: () => import('./inventory-reports/inventory-reports.module').then(m => m.InventoryReportsModule),canActivate: [AuthGuardService] },
  { path: 'configurations/establishment', loadChildren: () => import('./establishment/establishment.module').then(m => m.EstablishmentModule),canActivate: [AuthGuardService] },
  { path: 'configurations/accounts', loadChildren: () => import('./account-configurations/account-configurations.module').then(m => m.AccountConfigurationsModule),canActivate: [AuthGuardService] },
  { path: 'configurations/catalouge', loadChildren: () => import('./catelouge-configurations/catelouge-configurations.module').then(m => m.CatelougeConfigurationsModule),canActivate: [AuthGuardService] },
  { path: 'configurations/setup', loadChildren: () => import('./setup-configurations/setup-configurations.module').then(m => m.SetupConfigurationsModule),canActivate: [AuthGuardService] },
  { path: 'app-control/store', loadChildren: () => import('./store/store.module').then(m => m.StoreModule) },
  { path: 'app-control/home-content', loadChildren: () => import('./home-control/home-control.module').then(m => m.HomeControlModule) },
  { path: 'crm', loadChildren: () => import('./crm/crm.module').then(m => m.CrmModule) },
  { path: 'paycomet-form', loadChildren: () => import('./card-component/card-component.module').then(m => m.CardComponentModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers:[
    AuthGuardService
  ]
})
export class AppRoutingModule { }
