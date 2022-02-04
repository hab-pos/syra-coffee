
import { StoreRoutingModule } from './store-routing.module';
import { StoreComponent } from './store.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {FormsModule,ReactiveFormsModule} from "@angular/forms"
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { ItemComponentComponent } from './item-component/item-component.component';
import { ModifierComponentComponent } from './modifier-component/modifier-component.component';
import { CategoryComponentComponent } from './category-component/category-component.component';
import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [StoreComponent, ItemComponentComponent, ModifierComponentComponent, CategoryComponentComponent],
  imports: [
    CommonModule,
    MatInputModule,
    StoreRoutingModule,
    MatTableModule,
    MatSidenavModule,
    MatAutocompleteModule,
    MatTooltipModule,
    FontAwesomeModule,
    MatSlideToggleModule,
    DragDropModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,    
    ReactiveFormsModule,
    MatIconModule, 
    QuillModule.forRoot()   
  ]
})
export class StoreModule { }
 