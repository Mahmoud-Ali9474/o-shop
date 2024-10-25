import { Component, Input } from '@angular/core';
import { Product } from 'shared/models/product';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';

@Component({
  selector: 'product-quantity',
  templateUrl: './product-quantity.component.html',
  styleUrls: ['./product-quantity.component.css']
})
export class ProductQuantityComponent {
  @Input('product') product!: Product;
  @Input('shopping-cart') shoppingCart!: ShoppingCart;
  constructor(private cartService: ShoppingCartService) { }

  async addToCart() {
    await this.cartService.addToCart(this.product)
  }
  async removeFromCart() {
    await this.cartService.removeFromCart(this.product)
  }
}
