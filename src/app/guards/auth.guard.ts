/**
 * @license
 *
 * Copyright (C) 2020 narra.eu
 *
 * This file is part of Narra Editor.
 *
 * Narra Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Narra Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Narra Angular API. If not, see <http://www.gnu.org/licenses/>.
 *
 * Authors: Michal Mocnak <michal@narra.eu>
 */

import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthService} from '@app/services';
import {isFatalLinkerError} from "@angular/compiler-cli/linker";

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
