import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeTrackingComponent } from './time-tracking.component';

const routes: Routes = [{ path: '', component: TimeTrackingComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimeTrackingRoutingModule { }
