import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InTransactionComponent } from './in-transaction.component';

const routes: Routes = [{ path: '', component: InTransactionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InTransactionRoutingModule { }
