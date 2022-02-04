import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesReportRoutingModule } from './sales-report-routing.module';
import { SalesReportComponent } from './sales-report.component';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import {FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartModule,AreaSeriesService, SplineAreaSeriesService,CategoryService,ColumnSeriesService } from '@syncfusion/ej2-angular-charts';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSortModule} from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import { LegendService, ZoomService,ScrollBarService,TooltipService } from '@syncfusion/ej2-angular-charts';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [SalesReportComponent],
  imports: [
    CommonModule,
    SalesReportRoutingModule,
    MatTabsModule,
    MatTableModule,
    FontAwesomeModule,
    ChartModule,
    MatCheckboxModule,
    MatSortModule,
    MatTooltipModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers : [ 
    AreaSeriesService,
    LegendService,
    CategoryService,
    ZoomService,
    ScrollBarService,
    ColumnSeriesService,
    SplineAreaSeriesService,
    TooltipService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA  
  ]
})
export class SalesReportModule { }
