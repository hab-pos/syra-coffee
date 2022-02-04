import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountingReportComponent } from './accounting-report.component';

const routes: Routes = [{ path: '', component: AccountingReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingReportRoutingModule { }
