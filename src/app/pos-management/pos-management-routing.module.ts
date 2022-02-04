import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { POSManagementComponent } from './pos-management.component';

const routes: Routes = [{ path: '', component: POSManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class POSManagementRoutingModule { }
