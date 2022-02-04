import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InTransactionRoutingModule } from './in-transaction-routing.module';
import { InTransactionComponent } from './in-transaction.component';
import {MatTableModule} from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatSidenavModule} from '@angular/material/sidenav';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tooltipList' })
export class TooltipListPipe implements PipeTransform {


  transform(discount: any): string {

    let list: string = '';

    discount.forEach((data : any) => {
      let symbol = data.type == "percent" ? "%" : "€"
      list += data.discount_name + " : " + data.amount +  symbol
    });

    return list;
  }
}

@Pipe({ name: 'ProductTooltipList' })
export class ProductTooltipListPipe implements PipeTransform {


  transform(product: any): string {

    let list: string = '';

    
      let symbol = product.discount_type == "percent" ? "%" : "€"
      list += product.discount_name + " : " + product.discount_price +  symbol

    return list;
  }
}


@NgModule({
  declarations: [InTransactionComponent,TooltipListPipe],
  imports: [
    CommonModule,
    InTransactionRoutingModule,
    MatTableModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatSidenavModule
  ]
})
export class InTransactionModule { }
