import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFirestore) { }

  create(product: Product) {
    this.db.collection('products').add(product);
  }
  update(productId: string, product: Product) {
    this.db.doc(`products/${productId}`).update(product);
  }

  delete(productId: string) {
    this.db.doc(`products/${productId}`).delete();
  }
  getAll() {
    return this.db.collection<Product>('/products');
  }
  get(productId: string) {
    return this.db.doc<Product>(`products/${productId}`);
  }
}
