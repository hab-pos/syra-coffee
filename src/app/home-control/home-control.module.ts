import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeControlRoutingModule } from './home-control-routing.module';
import { HomeControlComponent } from './home-control.component';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {ReactiveFormsModule,FormsModule} from "@angular/forms"
import {MatIconModule} from '@angular/material/icon';
import { FeaturedProductsFormComponent } from './featured-products-form/featured-products-form.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {  MatInputModule } from '@angular/material/input';
import { EventsFormComponent } from './events-form/events-form.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { QuillModule } from 'ngx-quill';
import { StoryComponentComponent } from './story-component/story-component.component';
@NgModule({
  declarations: [HomeControlComponent, FeaturedProductsFormComponent, EventsFormComponent, StoryComponentComponent],
  imports: [
    CommonModule,
    HomeControlRoutingModule,
    MatInputModule,
    MatAutocompleteModule,
    MatTableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatSidenavModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    DragDropModule,
    MatIconModule,
    MatSelectModule,
    QuillModule.forRoot()  
  ]
})
export class HomeControlModule { }
