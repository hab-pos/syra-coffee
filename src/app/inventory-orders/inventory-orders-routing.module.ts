import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InventoryOrdersComponent } from './inventory-orders.component';

const routes: Routes = [{ path: '', component: InventoryOrdersComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryOrdersRoutingModule { }
