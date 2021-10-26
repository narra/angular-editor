/**
 * Copyright: (c) 2021, Michal Mocnak <michal@narra.eu>, Eric Rosenzveig <eric@narra.eu>
 * Copyright: (c) 2021, Narra Project
 * GNU General Public License v3.0+ (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
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
        const stringifyPreferences = localStorage.getItem(btoa('preferences_' + this.user.email));
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
    localStorage.setItem(btoa('preferences_' + this.user.email), btoa(JSON.stringify(this.preferences)));
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
