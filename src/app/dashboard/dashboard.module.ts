import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import {FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ChartModule,AreaSeriesService,CategoryService,ZoomService,ColumnSeriesService,StackingColumnSeriesService,TooltipService } from '@syncfusion/ej2-angular-charts';

@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    ChartModule
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
export class DashboardModule { }
