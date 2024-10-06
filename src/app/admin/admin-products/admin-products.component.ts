import { Component, OnDestroy, OnInit } from '@angular/core';
import { ADTSettings } from 'angular-datatables/src/models/settings';
import { Subject, Subscription } from 'rxjs';
import { Product } from 'src/app/models/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit, OnDestroy {
  productServiceSubscription!: Subscription;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    responsive: true,
    pageLength: 10,
    paging: true,
    search: true,
    ordering: true
  };
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(private productService: ProductService) { }

  filter(query: string) {
    this.filteredProducts = this.products
      .filter(p => p.title.toLocaleLowerCase()
        .includes(query.toLocaleLowerCase()));
  }
  ngOnDestroy(): void {
    this.productServiceSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.productServiceSubscription = this.productService
      .getAll()
      .snapshotChanges()
      .subscribe(actions => {
        this.filteredProducts = this.products = actions.map(a => {
          let data = a.payload.doc.data()
          data.id = a.payload.doc.id;
          return data;
        });
        this.dtTrigger.next(null);
      })
  }
}
