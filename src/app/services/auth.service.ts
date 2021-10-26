/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import {Injectable} from '@angular/core';
import {JwtHelperService} from '@auth0/angular-jwt';
import {Router} from '@angular/router';
import {Event} from '@app/models';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {EventType} from '@app/enums';
import {Publisher} from '@app/models/publisher';
import {narra} from '@narra/api';

@Injectable({
  providedIn: 'root'
})
export class AuthService extends Publisher<narra.User> {
  private userSubject: BehaviorSubject<narra.User>;

  constructor(private router: Router, private userService: narra.UserService) {
    // call ancestor constructor
    super();
    // set up user subject
    this.userSubject = new BehaviorSubject<narra.User>(undefined);
  }

  private _login() {
    // check for
    this.userService.getLoggedUser().subscribe(response => {
      // store user
      this.userSubject.next(response.user);
      // emit message
      this.broadcast(Event.complex<narra.User>(EventType.auth_login, response.user));
    });
  }

  public isAuthenticated(): boolean {
    const helper = new JwtHelperService();
    // Check whether the token is expired and return
    // true or false
    if (helper.isTokenExpired(this.getToken())) {
      return false;
    } else {
      // if there is no user defined get it
      if (this.user === undefined) {
        // login for user details
        this._login();
      }
      // return
      return true;
    }
  }

  public get user(): narra.User {
    return this.userSubject.value;
  }

  public getToken(): string {
    return localStorage.getItem('token');
  }

  public login(token: string): void {
    // check for authentication
    if (!this.isAuthenticated()) {
      // set token
      localStorage.setItem('token', token);
      // login
      this._login();
    }
  }

  public logout(): void {
    // remove token and user
    localStorage.removeItem('token');
    this.userSubject.next(undefined);
    // emit message
    this.broadcast(Event.simple(EventType.auth_logout));
    // redirect
    this.router.navigate(['login']);
  }
}
