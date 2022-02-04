import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ControlReportComponent } from './control-report.component';

const routes: Routes = [{ path: '', component: ControlReportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ControlReportRoutingModule { }
