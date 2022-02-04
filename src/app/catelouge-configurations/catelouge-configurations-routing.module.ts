import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CatelougeConfigurationsComponent } from './catelouge-configurations.component';

const routes: Routes = [{ path: '', component: CatelougeConfigurationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CatelougeConfigurationsRoutingModule { }
