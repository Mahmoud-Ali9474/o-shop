import { Product } from 'shared/models/product';

export class CartItem {
  id!: string;
  title!: string;
  price!: number;
  imageUrl!: string;
  quantity!: number;
  constructor(product: Product, quantity: number) {
    this.id = product.id;
    this.title = product.title;
    this.price = product.price;
    this.imageUrl = product.imageUrl;
    this.quantity = quantity;
  }

  get totalPrice() {
    return this.price * this.quantity;
  }
}
