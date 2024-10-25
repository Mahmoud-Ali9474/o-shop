import { ItemLine } from "./item-line";
import { Shipping } from "./shipping";
import { ShoppingCart } from "./shopping-cart";

export class Order {
  id: string = "";
  dateCreated: number;
  totalPrice: number;
  totalItemsCount: number;
  itemLines: ItemLine[] = []


  constructor(public userId: string, public shipping: Shipping, shoppingCart: ShoppingCart) {
    this.dateCreated = new Date().getTime()
    this.totalPrice = shoppingCart.totalPrice
    this.totalItemsCount = shoppingCart.totalCartItemsCount;
    this.itemLines = shoppingCart.items.map(function (item) {
      return new ItemLine(item.title, item.price, item.totalPrice, item.quantity, item.imageUrl);
    });
  }
}
