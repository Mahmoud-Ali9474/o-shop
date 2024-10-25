import { Component, Input, OnInit } from '@angular/core';
import { Shipping } from 'shared/models/shipping';
import { ShoppingCart } from 'shared/models/shopping-cart';
import { Order } from 'shared/models/order';
import { AuthService } from 'shared/services/auth.service';
import { OrderService } from 'shared/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit {
  @Input('cart') cart!: ShoppingCart
  shipping: Shipping = {
    name: "",
    addressLine1: "",
    addressLine2: "",
    city: ""
  }
  userId!: string;
  constructor(
    private router: Router,
    private authService: AuthService,
    private orderService: OrderService
  ) { }
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (!user)
        throw new Error("user can not be null");
      this.userId = user.uid
    })
  }
  async placeOrder() {
    const order = new Order(this.userId, this.shipping, this.cart);
    const id = await this.orderService.placeOrder(order);
    this.router.navigate(['order-success', id]);
  }
}
