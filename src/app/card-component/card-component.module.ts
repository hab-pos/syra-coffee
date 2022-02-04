import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CardComponentRoutingModule } from './card-component-routing.module';
import { CardComponentComponent } from './card-component.component';


@NgModule({
  declarations: [CardComponentComponent],
  imports: [
    CommonModule,
    CardComponentRoutingModule
  ]
})
export class CardComponentModule { }
