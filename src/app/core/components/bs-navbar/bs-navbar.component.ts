import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from 'shared/services/auth.service';
import { AppUser } from 'shared/models/app-user';
import { ShoppingCartService } from 'shared/services/shopping-cart.service';
@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent implements OnInit, OnDestroy {
  appUser: AppUser | null | undefined = null;
  shoppingCartItemCount: number = 0;
  subscription!: Subscription
  constructor(
    private auth: AuthService,
    private cartService: ShoppingCartService) {
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser)
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  async ngOnInit(): Promise<void> {
    this.subscription = (await this.cartService.getCart())
      .subscribe(cart => {
        this.shoppingCartItemCount = cart.totalCartItemsCount;

      })
  }

  logout() {
    this.auth.logout();
  }
}
