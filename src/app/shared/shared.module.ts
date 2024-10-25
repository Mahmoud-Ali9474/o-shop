import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';

import { LoaderComponent } from './components/loader/loader.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component';



@NgModule({
  declarations: [
    ProductCardComponent,
    ProductQuantityComponent,
    LoaderComponent,
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    FormsModule,
  ],
  exports: [
    ProductCardComponent,
    ProductQuantityComponent,
    LoaderComponent,
    CommonModule,
    DataTablesModule,
    FormsModule,
  ],
  providers: [

  ]
})
export class SharedModule { }
