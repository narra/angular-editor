/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
