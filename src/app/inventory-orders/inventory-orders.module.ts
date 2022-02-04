import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryOrdersRoutingModule } from './inventory-orders-routing.module';
import { InventoryOrdersComponent } from './inventory-orders.component';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSidenavModule } from '@angular/material/sidenav';
import { InventoryOrderFormComponent } from './inventory-order-form/inventory-order-form.component';
import { NgxPrintModule } from 'ngx-print';
import {MatIconModule} from '@angular/material/icon';
import { AddproductComponentComponent } from './addproduct-component/addproduct-component.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AddInventoryOrderComponent } from './add-inventory-order/add-inventory-order.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [InventoryOrdersComponent, InventoryOrderFormComponent, AddproductComponentComponent, AddInventoryOrderComponent],
  imports: [
    CommonModule,
    InventoryOrdersRoutingModule,
    MatTableModule,
    NgxPrintModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatSidenavModule,
    MatIconModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule
  ]
})
export class InventoryOrdersModule { }
