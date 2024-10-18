import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoryService } from '../services/category.service';
import { ProductService } from '../services/product.service';
import { map, Observable, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { Product } from '../models/product';
import { Category } from '../models/category';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ShoppingCart } from '../models/shopping-cart';
import { CartItem } from '../models/cart-item';
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
  shoppingCart!: ShoppingCart;
  private unsubscribe$ = new Subject<void>();
  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: ShoppingCartService) {
  }

  async ngOnInit(): Promise<void> {
    (await this.cartService.getCart())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cart) => {
        console.log(cart)
        this.shoppingCart = cart
      });
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
