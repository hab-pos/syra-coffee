import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccountConfigurationsComponent } from './account-configurations.component';

const routes: Routes = [{ path: '', component: AccountConfigurationsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountConfigurationsRoutingModule { }
