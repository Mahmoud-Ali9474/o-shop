import { CartItem } from "./cart-item";

export class ShoppingCart {

  constructor(public id: string, public dateCreated: Date, public items: CartItem[] = []) { }
  get totalCartItemsCount() {
    let count = 0
    this.items.forEach((item) => {
      count += item.quantity;
    });
    return count;
  }

  get totalPrice() {
    let sum = 0;
    this.items.forEach((item) => {
      sum += item.totalPrice;
    })
    return sum;
  }

  getQuantity(productId: string) {
    let quantity = this.items?.find(p => p.id == productId)?.quantity || 0;
    return quantity;
  }
}
