import { map } from 'rxjs';
import { Injectable } from '@angular/core';
import { ShoppingCartService } from './shopping-cart.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Order } from 'shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private db: AngularFirestore,
    private cartService: ShoppingCartService) { }

  async placeOrder(order: Order) {
    const payload = JSON.parse(JSON.stringify(order));
    console.log(payload);
    const result = await this.db.collection('Orders').add(payload);
    await this.cartService.clearCart()
    return result.id
  }
  getOrderByUser(userId: string) {
    return this.db.collection<Order>('Orders', (ref) =>
      ref.where('userId', '==', userId)
        .orderBy('dateCreated', 'desc')
    ).snapshotChanges()
      .pipe(map((o) => {
        return o.map(item => {
          const order = item.payload.doc.data() as Order;
          order.id = item.payload.doc.id;
          return order;
        })
      }))
  }
}
