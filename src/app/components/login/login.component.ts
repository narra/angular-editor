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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {Event} from '@app/models';
import {AuthService} from '@app/services';
import {ActivatedRoute, Router} from '@angular/router';
import {JwtHelperService} from '@auth0/angular-jwt';
import {EventType} from '@app/enums';
import {narra} from '@narra/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  // public
  public loading: boolean;
  public providers: narra.Provider[];
  public selected: narra.Provider;

  // private
  private subscription: Subscription;

  constructor(
    private providerService: narra.ProviderService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private serverService: narra.ServerService) {
    this.loading = true;
  }

  ngOnInit(): void {
    // get return url
    const url = this.route.snapshot.queryParamMap.get('url') || '';
    const params = {};
    // parse params
    (this.route.snapshot.queryParamMap.get('params') || '').split('&').filter((param) => param.includes('=')).forEach((param) => {
      // parse into pair
      const pair = param.split('=');
      // add into param
      params[pair[0]] = pair[1];
    });

    // subscribe for authService events
    this.subscription = this.authService.register().subscribe((event: Event<narra.User>) => {
      if (event.type === EventType.auth_login) {
        this.router.navigate([url], {queryParams: params});
      }
    });

    // check for token
    if (!this.authService.isAuthenticated()) {
      // prepare helper
      const helper = new JwtHelperService();
      // get token
      const token = this.route.snapshot.queryParamMap.get('token');
      // check for it
      if (!helper.isTokenExpired(token)) {
        this.authService.login(token);
      }
    }
    // resolve auth providers
    this.providerService.getProviders().subscribe((response) => {
      this.providers = response.providers;
      this.selected = response.providers[0];
      this.loading = false;
    });
  }

  ngOnDestroy(): void {
    // unsubscribe
    this.subscription.unsubscribe();
  }

  public authenticate(): void {
    window.location.href = this.serverService.apiServer + '/auth/' + this.selected.name + '?origin=' + window.location;
  }
}
