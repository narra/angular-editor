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
import {Event, Publisher, UserPreferences} from '@app/models';
import {EventType, UserPreferencesType} from '@app/enums';
import {AuthService} from '@app/services/auth.service';
import {Subscription} from 'rxjs';
import {narra} from '@narra/api';
import {EventService} from '@app/services/event.service';

@Injectable({
  providedIn: 'root'
})
export class UserPreferencesService {

  private preferences: UserPreferences;
  private subscription: Subscription;
  private user: narra.User;

  constructor(
    private authService: AuthService,
    private eventService: EventService
  ) {
    // init subscription to auth service
    this.subscription = this.authService.register().subscribe(event => {
      if (event.type === EventType.auth_login) {
        // store user
        this.user = event.content;
        // get user preferences
        const stringifyPreferences = localStorage.getItem(btoa('preferences_' + this.user.username));
        // parse if any chance
        if (stringifyPreferences) {
          this.preferences = JSON.parse(atob(stringifyPreferences));
        }
      }
    });
    // initialize with default
    this.preferences = {
      superuser: false
    };
  }

  private _save(): void {
    localStorage.setItem(btoa('preferences_' + this.user.username), btoa(JSON.stringify(this.preferences)));
  }

  // getters
  public get superuser(): boolean {
    return this.preferences.superuser;
  }

  // setters
  public set superuser(value: boolean) {
    if (!(this.preferences.superuser === value)) {
      // set new value
      this.preferences.superuser = value;
      // store
      this._save();
      // broadcast change
      this.eventService.broadcastUserPreferencesEvent(UserPreferencesType.superuser, EventType.user_preferences_updated);
    }
  }
}
