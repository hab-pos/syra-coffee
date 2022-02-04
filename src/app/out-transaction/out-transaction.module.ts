import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutTransactionRoutingModule } from './out-transaction-routing.module';
import { OutTransactionComponent } from './out-transaction.component';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [OutTransactionComponent],
  imports: [
    CommonModule,
    OutTransactionRoutingModule,
    MatTableModule,
    MatSidenavModule,
    FontAwesomeModule,
    MatTooltipModule
  ]
})
export class OutTransactionModule { }
