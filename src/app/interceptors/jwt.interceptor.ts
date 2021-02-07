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
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService, UserPreferencesService} from '@app/services';
import {narra} from '@narra/api';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private narraServerService: narra.ServerService,
    private userPreferencesService: UserPreferencesService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.narraServerService.isInitialized) {
      // add auth header with jwt if user is logged in and request is to api url
      const isLoggedIn = request.url.includes('/users/me') || this.authService.isAuthenticated();
      const isApiUrl = request.url.startsWith(this.narraServerService.apiServer);
      // add header
      if (isLoggedIn && isApiUrl) {
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${this.authService.getToken()}`,
            'X-Narra-Admin': String(this.userPreferencesService.superuser)
          }
        });
      }
    }
    // send modified request
    return next.handle(request);
  }
}
