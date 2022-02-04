import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupConfigurationsComponent } from './setup-configurations.component';

const routes: Routes = [{ path: '', component: SetupConfigurationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SetupConfigurationsRoutingModule { }
