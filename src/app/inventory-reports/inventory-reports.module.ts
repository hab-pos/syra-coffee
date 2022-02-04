import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryReportsRoutingModule } from './inventory-reports-routing.module';
import { InventoryReportsComponent } from './inventory-reports.component';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ReportFormComponent } from './report-form/report-form.component';
import {FormsModule,ReactiveFormsModule} from "@angular/forms"
import { MatFormFieldModule } from '@angular/material/form-field';
@NgModule({
  declarations: [InventoryReportsComponent, ReportFormComponent],
  imports: [
    CommonModule,
    InventoryReportsRoutingModule,
    MatTableModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatSidenavModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule
  ]
})
export class InventoryReportsModule { }
