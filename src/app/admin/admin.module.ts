import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { ProductFormComponent } from './components/product-form/product-form.component';
import { SharedModule } from 'shared/shared.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { authGuard } from 'shared/guards/auth.guard';
import { adminAuthGuard } from './guards/admin-auth.guard';



@NgModule({
  declarations: [
    AdminProductsComponent,
    AdminOrdersComponent,
    ProductFormComponent,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild([
      {
        path: 'admin/products',
        component: AdminProductsComponent,
        canActivate: [authGuard, adminAuthGuard]
      },
      {
        path: 'admin/products/new',
        component: ProductFormComponent,
        canActivate: [authGuard, adminAuthGuard]
      },
      {
        path: 'admin/products/:id',
        component: ProductFormComponent,
        canActivate: [authGuard, adminAuthGuard]
      },
      {
        path: 'admin/orders',
        component: AdminOrdersComponent,
        canActivate: [authGuard, adminAuthGuard]
      },
    ])
  ]
})
export class AdminModule { }
