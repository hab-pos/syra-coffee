import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { POSManagementRoutingModule } from './pos-management-routing.module';
import { POSManagementComponent } from './pos-management.component';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProductFormComponent } from './product-form/product-form.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {FormsModule,ReactiveFormsModule} from "@angular/forms"
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [POSManagementComponent, ProductFormComponent, CategoryFormComponent],
  imports: [
    CommonModule,
    POSManagementRoutingModule,
    MatTableModule,
    MatSidenavModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    DragDropModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule
  ]
})
export class POSManagementModule { }
