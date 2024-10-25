import { UserService } from 'shared/services/user.service';
import { Component } from '@angular/core';
import { AuthService } from 'shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'o-shop';
  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    this.authService.user$.subscribe(user => {
      if (user) {
        userService.save(user);
        let returnUrl = localStorage.getItem('returnUrl');
        localStorage.removeItem('returnUrl');
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl!);
        }
      }
    })
  }
}
