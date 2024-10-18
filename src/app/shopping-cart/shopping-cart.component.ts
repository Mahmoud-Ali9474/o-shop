import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  shoppingCart!: ShoppingCart;
  constructor(public cartService: ShoppingCartService) { }
  getProduct(item: CartItem) {
    const product = new Product();
    Object.assign(product, item);
    product.id = item.id
    return product;
  }
  async clearCart() {
    debugger;
    await this.cartService.clearCart()
  }
  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  async ngOnInit(): Promise<void> {
    (await this.cartService.getCart())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((cart) => {
        console.log(cart)
        this.shoppingCart = cart
      });
  }

}
