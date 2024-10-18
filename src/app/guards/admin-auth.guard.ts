import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { Observable, of, switchMap, map } from 'rxjs';
import { AppUser } from '../models/app-user';

export const adminAuthGuard: CanActivateFn = (route, state) => {
  let authService = inject(AuthService);
  return authService.appUser$.pipe(map(appUser => {
    //
    console.log(appUser);
    if (!appUser) {
      return false;
    }
    return appUser?.isAdmin || false;
  }))
};
