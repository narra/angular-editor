/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
