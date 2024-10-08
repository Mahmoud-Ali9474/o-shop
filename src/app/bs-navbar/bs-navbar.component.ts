import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';
@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.css']
})
export class BsNavbarComponent {
  appUser: AppUser | null | undefined = null;
  constructor(private auth: AuthService) {
    this.auth.appUser$.subscribe(appUser => this.appUser = appUser)
  }

  logout() {
    this.auth.logout();
  }
}
