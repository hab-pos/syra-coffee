import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeleteComponent } from './components/delete/delete.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { TableDetailVwComponent } from './components/table-detail-vw/table-detail-vw.component';

@NgModule({
  declarations: [DeleteComponent, ConfirmComponent, TableDetailVwComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgbModule,
  ],
})
export class SharedModule { }
