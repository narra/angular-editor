/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '@app/services';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // get current user
    const user = this.authService.user;
    // resolve response
    if (user) {
      if (!(next.data.roles && next.data.roles.filter(value => user.roles.includes(value))).length) {
        // role not authorised so redirect to home page
        this.router.navigate(['']);
        return false;
      }
      // authorised so return true
      return true;
    } else {
      // parse link and url
      const url = state.url.split('?')[0];
      const params = state.url.split('?')[1];
      // not logged in so redirect to login page with the return url
      this.router.navigate(['login'], {queryParams: {url, params}});
      return false;
    }
  }
}
