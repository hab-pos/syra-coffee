import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeControlComponent } from './home-control.component';

const routes: Routes = [{ path: '', component: HomeControlComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeControlRoutingModule { }
