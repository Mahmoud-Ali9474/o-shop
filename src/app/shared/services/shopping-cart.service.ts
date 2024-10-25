import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from 'shared/models/product';
import { CartItem } from 'shared/models/cart-item';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { combineLatest } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFirestore) { }
  private getItem(cartId: string, productId: string) {
    return this.db.doc<any>(`shopping-carts/${cartId}/items/${productId}`)
  }
  async getCart() {
    const cartId = await this.getOrCreateCartId();
    const cart$ = this.db.doc<ShoppingCart>(`shopping-carts/${cartId}`).snapshotChanges();
    const items$ = this.db.collection<CartItem>(`shopping-carts/${cartId}/items`).snapshotChanges();

    return combineLatest(cart$, items$, (cart, items) => {
      const shoppingCart = cart.payload.data() as ShoppingCart || new ShoppingCart("", new Date());
      const cartItems = items.map(x => {

        const item = x.payload.doc.data() as CartItem;
        const product = new Product()
        Object.assign(product, item)
        product.id = x.payload.doc.id;
        console.log(product);
        return new CartItem(product, item.quantity);
      })
      shoppingCart.items = cartItems;
      return new ShoppingCart(cart.payload.id, shoppingCart.dateCreated, shoppingCart.items);
    })

  }

  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    const snapshot = await this.db.collection(`shopping-carts/${cartId}/items`).ref.get();
    //const snapshot = await this.db.collection('shopping-carts').doc(cartId).ref.get();
    const batch = this.db.firestore.batch(); // Create a batch operation

    snapshot.forEach(doc => {
      batch.delete(doc.ref); // Add each doc deletion to the batch
    });

    await batch.commit();
  }
  private async getCartItems() {
    const cartId = await this.getOrCreateCartId();
    return this.db.collection<CartItem>(`shopping-carts/${cartId}/items`);
  }
  async addToCart(product: Product) {
    this.updateItem(product, 1);
  }
  async removeFromCart(product: Product) {
    this.updateItem(product, -1);
  }
  private async updateItem(product: Product, change: number) {
    const cartId = await this.getOrCreateCartId();
    const item$ = this.getItem(cartId, product.id);
    item$.get().subscribe(item => {
      if (item.exists) {
        let quantity = item.data()?.quantity + change;
        if (quantity) {
          item$.update({
            title: product.title,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity: item.data()?.quantity + change
          })
        } else {
          item$.delete();
        }

      } else {
        item$.set({
          title: product.title,
          price: product.price,
          imageUrl: product.imageUrl,
          quantity: 1
        })
      }
    });
  }
  private async getOrCreateCartId() {
    const cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    const result = await this.create()
    localStorage.setItem('cartId', result.id);
    return result.id;
  }
  private create() {
    return this.db.collection('shopping-carts').add({
      dateCreated: new Date().getTime()
    });
  }
}
