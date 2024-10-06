import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { map, Observable, Subscription, switchMap } from 'rxjs';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
  productServiceSubscription!: Subscription;
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string = "all";
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService) {
  }

  ngOnInit(): void {
    this.productServiceSubscription = this.productService
      .getAll()
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(d => {
          let data = d.payload.doc.data() as Product;
          data.id = d.payload.doc.id;
          return data;
        })
      })).pipe(switchMap(products => {
        this.filteredProducts = this.products = products;
        return this.route.queryParamMap
      })).
      subscribe(params => {
        this.category = params.get('category') || "all"
        this.filteredProducts = this.category !== "all" ? this.products.filter(p => p.category === this.category) :
          this.products;
      });
  }

  ngOnDestroy(): void {
    this.productServiceSubscription.unsubscribe();
  }

}
