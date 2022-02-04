import { NgModule,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountingReportRoutingModule } from './accounting-report-routing.module';
import { AccountingReportComponent } from './accounting-report.component';
import {MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AccumulationChartModule,PieSeriesService,AccumulationTooltipService,AccumulationAnnotationService } from '@syncfusion/ej2-angular-charts';
import {
  AccumulationDataLabelService } from '@syncfusion/ej2-angular-charts';

@NgModule({
  declarations: [AccountingReportComponent],
  imports: [
    CommonModule,
    AccountingReportRoutingModule,
    MatTableModule,
    MatTooltipModule,
    FontAwesomeModule,
    AccumulationChartModule,
  ],
  providers : [ 
    PieSeriesService,
    AccumulationTooltipService,
    AccumulationAnnotationService,
    AccumulationDataLabelService
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class AccountingReportModule { }
