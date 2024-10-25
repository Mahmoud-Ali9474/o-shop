import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, map, Subject, Subscription, switchMap, takeUntil } from 'rxjs';
import { Product } from 'shared/models/product';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { LoaderService } from 'shared/services/loader.service';
import { ProductService } from 'shared/services/product.service';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
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
    private cartService: ShoppingCartService,
    private loaderService: LoaderService) {
  }

  async ngOnInit(): Promise<void> {
    this.loaderService.show();
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
        this.loaderService.hide();
      });
  }

  ngOnDestroy(): void {
    this.productServiceSubscription.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}


