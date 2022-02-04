import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CatelougeConfigurationsRoutingModule } from './catelouge-configurations-routing.module';
import { CatelougeConfigurationsComponent } from './catelouge-configurations.component';
import { MatTableModule } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Pipe, PipeTransform } from '@angular/core';
import { CatelougeFormComponent } from './catelouge-form/catelouge-form.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input'
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import {MatSortModule} from '@angular/material/sort';

@Pipe({ name: 'tooltipList' })
export class TooltipListPipe implements PipeTransform {


  transform(lines: string[]): string {

    let list: string = '';

    lines.forEach(line => {
      list += '• ' + line + '\n';
    });

    return list;
  }
}

@NgModule({
  declarations: [CatelougeConfigurationsComponent, TooltipListPipe, CatelougeFormComponent],
  imports: [
    CommonModule,
    CatelougeConfigurationsRoutingModule,
    MatTableModule,
    MatSidenavModule,
    FontAwesomeModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatTooltipModule,
    FormsModule,
    MatSortModule,
    ReactiveFormsModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class CatelougeConfigurationsModule { }
