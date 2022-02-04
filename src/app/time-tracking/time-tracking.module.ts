import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeTrackingRoutingModule } from './time-tracking-routing.module';
import { TimeTrackingComponent } from './time-tracking.component';
import {FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatTooltipModule } from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { ChartsModule } from '@progress/kendo-angular-charts';


@NgModule({
  declarations: [TimeTrackingComponent],
  imports: [
    CommonModule,
    ChartsModule,
    TimeTrackingRoutingModule,
    FontAwesomeModule,
    MatTooltipModule,
    MatCheckboxModule,
  ]
})
export class TimeTrackingModule { }
