import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OutTransactionComponent } from './out-transaction.component';

const routes: Routes = [{ path: '', component: OutTransactionComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OutTransactionRoutingModule { }
