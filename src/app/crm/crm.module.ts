import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrmRoutingModule } from './crm-routing.module';
import { CrmComponent } from './crm.component';
import {FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ChartModule,AreaSeriesService,CategoryService,ZoomService,ColumnSeriesService,StackingColumnSeriesService,TooltipService } from '@syncfusion/ej2-angular-charts';
import { ChartsModule } from '@progress/kendo-angular-charts';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';

@NgModule({
  declarations: [CrmComponent],
  imports: [
    CommonModule,
    CrmRoutingModule,    
    FontAwesomeModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ChartModule,
    ChartsModule,
    MatTableModule,
    MatSortModule
  ],
  providers : [ 
    AreaSeriesService,
    CategoryService,
    ColumnSeriesService,
    StackingColumnSeriesService,
    TooltipService,
    ZoomService
  ],
})
export class CrmModule { }
