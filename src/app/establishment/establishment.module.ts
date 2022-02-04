import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { EstablishmentRoutingModule } from './establishment-routing.module';
import { EstablishmentComponent } from './establishment.component';


@NgModule({
  declarations: [EstablishmentComponent],
  imports: [
    CommonModule,
    EstablishmentRoutingModule,
    MatSnackBarModule
  ]
})
export class EstablishmentModule { }
