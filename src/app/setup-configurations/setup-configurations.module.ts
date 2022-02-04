import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupConfigurationsRoutingModule } from './setup-configurations-routing.module';
import { SetupConfigurationsComponent } from './setup-configurations.component';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SetupFormComponent } from './setup-form/setup-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';

import {ReactiveFormsModule,FormsModule} from "@angular/forms"
@NgModule({
  declarations: [SetupConfigurationsComponent, SetupFormComponent],
  imports: [
    CommonModule,
    SetupConfigurationsRoutingModule,
    MatTableModule,
    MatSidenavModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule
  ]
})
export class SetupConfigurationsModule { }
