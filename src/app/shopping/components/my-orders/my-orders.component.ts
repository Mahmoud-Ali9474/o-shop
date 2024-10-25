import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription, switchMap } from 'rxjs';
import { Order } from 'shared/models/order';
import { AuthService } from 'shared/services/auth.service';
import { OrderService } from 'shared/services/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit, OnDestroy {
  orders: Order[] = []
  subscription!: Subscription;
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    responsive: true,
    pageLength: 10,
    paging: true,
    search: true,
    ordering: true
  };
  dtTrigger: Subject<any> = new Subject<any>();
  constructor(
    private authService: AuthService,
    private orderService: OrderService) { }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    this.subscription = this.authService.user$.pipe(
      switchMap((user) => {
        if (!user)
          throw new Error("User can not be null");
        console.log("userID", user.uid)
        return this.orderService.getOrderByUser("fmKfXsWkVqgoDXVEB9zaYVEbRx32")
      })).subscribe(orders => {
        console.log(orders)
        this.orders = orders
        this.dtTrigger.next(null);
      })
  }

}
